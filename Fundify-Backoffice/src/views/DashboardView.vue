<template>
  <div>
    <div class="flex flex-col items-center mb-4" v-if="isApproved || selectedMerchant">
      <div class="mb-6">
        <h1 class="text-3xl font-semibold">Tableau de bord</h1>
      </div>
      <div class="w-full mb-6">
        <div class="border border-gray-300 shadow">
          <h3 class="text-xl p-3">Argent généré par jour</h3>
          <div class="p-3">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2">
        <div class="border border-gray-300 shadow">
          <h3 class="text-xl p-3">Transactions réussies</h3>
          <div class="p-3">
            <canvas ref="successfullTransactionsChart"></canvas>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center mb-4" v-if="isAdmin && !selectedMerchant">
      <div class="mb-6">
        <h1 class="text-3xl font-semibold">Tableau de bord</h1>
      </div>
      <div class="w-full mb-6">
        <div class="border border-gray-300 shadow">
          <h3 class="text-xl p-3">Nombre de marchands: {{ merchantCount }}</h3>
          <div class="p-3">
            <canvas ref="merchantChart"></canvas>
          </div>
        </div>
      </div>
      <div class="flex justify-around w-full mb-6">
        <div class="border border-gray-300 shadow">
          <h3 class="text-xl p-3">Marchands par statut</h3>
          <div class="p-3">
            <canvas ref="merchantValidationsChart"></canvas>
          </div>
        </div>
        <div class="w-full mb-6 ml-3 place-self-center">
          <div class="border border-gray-300 shadow">
            <h3 class="text-xl p-3">Transactions par statut</h3>
            <div class="p-3">
              <canvas ref="transactionStatusChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center mb-4" v-else-if="!isApproved && !selectedMerchant">
      <MerchantWaiting />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import {
  Chart, BarController, CategoryScale, LinearScale, DoughnutController, ArcElement, BarElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import MerchantWaiting from '../components/MerchantWaiting.vue';

const router = useRouter();
const store = useStore();
const isAdmin = computed(() => store.state.isAdmin);
const isLogged = computed(() => store.state.isLoggedIn);
const isApproved = computed(() => store.state.isApproved);
const selectedMerchant = localStorage.getItem('selectedMerchant');
const merchantId = computed(() => {
  if (selectedMerchant !== null) {
    return selectedMerchant;
  }
  return store.state.merchantId;
});

Chart.register(BarController, CategoryScale, LinearScale, DoughnutController, ArcElement, BarElement, LineElement, Title, Tooltip, Legend);

const revenueChart = ref(null);
const successfullTransactionsChart = ref(null);
const merchantChart = ref(null);
const merchantValidationsChart = ref(null);
const transactionStatusChart = ref(null);
const merchantRegisteredCount = ref(0);
const merchantRegisteredDate = ref(null);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const merchantCount = ref(0);
const merchantValidate = ref(0);
const merchantWaiting = ref(0);

function processDailyTotals(infos) {
  const dailyTotals = infos.reduce((totals, info) => {
    const date = new Date(info.createdAt).toISOString().split('T')[0];
    const newTotals = { ...totals };
    if (!newTotals[date]) newTotals[date] = 0;
    newTotals[date] += parseFloat(info.amount);
    return newTotals;
  }, {});

  const dailyTotalArray = Object.entries(dailyTotals);
  dailyTotalArray.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

  const dates = dailyTotalArray.map((entry) => entry[0]);
  const totals = dailyTotalArray.map((entry) => entry[1]);

  return { dates, totals };
}

onMounted(async () => {
  if (!isLogged.value) {
    router.push('/login');
  } else if (isApproved.value || store.state.selectedMerchant !== null) {
    console.log('ici');

    const request = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/merchants/${merchantId.value}/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    console.log(request);
    console.log('ici');
    const infos = await request.json();

    // ['created', 'processing', 'done', 'failed'],
    const createdCount = infos.filter((info) => info.status === 'created').length;
    const processingCount = infos.filter((info) => info.status === 'processing').length;
    const doneCount = infos.filter((info) => info.status === 'done').length;
    const failedCount = infos.filter((info) => info.status === 'failed').length;

    const { dates, totals } = processDailyTotals(infos);
    if (revenueChart.value && successfullTransactionsChart.value) {
      // eslint-disable-next-line
      new Chart(revenueChart.value, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: 'Argent généré',
            data: totals,
            backgroundColor: '#6366F1',
            borderColor: '#6366F1',
            borderWidth: 1,
          }],
        },
        options: chartOptions,
      });

      // eslint-disable-next-line
      new Chart(successfullTransactionsChart.value, {
        type: 'doughnut',
        data: {
          labels: ['Transactions créées', 'Transactions en cours', 'Transactions terminées', 'Transactions échouées'],
          datasets: [{
            label: 'Transactions',
            data: [createdCount, processingCount, doneCount, failedCount],
            backgroundColor: ['#6366F1', '#F3F4F6', '#34D399', '#F87171'],
            borderColor: ['#6366F1', '#F3F4F6', '#34D399', '#F87171'],
            borderWidth: 1,
          }],
        },
        options: chartOptions,
      });
    }
  } else if (isAdmin.value && store.state.selectedMerchant === null) {
    if (merchantChart.value) {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/kpis/merchants-registered`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        console.log('error : while fetching data');
        return;
      }
      const infos = await response.json();

      if (Array.isArray(infos)) {
        // eslint-disable-next-line no-underscore-dangle
        infos.sort((a, b) => new Date(a._id) - new Date(b._id));

        // eslint-disable-next-line no-underscore-dangle
        merchantRegisteredDate.value = infos.map((item) => item._id);
        merchantRegisteredCount.value = infos.map((item) => item.count);

        merchantCount.value = merchantRegisteredCount.value.reduce((a, b) => a + b, 0);
      }

      // eslint-disable-next-line
      new Chart(merchantChart.value, {
        type: 'bar',
        data: {
          labels: merchantRegisteredDate.value,
          datasets: [{
            label: 'Registered Merchants',
            data: merchantRegisteredCount.value,
            backgroundColor: '#7a7de7',
            borderColor: '#7a7de7',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          height: 300,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }

    if (merchantValidationsChart.value) {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/kpis/merchants-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        console.log('error : while fetching data');
        return;
      }
      const infos = await response.json();

      if (Array.isArray(infos)) {
        // eslint-disable-next-line no-underscore-dangle
        merchantValidate.value = infos.find((info) => info._id === true)?.count || 0;
        // eslint-disable-next-line no-underscore-dangle
        merchantWaiting.value = infos.find((info) => info._id === false)?.count || 0;
      }

      // eslint-disable-next-line
      new Chart(merchantValidationsChart.value, {
        type: 'doughnut',
        data: {
          labels: ['Marchands validés', 'Marchands en attente'],
          datasets: [{
            label: 'Marchands',
            data: [merchantValidate.value, merchantWaiting.value],
            backgroundColor: ['#6366F1', '#F3F4F6'],
            borderColor: ['#6366F1', '#F3F4F6'],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    }

    if (transactionStatusChart.value) {
      const getTransactionsByStatusKPIS = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/kpis/transactions-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!getTransactionsByStatusKPIS.ok) {
        console.log('error : while fetching data');
        return;
      }

      const transactionsByStatusKPIS = await getTransactionsByStatusKPIS.json();

      // eslint-disable-next-line no-underscore-dangle
      const transactionCaptured = transactionsByStatusKPIS.find((info) => info._id === 'captured')?.count || 0;

      // eslint-disable-next-line no-underscore-dangle
      const transactionCreated = transactionsByStatusKPIS.find((info) => info._id === 'created')?.count || 0;

      // eslint-disable-next-line no-underscore-dangle
      const transactionWaitingRefound = transactionsByStatusKPIS.find((info) => info._id === 'waiting_refound')?.count || 0;

      // eslint-disable-next-line no-underscore-dangle
      const transactionRefunded = transactionsByStatusKPIS.find((info) => info._id === 'refunded')?.count || 0;

      // eslint-disable-next-line no-underscore-dangle
      const transactionPartialRefound = transactionsByStatusKPIS.find((info) => info._id === 'partial_refound')?.count || 0;

      // eslint-disable-next-line no-underscore-dangle
      const transactionFaild = transactionsByStatusKPIS.find((info) => info._id === 'failed')?.count || 0;

      // eslint-disable-next-line
      new Chart(transactionStatusChart.value, {
        type: 'bar',
        data: {
          labels: ['capturées', 'créées', 'en attente de remboursement', 'remboursées', 'partiellement remboursées', 'échouées'],
          datasets: [{
            label: 'Transactions par statut',
            data: [transactionCaptured, transactionCreated, transactionWaitingRefound, transactionRefunded, transactionPartialRefound, transactionFaild],
            backgroundColor: ['#6366F1', '#84de20', '#F87171', '#854d0e', '#134e4a', '#d8b4fe'],
            borderColor: ['#6366F1', '#84de20', '#F87171', '#854d0e', '#134e4a', '#d8b4fe'],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }
  }
});
</script>

<style scoped>
.v-card {
  border-radius: 15px;
  transition: box-shadow .3s ease-in-out;
}
.v-card:hover {
  box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
}
h1 {
  color: #424242;
}
.headline {
  color: #424242;
  text-transform: uppercase;
  letter-spacing: .1em;
}
</style>

<script setup>
import {
  computed, onMounted, reactive, ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { Refresh } from '@iconsans/vue/linear';
import TransactionStatusChip from '../components/TransactionStatusChip.vue';
import OperationStatusChip from '../components/OperationStatusChip.vue';
import CustomDialog from '../components/CustomDialog.vue';
import formatDate from '../utils/formatDate';

const transactionDetails = ref({});
const refundForm = reactive({
  amount: '',
});

const store = useStore();
const route = useRoute();
const isAdmin = computed(() => store.state.isAdmin);
const merchantId = computed(() => store.state.merchantId);
const id = computed(() => store.state.id);

const getTransactionDetailsByMerchant = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/merchants/${merchantId.value}/transaction/${route.params.id}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );
  if (response.ok) {
    const data = await response.json();
    // eslint-disable-next-line prefer-destructuring
    transactionDetails.value = data[0];
    refundForm.amount = transactionDetails.value.refundAmountAvailable;
  } else {
    console.error('An error occurred.');
  }
};

const getTransactionDetailsByAdmin = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/transaction/${route.params.id}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );
  if (response.ok) {
    const data = await response.json();
    // eslint-disable-next-line prefer-destructuring
    transactionDetails.value = data[0];
    refundForm.amount = transactionDetails.value.refundAmountAvailable;
  }
  console.error('An error occurred.');
};

const getTransactionDetails = async () => {
  if (isAdmin.value) {
    await getTransactionDetailsByAdmin();
  } else {
    await getTransactionDetailsByMerchant();
  }
};

onMounted(() => getTransactionDetails());

const refundAmountIsValid = computed(() => {
  const amount = Number(refundForm.amount);
  const refundAmountAvailable = Number(transactionDetails.value.refundAmountAvailable);
  return amount > 0 && amount <= refundAmountAvailable;
});

const createRefund = async (onClose) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/operations`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactionId: transactionDetails.value.transactionId,
      amount: parseFloat(refundForm.amount, 10),
    }),
  });
  if (response.ok) {
    await getTransactionDetails();
    onClose();
    console.log('Refund created');
  } else {
    console.error('An error occurred.');
  }
};

const shortId = (idToShorted) => idToShorted.substring(0, 8);

</script>

<template>
  <v-card elevation="4" variant="elevated">
    <v-card-title class="card-title">
      <h1 class="text-2xl font-bold">Transaction #{{ transactionDetails.transactionId }}</h1>
      <v-btn color="blue" variant="outlined" icon @click="getTransactionDetails">
        <Refresh height="26" width="26" />
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row no-gutters>
          <v-col
              cols="12"
              sm="6"
          >
            <v-card-subtitle>
              <p class="text-xl font-bold">Montant: {{ transactionDetails.amount }} {{ transactionDetails.currency }}</p>
              <p class="text-xl font-bold">Montant remboursable: {{ transactionDetails.refundAmountAvailable }} {{ transactionDetails.currency }}</p>
              <p class="text-xl font-bold">Statut: <TransactionStatusChip :transaction-status="transactionDetails.status" /></p>
            </v-card-subtitle>

            <div class="mt-5">
              <CustomDialog v-if="!['created', 'refunded'].includes(transactionDetails.status)">
                <template #openButton="{ openDialog }">
                  <v-btn
                      color="primary"
                      @click="openDialog"
                  >
                    Rembourser
                  </v-btn>
                </template>
                <template #title>
                  <h3 class="text-xl font-bold">Effectuer un remboursement</h3>
                </template>
                <template #content>
                  <v-form>
                    <v-text-field
                        class="text-field-amount"
                        v-model="refundForm.amount"
                        :rules="[refundAmountIsValid || 'Montant incorrect, le montant doit être supérieur à 0 et inférieur au montant remboursable']"
                        label="Montant à rembourser"
                        type="number"
                        variant="outlined"
                        required
                    />
                  </v-form>
                </template>

                <template #actions="{ closeDialog }">
                  <v-btn
                      color="inherit"
                      @click="closeDialog"
                      :disabled="!refundAmountIsValid"
                  >
                    Abandonner
                  </v-btn>
                  <v-btn
                      color="primary"
                      @click="() => createRefund(closeDialog)"
                      :disabled="!refundAmountIsValid"
                  >
                    Rembourser
                  </v-btn>
                </template>

              </CustomDialog>
            </div>
          </v-col>

          <v-col
              cols="12"
              sm="6"
          >
            <div>
              <h3 class="text-xl font-bold">Historique de la transaction</h3>
              <v-table
                  fixed-header
                  height="270px"
                  class="pa-2 ma-2"
                  style="margin-bottom: 20px; border: 1px solid #dadada; border-radius: 10px" >
                <thead style=" z-index: 1100;">
                <tr>
                  <th class="text-left">
                    Statut
                  </th>
                  <th class="text-left">
                    Date
                  </th>
                </tr>
                </thead>
                <tbody
                    style="overflow: scroll"
                >
                <tr
                    v-for="item in transactionDetails.statusHist"
                    :key="item.status"
                >
                  <td><TransactionStatusChip :transaction-status="item.status" /></td>
                  <td>{{ formatDate(item.date) }}</td>
                </tr>
                </tbody>
              </v-table>
            </div>
          </v-col>

        </v-row>
      </v-container>

      <div class="pt-4">
        <h3 class="text-xl font-bold">Opération de la transaction</h3>
        <v-table
            fixed-header
            class="pa-2 ma-2"
            height="300px"
            style="margin-bottom: 20px; overflow: scroll; border: 1px solid #dadada; border-radius: 10px; z-index: 1000"
        >
          <thead style=" z-index: 1100;">
          <tr>
            <th class="text-left">
              Id
            </th>
            <th class="text-left">
              Type
            </th>
            <th class="text-left">
              Montant
            </th>
            <th class="text-left">
              Statut
            </th>
            <th class="text-left">
              Historique de status
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in transactionDetails.operations"
              :key="item.id"
          >
            <td>{{ shortId(item.operationId) }}</td>
            <td>{{ item.type === 'capture' ? 'Règlement' : 'Remboursement' }}</td>
            <td>{{ item.amount }}</td>
            <td><OperationStatusChip :operation-status="item.status" /></td>
            <td>
              <CustomDialog>
                <template #title>
                  <h3 class="text-xl font-bold">Historique de l'opération</h3>
                </template>

                <template #content>
                  <v-table>
                    <thead>
                    <tr>
                      <th class="text-left">
                        Statut
                      </th>
                      <th class="text-left">
                        Date
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item in item.statusHist"
                        :key="item.status"
                    >
                      <td><OperationStatusChip :operation-status="item.status" /></td>
                      <td>{{ formatDate(item.date) }}</td>
                    </tr>
                    </tbody>
                  </v-table>
                </template>

                <template #openButton="{ openDialog }">
                  <v-btn
                      color="blue"
                      variant="text"
                      size="small"
                      @click="openDialog"
                  >
                    Voir +
                  </v-btn>
                </template>
              </CustomDialog>
            </td>
          </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-field-amount {
  margin-bottom: 20px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>

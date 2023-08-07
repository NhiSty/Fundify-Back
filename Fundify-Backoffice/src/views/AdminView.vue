<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AddAdmin from '../components/AddAdmin.vue';

const merchants = ref([]);
const users = ref([]);

const router = useRouter();
const store = useStore();

const selectedMerchant = computed(() => store.state.selectedMerchant);
// Function to fetch users
const getUsers = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const data = await response.json();
    users.value = data;
  } else if (response.status === 401) {
    console.error('You are not authorized.');
    router.push('/login');
  } else {
    console.error('An error occurred.');
  }
};

// Function to fetch merchants
const getMerchants = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/merchants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const data = await response.json();
    merchants.value = data.merchants;
  } else if (response.status === 401) {
    console.error('You are not authorized.');
    router.push('/login');
  } else {
    console.error('An error occurred.');
  }
};

// Approve a merchant
const approve = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/merchants/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ approved: true }),
    credentials: 'include',
  });

  if (response.ok) {
    getMerchants();
  } else {
    console.log('An error occurred while approving the merchant.');
  }
};

// Invalidate a merchant
const invalidate = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/merchants/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ approved: false }),
    credentials: 'include',
  });

  if (response.ok) {
    // Refresh the merchant list after successful rejection
    getMerchants();
  } else {
    console.log('An error occurred while rejecting the merchant.');
  }
};

// Set user as admin
const setAdmin = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: id }),
    credentials: 'include',
  });

  if (response.ok) {
    // Refresh the user list after successful rejection
    getUsers();
  } else {
    console.log('An error occurred while setting the user as admin.');
  }
};

const tabs = [
  { title: 'Merchants', class: 'inline-block p-4 rounded-t-lg' },
  { title: 'Admin', class: 'inline-block p-4 rounded-t-lg' },
];

const activeTab = ref(tabs[0].title);

const selectMerchant = (id) => {
  store.commit('setSelectedMerchant', id);
  router.push('/profile');
};

const unselectMerchant = () => {
  store.commit('setSelectedMerchant', null);
  localStorage.removeItem('selectedMerchant');
};

onMounted(async () => {
  await getMerchants();
  await getUsers();
});
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <h2 class="my-2 text-2xl">Page admin</h2>
    <div
      class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul class="flex flex-wrap -mb-px">
        <li class="mr-2" v-for="tab in tabs" :key="tab.title">
          <button
            :class="tab.class + (activeTab === tab.title ? ' text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500' : ' hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300')"
            @click="activeTab = tab.title">
            {{ tab.title }}
          </button>
        </li>
      </ul>
    </div>
    <div v-if="activeTab === 'Merchants'">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400" v-if="merchants.length > 0">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Nom société</th>
            <th scope="col" class="px-6 py-3">Téléphone</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Devise</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Action</th>
            <th scope="col" class="px-6 py-3">Se faire passer pour</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="merchant in merchants" v-bind:key="merchant" class="bg-white border-b dark:bg-gray-800
            dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 text-gray-300">
              {{ merchant.companyName }}
            </th>
            <td class="px-6 py-4">{{ merchant.contactPhone }}</td>
            <td class="px-6 py-4">{{ merchant.contactEmail }}</td>
            <td class="px-6 py-4">{{ merchant.currency }}</td>

            <td class="px-6 py-4 bg-green-200 dark:bg-green-700 dark:text-green-300" v-if="merchant.approved">Approuvé
            </td>
            <td class="px-6 py-4 bg-red-200 dark:bg-red-700 dark:text-red-300" v-else>En attente</td>
            <td class="px-6 py-4" v-if="!merchant.approved">
              <button class="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-700"
                @click="approve(merchant.id)">
                Approuver
              </button>
            </td>
            <td class="px-6 py-4" v-else>
              <button class="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-700"
                @click="invalidate(merchant.id)">
                Refuser
              </button>
            </td>
            <td class="px-6 py-4" v-if="selectedMerchant === merchant.id && merchant.approved">
              <button class="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-700"
                @click="unselectMerchant()">
                Désélectionner
              </button>
            </td>
            <td class="px-6 py-4" v-else-if="merchant.approved">
              <button class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
                @click="selectMerchant(merchant.id)">
                Sélectionner
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <p>Aucun marchand en attente d'approbation.</p>
        <p>Personne ne veut de votre site de toute façon.</p>
      </div>
    </div>

    <div v-else>
      <AddAdmin />
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400" v-if="users.length > 0">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Nom</th>
            <th scope="col" class="px-6 py-3">Prénom</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Admin ?</th>
            <th scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" v-bind:key="user" class="bg-white border-b dark:bg-gray-800
            dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 text-gray-300">
              {{ user.lastname }}
            </th>
            <td class="px-6 py-4">{{ user.firstname }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4 bg-green-200 dark:bg-green-700 dark:text-green-300" v-if="user.isAdmin">Oui
            </td>
            <td class="px-6 py-4 bg-red-200 dark:bg-red-700 dark:text-red-300" v-else>Non</td>
            <td class="px-6 py-4" v-if="!user.isAdmin">
              <button class="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-700"
                @click="setAdmin(user.id)">
                Attribuer les droits d'admin
              </button>
            </td>
            <td class="px-6 py-4" v-else>
              <p class="px-4 py-2 font-semibold text-green-500 rounded">
                Cet utilisateur est admin !
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <p>Aucun utilisateur enregistré.</p>
        <p>Tu ferais mieux d'aller élever des chèvres dans le Larzac.</p>
        <p>Et même ça, c'est pas sûr que tu y arrives...</p>
      </div>
    </div>
  </div>
</template>

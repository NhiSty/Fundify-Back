<script setup>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';

const store = useStore();

const selectedMerchant = localStorage.getItem('selectedMerchant');
const isApproved = computed(() => store.state.isApproved);
let id;
if (selectedMerchant !== null) {
  id = computed(() => selectedMerchant);
} else {
  id = computed(() => store.state.merchantId);
}

let infos; let clientToken; let
  clientSecret;
if (isApproved.value || selectedMerchant !== null) {
  console.log(id.value);
  const request = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/merchants/${id.value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  infos = await request.json();

  console.log(infos);

  clientToken = ref(infos.clientToken);
  clientSecret = ref(infos.clientSecret);
}

async function generateNewCredentials() {
  fetch(`${import.meta.env.VITE_SERVER_URL}/api/merchants/${id.value}/credentials`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((response) => response.json())
    .then((data) => {
      clientToken.value = data.clientToken;
      clientSecret.value = data.clientSecret;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
</script>

<template>
  <div v-if="isApproved || selectedMerchant !== null" class="flex flex-row-screen justify-center items-center">
    <div class="flex flex-col items-center py-10">
      <img
          class="w-24 h-24 mb-3 rounded-full shadow-lg"
          src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
          alt="Bonnie image"
      />
      <h2 class="mb-1 text-xl font-medium text-gray-900">
        {{ infos.contactFirstName }} {{ infos.contactLastName }}
      </h2>
      <span class="text-sm text-gray-500 dark:text-gray-400">Marchand</span>
        <dd class="text-lg font-semibold"> Compagny name : {{ infos.companyName }}</dd>
        <dd class="text-lg font-semibold"> email : {{ infos.contactEmail }}</dd>
        <dd class="text-lg font-semibold"> phone : {{ infos.contactPhone }}</dd>
        <dd class="text-lg font-semibold"> confirmation url : {{ infos.confirmationRedirectUrl }}</dd>
        <dd class="text-lg font-semibold"> cancel url : {{ infos.cancellationRedirectUrl }}</dd>
        <dd class="text-lg font-semibold"> currency : {{ infos.currency }}</dd>
        <dd class="text-lg font-semibold"> id : {{ infos.id }}</dd>
        <dd class="text-lg font-semibold">  token : {{ clientToken }}</dd>
        <dd class="text-lg font-semibold"> secret : {{ clientSecret }}</dd>

        <button class="px-4 py-2 mt-5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-gray-900 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            @click="generateNewCredentials"
            v-if="isApproved"
        >
          Générer des nouveaux crédentials
        </button>

    </div>
  </div>
  <div v-else class="flex flex-col items-center py-10">
    <p class="text-lg font-semibold text-red-500 mb-4">Fait pas le malin, tu n'es pas encore approuvé !</p>
  </div>
</template>

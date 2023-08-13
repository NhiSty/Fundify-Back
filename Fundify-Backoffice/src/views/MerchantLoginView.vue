<!-- eslint-disable vue/no-multiple-template-root -->
<!-- eslint-disable max-len -->
<template>
  <form name="login-form" class="max-w-sm mx-auto">
    <h2 class="my-2 text-2xl">Halte ! Qui va là ?</h2>
    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-gray-700"
        >Email:</label
      >
      <input
        type="email"
        id="email"
        v-model="input.email"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>
    <div class="mb-4">
      <label for="password" class="block text-sm font-medium text-gray-700"
        >Password:</label
      >
      <input
        type="password"
        id="password"
        v-model="input.password"
        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>
    <button
      class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      type="submit"
      v-on:click.prevent="login()"
    >
      C'est moi
    </button>
  </form>
  <p class="text-center mt-4">
    <router-link to="/register" class="text-indigo-600 hover:text-indigo-500">
      Qu'entendez-vous par "pas encore inscrit" ?
    </router-link>
  </p>
  <h3 class="text-lg text-center font-medium text-red-600 mt-8" v-if="output">
    {{ output }}
  </h3>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const input = reactive({
  email: '',
  password: '',
});

const output = ref('');

const login = async () => {
  // Make sure all fields are filled
  if (!input.email || !input.password) {
    output.value = 'Veuillez remplir tous les champs';
    console.log(input);
    return;
  }

  // Send a POST request to your server to login the user
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      credentials: 'include',
    },
    body: JSON.stringify(input),
    credentials: 'include',
  });

  if (response.ok) {
    output.value = 'Connexion réussie !';
    await store.dispatch('checkAuth');
    router.push('/dashboard');
  } else if (response.status === 401) {
    output.value = 'Email ou mot de passe incorrect';
  } else {
    console.log(response)
    output.value = 'Une erreur est survenue';
  }
};

defineExpose({ output });
</script>

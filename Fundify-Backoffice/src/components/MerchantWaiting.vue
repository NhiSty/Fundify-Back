<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-semibold text-center">Tableau de bord</h1>
    </div>
    <div class="w-full">
      <div class="border border-gray-300 shadow">
        <h3 class="text-xl p-3 text-center">En attente d'approbation</h3>
        <div class="p-3">
          <p class="text-center">Votre demande d'inscription est en cours de traitement.</p>
          <p class="text-center">Vous être numéro <b>{{ random }}</b> dans la file d'attente.</p>
          <br>
          <p class="text-center">Que le sort vous soit favorable.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const random = ref(Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000);
</script>

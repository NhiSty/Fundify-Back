<script setup>
const props = defineProps(['operationStatus']);

const getStatusColor = () => {
  switch (props.operationStatus) {
    case 'created':
      return 'blue';
    case 'processing':
      return 'orange';
    case 'done':
      return 'green';
    case 'failed':
      return 'red';
    default:
      return 'gray';
  }
};

const getLabel = () => {
  switch (props.operationStatus) {
    case 'created':
      return 'Créée';
    case 'processing':
      return 'En cours de traitement';
    case 'waiting_refund':
      return 'Paiement effectué';
    case 'done':
      return 'Paiement effectué';
    case 'failed':
      return 'Paiement échoué';
    default:
      return 'Unknown';
  }
};
</script>

<template>
  <v-chip :color="getStatusColor()">
    {{ getLabel() }}
  </v-chip>
</template>

<style scoped>

</style>

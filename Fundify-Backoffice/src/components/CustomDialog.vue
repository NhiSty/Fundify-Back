<script setup>
import { Cross } from '@iconsans/vue/linear';
import { ref } from 'vue';

const open = ref(false);

function closeModal() {
  open.value = false;
}

function openDialog() {
  open.value = true;
}
</script>

<template>

  <slot name="openButton" :openDialog="openDialog">
    <v-btn @click=openDialog>
      Ouvrir le dialog
    </v-btn>
  </slot>

  <v-dialog max-width="500px" v-model="open">
    <v-card>
      <v-card-title class="title">
        <slot name="title"></slot>
        <slot name="closeDialog" :closeDialog="closeModal">
          <v-btn density="compact" icon @click="closeModal">
            <Cross />
          </v-btn>
        </slot>
      </v-card-title>

      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <slot name="actions" :closeDialog="closeModal"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

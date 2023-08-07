<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  computed, onMounted, ref, watch,
} from 'vue';
import NavBar from './components/NavBar.vue';

const store = useStore();
const router = useRouter();

const containerClass = ref('');

watch(router, (newRoute) => {
  containerClass.value = newRoute.path !== '/' ? 'container mx-auto mt-8' : '';
});

onMounted(async () => {
  await store.dispatch('checkAuth');
  const isLoggedIn = computed(() => store.state.isLoggedIn);
});
</script>

<template>
  <div>
    <header>
      <NavBar />
    </header>
    <div :class="containerClass">
      <Suspense>
        <RouterView />
      </Suspense>
    </div>
  </div>
</template>

<template>
  <NuxtLayout>
    <NuxtPage />
    <modal-product />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useProductFilterStore } from './pinia/useProductFilterStore';
import { useSiteSettingsStore } from './pinia/useSiteSettingsStore';
import { useUtilityStore } from './pinia/useUtilityStore';

const route = useRoute();
const prdFilterStore = useProductFilterStore();
const utilsStore = useUtilityStore();
const siteSettingsStore = useSiteSettingsStore();

// Fetch settings during SSR and client hydration
await siteSettingsStore.fetchSettings();

watch(() => route.path, () => {
  prdFilterStore.$reset();
  prdFilterStore.handleResetFilter();
  utilsStore.removeBackdrop();
});
</script>
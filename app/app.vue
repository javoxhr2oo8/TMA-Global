<script setup lang="ts">
import { useStore } from './store/store';
import Loader from './components/UI/Loader.vue';

const store = useStore()
const route = useRoute();
const router = useRouter();
const { showBackButton, hideBackButton, setHeaderColor, expand } = useTelegram();
useColorMode()

watch(
  () => route.path,
  (path) => {
    if (path === '/') {
      hideBackButton();
      setHeaderColor('#008236')
    } else {
      showBackButton(() => router.back());
      setHeaderColor('#101828')
    }
  },
  { immediate: true }
);

onMounted(() => {
  expand()
  setHeaderColor('#008236')
})
</script>

<template>
  <div class="app bg-olive-300 dark:bg-gray-900 transition-colors duration-300">
    <NuxtPwaManifest />
    <NuxtLayout />
    <Loader v-if="store.loader"/>
  </div>
</template>

<!-- min-h-screen -->
<style>
.app {
  height: 100%;
  /* overflow-y: auto !important;
  height: 100vh !important; */
  /* padding-top: 100px; */
}
</style>
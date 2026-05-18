<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { showBackButton, hideBackButton, setHeaderColor } = useTelegram();
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

onMounted(()=> {
  setHeaderColor('#008236')
})
</script>

<template>
  <div class="app bg-olive-300 dark:bg-gray-900 transition-colors duration-300">
    <NuxtLayout />
  </div>
</template>

<!-- min-h-screen -->
<style>
.app {
  overflow-y: auto !important;
  height: 100vh !important;
  /* padding-top: 100px; */
}
</style>
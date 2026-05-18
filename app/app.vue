<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { showBackButton, hideBackButton } = useTelegram();
useColorMode()

watch(
    () => route.path,
    (path) => {
        if (path === '/') {
            hideBackButton();
        } else {
            showBackButton(() => router.back());
        }
    },
    { immediate: true }
);
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
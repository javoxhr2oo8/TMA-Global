<script setup lang="ts">
useColorMode()
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
  padding-top: 100px;
}
</style>
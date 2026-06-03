<!-- app/components/Admin/Toast.vue -->
<script setup lang="ts">
defineProps<{ msg: string; show: boolean; bad?: boolean }>()
</script>

<template>
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#101828] px-5 py-3 rounded-xl font-semibold text-[#eef2f8] z-[80] pointer-events-none border transition-all duration-300"
    :class="[
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
      bad ? 'border-[#ef4444]' : 'border-[#22c55e]',
    ]"
  >
    {{ msg }}
  </div>
</template>

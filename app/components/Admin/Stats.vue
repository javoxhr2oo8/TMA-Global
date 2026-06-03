<!-- app/components/Admin/Stats.vue -->
<script setup lang="ts">
defineProps<{ total: number; categories: number; sale: number }>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
    <div class="bg-[#101828] border border-white/10 rounded-2xl p-4">
      <div class="text-2xl font-extrabold">{{ total }}</div>
      <div class="text-xs text-[#94a3b8] mt-1">Jami mahsulot</div>
    </div>
    <div class="bg-[#101828] border border-white/10 rounded-2xl p-4">
      <div class="text-2xl font-extrabold">{{ categories }}</div>
      <div class="text-xs text-[#94a3b8] mt-1">Kategoriyalar</div>
    </div>
    <div class="bg-[#101828] border border-white/10 rounded-2xl p-4">
      <div class="text-2xl font-extrabold">{{ sale }}</div>
      <div class="text-xs text-[#94a3b8] mt-1">Chegirmada</div>
    </div>
  </div>
</template>

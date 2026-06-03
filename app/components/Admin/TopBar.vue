<!-- app/components/Admin/TopBar.vue -->
<script setup lang="ts">
import logoUrl from "../../assets/images/png/Logo2.png";
defineEmits<{ (e: "logout"): void }>();
</script>

<template>
  <div
    class="sticky top-0 z-30 flex justify-between items-center px-5 py-3.5 bg-[#101828]/85 backdrop-blur-md border-b border-white/10"
  >
    <div class="flex items-center gap-3 font-bold w-36 h-11">
      <img
        :src="logoUrl"
        alt="TMA-Global"
        class="w-full h-full rounded-[10px] object-contain bg-[#0b1220]"
      />
    </div>
    <button
      class="bg-[#161f33] text-[#eef2f8] border border-white/10 px-3.5 py-2 rounded-[10px] text-[13px] font-semibold cursor-pointer hover:border-white/20 transition-colors"
      @click="$emit('logout')"
    >
      Chiqish
    </button>
  </div>
</template>

<!-- app/components/Admin/ProductCard.vue -->
<script setup lang="ts">
defineProps<{ product: any }>()
defineEmits<{ (e: 'edit', p: any): void; (e: 'delete', p: any): void }>()
const fmt = (n: any) => Number(n || 0).toLocaleString('ru-RU')
</script>

<template>
  <div class="bg-[#101828] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
    <div
      class="h-[145px] bg-[#0b1220] bg-center bg-cover bg-no-repeat"
      :style="{ backgroundImage: `url('${product.image}')` }"
    ></div>

    <div class="p-3.5 flex flex-col gap-1.5 flex-1">
      <div class="text-[11px] text-[#22c55e] font-bold uppercase">{{ product.category || '—' }}</div>
      <div class="text-sm font-semibold leading-snug min-h-[38px]">{{ product.title || '(nomsiz)' }}</div>
      <div class="font-bold text-base">
        {{ fmt(product.price) }} <span class="text-[11px] font-normal">so'm</span>
        <s v-if="product.oldPrice" class="text-[#94a3b8] font-normal text-xs ml-1.5">{{ fmt(product.oldPrice) }}</s>
      </div>
    </div>

    <div class="flex gap-2 px-3.5 pb-3.5">
      <button
        class="flex-1 py-2 rounded-[10px] text-[13px] font-semibold cursor-pointer bg-[#161f33] text-[#eef2f8] border border-white/10 hover:border-white/20 transition-colors"
        @click="$emit('edit', product)"
      >
        Tahrirlash
      </button>
      <button
        class="flex-1 py-2 rounded-[10px] text-[13px] font-semibold cursor-pointer bg-[#ef4444]/10 text-[#fca5a5] hover:bg-[#ef4444]/20 transition-colors"
        @click="$emit('delete', product)"
      >
        O'chirish
      </button>
    </div>
  </div>
</template>

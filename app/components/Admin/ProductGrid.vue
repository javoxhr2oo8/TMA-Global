<!-- app/components/Admin/ProductGrid.vue -->
<script setup lang="ts">
defineProps<{ products: any[]; loading?: boolean }>()
defineEmits<{ (e: 'edit', p: any): void; (e: 'delete', p: any): void }>()
</script>

<template>
  <div
    v-if="products.length"
    class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]"
  >
    <AdminProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>

  <div v-else class="text-center py-[70px] px-5 text-[#94a3b8]">
    <div class="text-[44px] mb-2.5">📦</div>
    <h3 class="text-[#eef2f8] font-semibold">{{ loading ? 'Yuklanmoqda...' : "Hozircha mahsulot yo'q" }}</h3>
    <p v-if="!loading" class="mt-1.5">"Yangi mahsulot" tugmasini bosing.</p>
  </div>
</template>

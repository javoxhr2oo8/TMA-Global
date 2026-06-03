<!-- components/Main/index.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRandomCollection } from '~/composables/useRandomCollection'
import ProductCard from '../UI/ProductCard.vue'

const { data, loading, fetchRandom } = useRandomCollection('products')
const { activeCategory } = useCategory()

// Manba — FAQAT Firebase'dan kelgan ma'lumot
const source = computed(() => data.value ?? [])

// Tanlangan kategoriya bo'yicha filtrlash ('Barchasi' = hammasi)
const list = computed(() => {
  if (activeCategory.value === 'Barchasi') return source.value
  return source.value.filter((p: any) => p.category === activeCategory.value)
})

onMounted(() => fetchRandom(20))
</script>

<template>
  <div class="container py-8">
    <div
      v-if="list.length"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <ProductCard v-for="product in list" :key="product.id" :product="product" />
    </div>

    <!-- Bo'sh holat -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 rounded-3xl bg-green-600/10 flex items-center justify-center mb-4">
        <i class="fa-solid fa-box-open text-green-500 text-3xl"></i>
      </div>
      <h3 class="text-white text-lg font-semibold">
        {{ loading ? 'Yuklanmoqda...' : 'Mahsulot topilmadi' }}
      </h3>
      <p class="text-gray-400 text-sm mt-1">
        {{ loading ? 'Iltimos kuting' : "Firebase'da mahsulot yo'q yoki kategoriya bo'sh" }}
      </p>
    </div>
  </div>
</template>

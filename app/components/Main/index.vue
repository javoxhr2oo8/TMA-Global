<script setup lang="ts">
import { computed } from 'vue'
import { useRandomCollection } from '~/composables/useRandomCollection'
import ProductCard from '../UI/ProductCard.vue'

const { data, loading, hasMore, fetchRandom, loadMore } = useRandomCollection('products')
const { activeCategory } = useCategory()

const source = computed(() => data.value ?? [])

const list = computed(() => {
  if (activeCategory.value === 'Barchasi') return source.value
  return source.value.filter((p: any) => p.category === activeCategory.value)
})

const showMore = computed(() => {
  if (activeCategory.value !== 'Barchasi') return false
  return hasMore.value
})

onMounted(() => fetchRandom())
</script>

<template>
  <div class="container py-8">
    <div
      v-if="list.length"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <ProductCard v-for="product in list" :key="product.id" :product="product" />
    </div>

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

    <div v-if="showMore" class="flex justify-center mt-6">
      <button
        class="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-2.5 rounded-xl transition"
        @click="loadMore"
      >
        Ko'proq
      </button>
    </div>
  </div>
</template>
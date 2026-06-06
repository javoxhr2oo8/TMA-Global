<script setup lang="ts">
import Button from '../UI/Button.vue'
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
    <div v-if="list.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[8px]">
      <ProductCard v-for="product in list" :key="product.id" :product="product" />
    </div>

    <!-- Yuklanayotganda skeleton (Hero/Categories darhol ko'rinadi, bu yer ham bo'sh qolmaydi) -->
    <div v-else-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-hidden="true">
      <div v-for="n in 6" :key="n" class="animate-pulse rounded-2xl border border-white/5 bg-white/[0.03] p-3">
        <div class="aspect-square w-full rounded-xl bg-white/10"></div>
        <div class="mt-3 h-3 w-3/4 rounded bg-white/10"></div>
        <div class="mt-2 h-3 w-1/2 rounded bg-white/10"></div>
        <div class="mt-3 h-5 w-2/3 rounded bg-white/10"></div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 rounded-3xl bg-green-600/10 flex items-center justify-center mb-4">
        <i class="fa-solid fa-box-open text-green-500 text-3xl"></i>
      </div>
      <h3 class="text-white text-lg font-semibold">Mahsulot topilmadi</h3>
      <p class="text-gray-400 text-sm mt-1">
        Firebase'da mahsulot yo'q yoki kategoriya bo'sh
      </p>
    </div>

    <div v-if="showMore" class="flex justify-center mt-6">
      <button class="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-2.5 rounded-xl transition"
        @click="loadMore">
        Ko'proq
      </button>
    </div>

    <NuxtLink class="fixed bottom-5 right-5 z-50" to="/cart">
      <Button class="!p-[6px] !rounded-[30px]">
        <i class="fas fa-basket-shopping text-[25px]"></i>
      </Button>
    </NuxtLink>
  </div>
</template>
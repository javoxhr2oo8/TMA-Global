<script setup lang="ts">
import Button from '../UI/Button.vue'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRandomCollection } from '~/composables/useRandomCollection'
import ProductCard from '../UI/ProductCard.vue'

const { data, loading, hasMore, fetchRandom, loadMore } = useRandomCollection('products')
const { activeCategory } = useCategory()

const source = computed(() => data.value ?? [])

const norm = (s: string) => (s || '').trim().normalize('NFC')

// Filtrlangan ro'yxat
const filtered = computed(() => {
  if (activeCategory.value === 'Barchasi') return source.value
  const active = norm(activeCategory.value)
  return source.value.filter((p: any) => norm(p.category) === active)
})

// --- VIRTUAL PAGINATION ---
const PAGE_SIZE = 20
const visibleCount = ref(PAGE_SIZE)

// Kategoriya o'zgarganda resetlash
watch(activeCategory, () => {
  visibleCount.value = PAGE_SIZE
})

// Ko'rinadigan mahsulotlar
const list = computed(() => filtered.value.slice(0, visibleCount.value))

// Yana bormi?
const canLoadMore = computed(() => visibleCount.value < filtered.value.length)

// Qancha qoldi
const remaining = computed(() => filtered.value.length - visibleCount.value)

// Scroll sentinel
const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const loadNextPage = () => {
  if (!canLoadMore.value) return
  visibleCount.value = Math.min(
    visibleCount.value + PAGE_SIZE,
    filtered.value.length
  )
}

onMounted(() => {
  fetchRandom()

  // IntersectionObserver — pastga yetganda avtomatik yuklash
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        loadNextPage()
      }
    },
    { rootMargin: '400px' } // 400px oldindan yuklash
  )

  watch(sentinelRef, (el) => {
    if (el && observer) observer.observe(el)
  }, { immediate: true })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="container py-8">
    <!-- Mahsulotlar soni -->
    <div v-if="filtered.length > PAGE_SIZE" class="flex items-center justify-between mb-3 px-1">
      <p class="text-[#94a3b8] text-xs">
        {{ list.length }} / {{ filtered.length }} mahsulot
      </p>
    </div>

    <!-- Mahsulotlar gridi -->
    <div v-if="list.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[8px]">
      <ProductCard v-for="product in list" :key="product.id" :product="product" />
    </div>

    <!-- Skeleton loading -->
    <div v-else-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-hidden="true">
      <div v-for="n in 6" :key="n" class="animate-pulse rounded-2xl border border-white/5 bg-white/[0.03] p-3">
        <div class="aspect-square w-full rounded-xl bg-white/10"></div>
        <div class="mt-3 h-3 w-3/4 rounded bg-white/10"></div>
        <div class="mt-2 h-3 w-1/2 rounded bg-white/10"></div>
        <div class="mt-3 h-5 w-2/3 rounded bg-white/10"></div>
      </div>
    </div>

    <!-- Bo'sh -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <img src="/mascots/blob-mascot.svg" alt="Topilmadi" class="w-32 h-32 mb-2" />
      <h3 class="text-white text-lg font-semibold">Mahsulot topilmadi</h3>
      <p class="text-gray-400 text-sm mt-1">
        Firebase'da mahsulot yo'q yoki kategoriya bo'sh
      </p>
    </div>

    <!-- Infinite scroll sentinel -->
    <div
      v-if="canLoadMore"
      ref="sentinelRef"
      class="flex flex-col items-center gap-3 py-8"
    >
      <div class="flex gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#008236] animate-bounce" style="animation-delay: 0ms"></span>
        <span class="w-2 h-2 rounded-full bg-[#008236] animate-bounce" style="animation-delay: 150ms"></span>
        <span class="w-2 h-2 rounded-full bg-[#008236] animate-bounce" style="animation-delay: 300ms"></span>
      </div>
      <p class="text-[#94a3b8] text-xs">
        Yana {{ remaining }} ta mahsulot bor
      </p>
    </div>

    <!-- Savat tugmasi -->
    <NuxtLink class="fixed bottom-5 right-5 z-50" to="/cart">
      <Button class="!p-[6px] !rounded-[30px]">
        <i class="fas fa-basket-shopping text-[25px]"></i>
      </Button>
    </NuxtLink>
  </div>
</template>

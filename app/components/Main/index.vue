<script setup lang="ts">
import Button from '../UI/Button.vue'
import { useRandomCollection } from '~/composables/useRandomCollection'
import ProductCard from '../UI/ProductCard.vue'

const { data, loading, fetchRandom } = useRandomCollection('products')
const { activeCategory } = useCategory()

const source = computed(() => data.value ?? [])
const norm = (s: string) => (s || '').trim().normalize('NFC')

const filtered = computed(() => {
  if (activeCategory.value === 'Barchasi') return source.value
  const active = norm(activeCategory.value)
  return source.value.filter((p: any) => norm(p.category) === active)
})

// --- INFINITE SCROLL ---
const PAGE_SIZE = 20
const visibleCount = ref(PAGE_SIZE)

watch(activeCategory, () => {
  visibleCount.value = PAGE_SIZE
})

const list = computed(() => filtered.value.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < filtered.value.length)
const remaining = computed(() => Math.max(0, filtered.value.length - visibleCount.value))

const loadNext = () => {
  visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, filtered.value.length)
}

// IntersectionObserver
const sentinel = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

const setupObserver = () => {
  io?.disconnect()
  io = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && canLoadMore.value) {
        loadNext()
      }
    },
    { rootMargin: '600px' }
  )
}

onMounted(() => {
  fetchRandom()
  setupObserver()
})

onUnmounted(() => {
  io?.disconnect()
})

// sentinel element paydo bo'lganda observe qilish
watch(sentinel, (el, oldEl) => {
  if (oldEl && io) io.unobserve(oldEl)
  if (el && io) io.observe(el)
})
</script>

<template>
  <div class="container py-8">
    <div v-if="list.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[8px]">
      <ProductCard v-for="product in list" :key="product.id" :product="product" />
    </div>

    <div v-else-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-hidden="true">
      <div v-for="n in 6" :key="n" class="animate-pulse rounded-2xl border border-white/5 bg-white/[0.03] p-3">
        <div class="aspect-square w-full rounded-xl bg-white/10"></div>
        <div class="mt-3 h-3 w-3/4 rounded bg-white/10"></div>
        <div class="mt-2 h-3 w-1/2 rounded bg-white/10"></div>
        <div class="mt-3 h-5 w-2/3 rounded bg-white/10"></div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <img src="/mascots/blob-mascot.svg" alt="Topilmadi" class="w-32 h-32 mb-2" />
      <h3 class="text-white text-lg font-semibold">Mahsulot topilmadi</h3>
      <p class="text-gray-400 text-sm mt-1">
        Firebase'da mahsulot yo'q yoki kategoriya bo'sh
      </p>
    </div>

    <!-- Sentinel + manual button -->
    <div v-if="canLoadMore" ref="sentinel" class="flex flex-col items-center gap-3 py-8">
      <button
        class="bg-[#008236] text-white font-semibold text-sm px-8 py-2.5 rounded-xl active:scale-95 transition-transform"
        @click="loadNext"
      >
        Ko'proq ko'rsatish ({{ remaining }})
      </button>
    </div>

    <NuxtLink class="fixed bottom-5 right-5 z-50" to="/cart">
      <Button class="!p-[6px] !rounded-[30px]">
        <i class="fas fa-basket-shopping text-[25px]"></i>
      </Button>
    </NuxtLink>
  </div>
</template>

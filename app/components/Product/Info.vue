<!-- app/components/Product/Info.vue -->
<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ product: any }>();
const formatPrice = (price: number) => new Intl.NumberFormat("ru-RU").format(price ?? 0);
const avgRating = computed(() => Number(props.product?.rating) || 0);
const reviewCount = computed(() => Number(props.product?.reviewCount) || 0);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold leading-tight">{{ product.title }}</h1>

    <div class="!mt-4 flex flex-wrap items-center gap-3">
      <div v-if="product.rating" class="flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1.5 text-sm text-yellow-400">
        <i class="fa-solid fa-star text-xs" />
        <span class="font-medium">{{ avgRating }}</span>
        <span v-if="reviewCount" class="text-yellow-400/60 text-xs">({{ reviewCount }})</span>
      </div>
      <div v-if="product.quantity != null" class="rounded-full bg-[#008236]/10 px-3 py-1.5 text-sm text-[#22c55e]">
        Omborda {{ product.quantity }} ta
      </div>
    </div>

    <div class="!mt-6 flex items-end gap-3">
      <div class="text-3xl font-black text-[#22c55e]">{{ formatPrice(product.price) }} so'm</div>
      <div v-if="product.oldPrice" class="pb-1 text-lg text-gray-500 line-through">{{ formatPrice(product.oldPrice) }} so'm</div>
    </div>

    <div v-if="product.isDeliveryFree" class="!mt-6 flex items-center gap-3 rounded-3xl border border-[#008236]/20 bg-[#008236]/10 p-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#008236]">
        <i class="fa-solid fa-truck text-lg text-white" />
      </div>
      <div>
        <h3 class="font-semibold">Bepul yetkazib berish</h3>
        <p class="mt-1 text-sm text-gray-400">Butun O'zbekiston bo'ylab yetkazib beriladi</p>
      </div>
    </div>

    <div class="!mt-7 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <h2 class="mb-3 text-lg font-semibold">Mahsulot haqida</h2>
      <p class="leading-7 text-gray-300">{{ product.desc || 'Bu mahsulot uchun batafsil tavsif hozircha mavjud emas.' }}</p>
    </div>

    <!-- Reyting kartasi (slot orqali) shu yerga keladi -->
    <slot />

    <div class="!mt-7 grid grid-cols-2 gap-3">
      <div class="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p class="text-sm text-gray-400">Brend</p>
        <h3 class="mt-2 text-lg font-semibold">{{ product.brand || '—' }}</h3>
      </div>
      <div class="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p class="text-sm text-gray-400">Kategoriya</p>
        <h3 class="mt-2 text-lg font-semibold">{{ product.category || '—' }}</h3>
      </div>
    </div>
  </div>
</template>

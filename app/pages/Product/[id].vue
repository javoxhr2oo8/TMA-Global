<script setup lang="ts">
import Button from "@/components/UI/Button.vue"
import BackButton from "@/components/UI/BackButton.vue"
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const route = useRoute()
const { product, loading, fetchProduct } = useProduct()

const { addItem, isInCart, updateQuantity, items } = useCart()
const { toggleItem: toggleFav, isFavorite } = useFavorites()

// product.id (Firebase'da hujjat id string, demo'da number bo'lishi mumkin)
const pid = computed(() => product.value?.id)

const gallery = computed<string[]>(() => {
  if (!product.value) return []
  if (Array.isArray(product.value.images) && product.value.images.length) {
    return product.value.images
  }
  return product.value.image ? [product.value.image] : []
})

const cartItem = computed(() =>
  pid.value != null ? items.value.find(i => i.id === pid.value) : undefined
)
const inCart = computed(() => pid.value != null && isInCart(pid.value))
const quantity = computed(() => cartItem.value?.quantity ?? 0)
const isFav = computed(() => pid.value != null && isFavorite(pid.value))

const handleAdd = () => { if (product.value) addItem(product.value) }
const handleMinus = () => { if (pid.value != null) updateQuantity(pid.value, quantity.value - 1) }
const handlePlus = () => { if (pid.value != null) updateQuantity(pid.value, quantity.value + 1) }
const handleFav = () => { if (product.value) toggleFav(product.value) }

const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price ?? 0)

const { submitting: rating, getMyRating, submitRating } = useRating()
const { hapticNotification } = useTelegram()
const myRating = ref(0)
const hoverStar = ref(0)
const rateErr = ref('')

const avgRating = computed(() => Number(product.value?.rating) || 0)
const reviewCount = computed(() => Number(product.value?.reviewCount) || 0)

const rate = async (n: number) => {
  if (!product.value?.id || rating.value) return
  rateErr.value = ''
  try {
    const res = await submitRating(String(product.value.id), n)
    myRating.value = res.myStars
    if (product.value) {
      product.value.rating = res.rating
      product.value.reviewCount = res.reviewCount
    }
    hapticNotification('success')
  } catch (e: any) {
    rateErr.value =
      e?.code === 'auth/operation-not-allowed' || e?.code === 'auth/admin-restricted-operation'
        ? "Baholash uchun Firebase'da Anonymous auth yoqilishi kerak."
        : "Baho saqlanmadi. Qayta urinib ko'ring."
    hapticNotification('error')
  }
}

// product yuklangach, foydalanuvchining oldingi bahosini ko'rsatishga urinamiz
watch(() => product.value?.id, async (id) => {
  myRating.value = id ? await getMyRating(String(id)) : 0
})

onMounted(() => fetchProduct(route.params.id as string))
</script>

<template>
  <div class="container detail">
    <div class="min-h-screen bg-[#101828] pb-32 text-white">

      <!-- MAHSULOT TOPILGANDA -->
      <template v-if="product">
        <div class="relative">
          <Swiper :modules="[Pagination]" :pagination="{ clickable: true }" class="product-swiper">
            <SwiperSlide v-for="image in gallery" :key="image">
              <div class="h-[420px] overflow-hidden bg-[#0B1220]">
                <img :src="image" :alt="product.title" class="h-full w-full object-cover"
                  @error="(e: any) => (e.target.style.opacity = '0.3')">
              </div>
            </SwiperSlide>
          </Swiper>

          <div class="absolute left-0 top-0 z-20 flex w-full items-center justify-between p-4">
            <BackButton class="!h-11 !w-11 !border-white/10 !bg-black/40" />

            <Button @click="handleFav"
              class="!h-11 !w-11 !rounded-full !border !border-white/10 !bg-black/40 !p-0 backdrop-blur">
              <i :class="isFav ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-[#22c55e]'"
                class="text-sm" />
            </Button>
          </div>

          <div v-if="product.badge" class="absolute bottom-5 left-4 z-20">
            <div class="rounded-full bg-[#008236] px-4 py-2 text-sm font-semibold shadow-lg">
              {{ product.badge }}
            </div>
          </div>
        </div>

        <div class="relative z-10 -mt-6 rounded-t-[32px] border-t border-white/10 bg-[#101828] px-4 pt-6">

          <h1 class="text-2xl font-bold leading-tight">
            {{ product.title }}
          </h1>

          <div class="!mt-4 flex flex-wrap items-center gap-3">
            <div v-if="product.rating" class="flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1.5 text-sm text-yellow-400">
              <i class="fa-solid fa-star text-xs" />
              <span class="font-medium">{{ avgRating }}</span>
              <span class="text-yellow-400/60 text-xs">({{ reviewCount }})</span>
            </div>

            <div v-if="product.quantity != null"
              class="rounded-full bg-[#008236]/10 px-3 py-1.5 text-sm text-[#22c55e]">
              Omborda {{ product.quantity }} ta
            </div>
          </div>

          <div class="!mt-6 flex items-end gap-3">
            <div class="text-3xl font-black text-[#22c55e]">
              {{ formatPrice(product.price) }} so'm
            </div>
            <div v-if="product.oldPrice" class="pb-1 text-lg text-gray-500 line-through">
              {{ formatPrice(product.oldPrice) }} so'm
            </div>
          </div>

          <div v-if="product.isDeliveryFree"
            class="!mt-6 flex items-center gap-3 rounded-3xl border border-[#008236]/20 bg-[#008236]/10 p-4">
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
            <p class="leading-7 text-gray-300">
              {{ product.desc || 'Bu mahsulot uchun batafsil tavsif hozircha mavjud emas.' }}
            </p>
          </div>

          <!-- BAHOLASH (mijoz) -->
          <div class="!mt-7 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold">Mahsulotni baholang</h2>
              <div v-if="avgRating" class="text-sm text-gray-400">
                O'rtacha <span class="font-medium text-yellow-400">{{ avgRating }}</span>
                <span class="text-gray-500">· {{ reviewCount }} ta</span>
              </div>
            </div>

            <div class="mt-3 flex items-center gap-1.5">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                :disabled="rating"
                class="text-[28px] leading-none transition-transform active:scale-90 disabled:opacity-60"
                @click="rate(n)"
                @mouseenter="hoverStar = n"
                @mouseleave="hoverStar = 0"
              >
                <i
                  class="fa-solid fa-star"
                  :class="n <= (hoverStar || myRating) ? 'text-yellow-400' : 'text-white/15'"
                />
              </button>
              <span v-if="myRating" class="ml-2 text-sm text-gray-400">
                Sizning bahoyingiz: {{ myRating }}
              </span>
            </div>

            <p v-if="rateErr" class="mt-2 text-sm text-red-400">{{ rateErr }}</p>
            <p v-else-if="rating" class="mt-2 text-sm text-gray-500">Saqlanmoqda…</p>
          </div>

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

        <div class="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-[#101828]/90 p-4 backdrop-blur">
          <div class="flex gap-3">

            <Button v-if="!inCart" @click="handleAdd"
              class="!h-14 !flex-1 !rounded-2xl !bg-[#008236] text-base font-semibold text-white">
              <i class="fa-solid fa-cart-shopping"></i> Savatga +
            </Button>

            <div v-else class="flex flex-1 items-center justify-between gap-3">
              <Button @click="handleMinus"
                class="!h-14 !w-14 !rounded-2xl !bg-white/10 text-xl font-bold flex-shrink-0">
                <i class="fa-solid fa-minus"></i>
              </Button>

              <div class="flex flex-col items-center">
                <span class="text-2xl font-bold text-white">{{ quantity }}</span>
                <span class="text-xs text-gray-400">{{ formatPrice(product.price * quantity) }} so'm</span>
              </div>

              <Button @click="handlePlus"
                class="!h-14 !w-14 !rounded-2xl !bg-[#008236] text-xl font-bold flex-shrink-0">
                <i class="fa-solid fa-plus"></i>
              </Button>
            </div>

          </div>
        </div>
      </template>

      <!-- TOPILMADI (yuklash tugagach) -->
      <div v-else-if="!loading" class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5">
          <i class="fa-solid fa-box-open text-3xl text-gray-400"></i>
        </div>
        <h2 class="text-xl font-bold">Mahsulot topilmadi</h2>
        <p class="mt-2 text-sm text-gray-400">Bu mahsulot mavjud emas yoki o'chirilgan.</p>
        <BackButton class="mt-6 !h-11 !w-auto !px-5 !bg-[#008236]" />
      </div>

    </div>
  </div>
</template>

<style scoped>
:deep(.swiper-pagination) {
  bottom: 18px !important;
}

:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  opacity: 1;
  transition: 0.3s;
}

:deep(.swiper-pagination-bullet-active) {
  width: 24px;
  border-radius: 999px;
  background: #22c55e;
}

@media screen and (max-width: 700px) {
  .detail {
    padding: 0 !important;
  }
}
</style>

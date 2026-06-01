<script setup lang="ts">
import Button from "@/components/UI/Button.vue"
import BackButton from "@/components/UI/BackButton.vue"
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const product = {
    id: 1,
    title: 'Nike Air Max 270 React ENG krasovkalari',
    price: 1_250_000,
    oldPrice: 1_800_000,
    rating: 4.5,
    reviewCount: 238,
    badge: 'Xit',
    isDeliveryFree: true,
    quantity: 7,
    image: 'https://picsum.photos/600/600?random=10',  // ← добавь это
    desc: 'Nike Air Max 270 React ENG krasovkalari...',
    images: [
        'https://picsum.photos/600/600?random=10',
        'https://picsum.photos/600/600?random=11',
        'https://picsum.photos/600/600?random=12',
        'https://picsum.photos/600/600?random=13',
    ]
}

const { addItem, isInCart, updateQuantity, items } = useCart()
const { toggleItem: toggleFav, isFavorite } = useFavorites()

const isFav = computed(() => isFavorite(product.id))
const handleFav = () => toggleFav(product)

const cartItem = computed(() => items.value.find(i => i.id === product.id))
const inCart = computed(() => isInCart(product.id))
const quantity = computed(() => cartItem.value?.quantity ?? 0)

const handleAdd = () => addItem(product)
const handleMinus = () => updateQuantity(product.id, quantity.value - 1)
const handlePlus = () => updateQuantity(product.id, quantity.value + 1)

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
}
</script>

<template>
    <div class="container detail">
        <div class="min-h-screen bg-[#101828] pb-32 text-white">

            <div class="relative">
                <Swiper :modules="[Pagination]" :pagination="{ clickable: true }" class="product-swiper">
                    <SwiperSlide v-for="image in product.images" :key="image">
                        <div class="h-[420px] overflow-hidden bg-[#0B1220]">
                            <img :src="image" :alt="product.title" class="h-full w-full object-cover">
                        </div>
                    </SwiperSlide>
                </Swiper>

                <div class="absolute left-0 top-0 z-20 flex w-full items-center justify-between p-4">
                    <BackButton class="!h-11 !w-11 !border-white/10 !bg-black/40" />

                    <Button @click="handleFav" class="!h-11 !w-11 !rounded-full !border !border-white/10 !bg-black/40 !p-0 backdrop-blur">
                        <i :class="isFav ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-[#22c55e]'" class="text-sm" />
                    </Button>
                </div>

                <div class="absolute bottom-5 left-4 z-20">
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
                    <div class="flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1.5 text-sm text-yellow-400">
                        <i class="fa-solid fa-star text-xs" />
                        <span class="font-medium">{{ product.rating }}</span>
                    </div>

                    <div class="rounded-full bg-[#008236]/10 px-3 py-1.5 text-sm text-[#22c55e]">
                        Omborda {{ product.quantity }} ta
                    </div>
                </div>

                <div class="!mt-6 flex items-end gap-3">
                    <div class="text-3xl font-black text-[#22c55e]">
                        {{ formatPrice(product.price) }} so'm
                    </div>
                    <div class="pb-1 text-lg text-gray-500 line-through">
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
                    <p class="leading-7 text-gray-300">{{ product.desc }}</p>
                </div>

                <div class="!mt-7 grid grid-cols-2 gap-3">
                    <div class="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                        <p class="text-sm text-gray-400">Brend</p>
                        <h3 class="mt-2 text-lg font-semibold">Nike</h3>
                    </div>
                    <div class="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                        <p class="text-sm text-gray-400">Kategoriya</p>
                        <h3 class="mt-2 text-lg font-semibold">Krasovka</h3>
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
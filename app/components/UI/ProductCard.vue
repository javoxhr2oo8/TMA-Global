<script setup lang="ts">

import { ref, computed } from 'vue'
import Button from '~/components/UI/Button.vue'

interface Product {
    id: number
    title: string
    price: number
    oldPrice?: number
    rating: number
    reviewCount: number
    image: string
    badge?: string
    isFavorite?: boolean
    isDeliveryFree?: boolean,
    quantity?: number
}

const props = defineProps<{
    product: Product
}>()

const { addItem, removeItem, isInCart, updateQuantity, items } = useCart()

const isFav = ref(props.product.isFavorite ?? false)

const discount = computed(() => {
    if (!props.product.oldPrice) return null
    return Math.round((1 - props.product.price / props.product.oldPrice) * 100)
})

// Текущий товар в корзине
const cartItem = computed(() => items.value.find(i => i.id === props.product.id))
const inCart = computed(() => isInCart(props.product.id))
const quantity = computed(() => cartItem.value?.quantity ?? 0)

const handleAdd = () => {
    addItem(props.product)
}

const handleMinus = () => {
    updateQuantity(props.product.id, quantity.value - 1)
}

const handlePlus = () => {
    updateQuantity(props.product.id, quantity.value + 1)
}
</script>

<template>
    <div class="group relative h-full flex flex-col overflow-hidden rounded-[12px] 
               border border-white/20 dark:border-white/10 
               bg-white/40 dark:bg-white/5 backdrop-blur-[20px] 
               hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-500 shadow-xl">

        <div class="relative h-[200px] flex-shrink-0 overflow-hidden bg-gray-200/20">
            <img :src="props.product.image" :alt="props.product.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

            <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                <span v-if="discount"
                    class="bg-white/20 backdrop-blur-xl border border-white/30 text-gray-900 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    -{{ discount }}%
                </span>
            </div>

            <Button @click.stop="isFav = !isFav"
                class="!absolute top-3 right-3 !w-9 !h-9 !p-0 !rounded-full !bg-white/20 dark:!bg-black/20 !backdrop-blur-xl !border-white/30 flex items-center justify-center">
                <i :class="isFav ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-gray-700 dark:text-white'"
                    class="text-[13px]"></i>
            </Button>
        </div>

        <div class="p-[10px] flex flex-col flex-1 min-h-0">
            <div class="flex items-center gap-1 mb-1.5">
                <i v-for="star in 5" :key="star" class="fa-solid fa-star text-[8px]"
                    :class="star <= Math.round(props.product.rating) ? 'text-amber-400' : 'text-gray-300 dark:text-white/20'"></i>
                <span class="text-[10px] text-gray-500 dark:text-white/50 ml-1">{{ props.product.rating }}</span>
            </div>

            <h3 class="text-[13px] font-semibold text-gray-800 dark:text-white/90 leading-[1.3] line-clamp-2 mb-3">
                {{ props.product.title }}
            </h3>

            <div class="mt-auto flex items-end justify-between pt-2 border-t border-gray-200/30 dark:border-white/5">
                <div class="flex flex-col">
                    <span class="text-[16px] font-bold text-gray-900 dark:text-white leading-none">
                        {{ props.product.price.toLocaleString() }} <span
                            class="text-[11px] font-normal opacity-60">сум</span>
                    </span>
                </div>
            </div>

            <Button v-if="!inCart" @click="handleAdd"
                class="!p-0 !mt-[10px] !rounded-xl !bg-green-700 hover:!bg-green-800 !shadow-lg">
                <i class="fa-solid fa-cart-shopping text-white text-sm"></i>
                Savatga +
            </Button>

            <div v-else class="add-rem-quan-btns !mt-[10px] flex gap-[10px] items-center">
                <Button @click="handleMinus" class="w-full text-[16px] !p-[3px]">
                    <i class="fa-solid fa-minus"></i>
                </Button>
                <span class="text-[13px] text-white font-semibold text-[18px]">{{ quantity }}</span>
                <Button @click="handlePlus" class="w-full text-[16px] !p-[3px]">
                    <i class="fa-solid fa-plus"></i>
                </Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
}

.group::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}
</style>
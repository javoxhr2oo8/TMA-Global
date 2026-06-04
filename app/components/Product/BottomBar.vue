<!-- app/components/Product/BottomBar.vue -->
<script setup lang="ts">
import { computed } from "vue";
import Button from "@/components/UI/Button.vue";
const props = defineProps<{ product: any }>();
const { addItem, isInCart, updateQuantity, items } = useCart();

const pid = computed(() => props.product?.id);
const cartItem = computed(() => (pid.value != null ? items.value.find((i) => i.id === pid.value) : undefined));
const inCart = computed(() => pid.value != null && isInCart(pid.value));
const quantity = computed(() => cartItem.value?.quantity ?? 0);

const formatPrice = (price: number) => new Intl.NumberFormat("ru-RU").format(price ?? 0);
const handleAdd = () => { if (props.product) addItem(props.product); };
const handleMinus = () => { if (pid.value != null) updateQuantity(pid.value, quantity.value - 1); };
const handlePlus = () => { if (pid.value != null) updateQuantity(pid.value, quantity.value + 1); };
</script>

<template>
  <div class="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-[#101828]/90 p-4 backdrop-blur">
    <div class="flex gap-3">
      <Button v-if="!inCart" @click="handleAdd"
        class="!h-14 !flex-1 !rounded-2xl !bg-[#008236] text-base font-semibold text-white">
        <i class="fa-solid fa-cart-shopping"></i> Savatga +
      </Button>

      <div v-else class="flex flex-1 items-center justify-between gap-3">
        <Button @click="handleMinus" class="!h-14 !w-14 !rounded-2xl !bg-white/10 text-xl font-bold flex-shrink-0">
          <i class="fa-solid fa-minus"></i>
        </Button>
        <div class="flex flex-col items-center">
          <span class="text-2xl font-bold text-white">{{ quantity }}</span>
          <span class="text-xs text-gray-400">{{ formatPrice(product.price * quantity) }} so'm</span>
        </div>
        <Button @click="handlePlus" class="!h-14 !w-14 !rounded-2xl !bg-[#008236] text-xl font-bold flex-shrink-0">
          <i class="fa-solid fa-plus"></i>
        </Button>
      </div>
    </div>
  </div>
</template>

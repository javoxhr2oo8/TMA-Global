<script setup>
import Button from "~/components/UI/Button.vue";
import BackBar from "~/components/UI/BackBar.vue";
import ProductCard from "~/components/UI/ProductCard.vue";
import { formatPrice } from "@/utils/util";

const { items } = useCart();
const goCheckout = () => navigateTo("/checkout");

const totalPrice = computed(() => {
  return items.value?.reduce((acc, item) => {
    return acc + (item.price || 0);
  }, 0);
});
</script>

<template>
  <div
    class="cart min-h-screen bg-gradient-to-b from-[#0e1621] via-[#0e1621] to-[#0e1621] pb-[10px] pt-[10px]"
  >
    <div class="container py-5">
      <!-- BACK -->
      <BackBar class="mb-4" />

      <!-- HEADER -->
      <div
        class="mb-5 rounded-[10px] border border-white/5 bg-white/5 backdrop-blur-xl p-5"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-[#008236] text-sm font-medium mb-1">Savatcha</p>

            <h1 class="text-3xl font-black text-white">Savat</h1>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-[#008236]/15 flex items-center justify-center border border-[#008236]/20"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00c853"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path
                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
              />
            </svg>
          </div>
        </div>

        <!-- INFO -->
        <div v-if="items.length" class="mt-5 grid grid-cols-2 gap-3 !mt-[10px]">
          <div class="rounded-2xl bg-[#0f1d17] border border-white/5 p-4">
            <p class="text-gray-400 text-sm mb-1">Mahsulotlar</p>

            <h3 class="text-white text-[20px] font-bold">
              {{ items.length }}
            </h3>
          </div>

          <div class="rounded-2xl bg-[#0f1d17] border border-white/5 p-4">
            <p class="text-gray-400 text-sm mb-1">Umumiy</p>

            <h3 class="text-[#00c853] text-[20px] font-bold">
              {{ formatPrice(totalPrice) }}
            </h3>
          </div>
        </div>
      </div>

      <!-- EMPTY -->
      <div v-if="items.length === 0" class="empty-card !mt-[10px]">
        <div class="empty-icon">
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00c853"
            stroke-width="2"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path
              d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
            />
          </svg>
        </div>

        <h2 class="text-white text-2xl font-bold mt-5">Savatingiz bo'sh</h2>

        <p class="text-gray-400 text-center mt-2">
          Hozircha mahsulot qo‘shilmagan
        </p>
      </div>

      <!-- PRODUCTS -->
      <div v-else class="cart-products !mt-[10px]">
        <ProductCard v-for="item in items" :key="item.id" :product="item" />
      </div>

      <div class="order-btn-wrp" v-if="items.length">
        <Button class="w-full" @click="goCheckout">
          <i class="fas fa-truck"></i>
          Buyurtma berish
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.empty-card {
  width: 100%;
  min-height: 75vh;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(20px);
}

.empty-icon {
  width: 90px;
  height: 90px;
  border-radius: 28px;
  background: rgba(0, 130, 54, 0.12);
  border: 1px solid rgba(0, 130, 54, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 700px) {
  .cart-products {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

.order-btn-wrp {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 20px;
  left: 0;
  background: #08110d;
}
</style>
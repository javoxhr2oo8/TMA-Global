<script setup>
import BackButton from "~/components/UI/BackButton.vue";
import ProductCard from "~/components/UI/ProductCard.vue";
import { formatPrice } from "@/utils/util";

const { items } = useFavorites();

const totalPrice = computed(() => {
  return items.value?.reduce((acc, item) => acc + (item.price || 0), 0);
});
</script>

<template>
  <div
    class="favorites min-h-screen bg-gradient-to-b from-[#0e1621] via-[#0e1621] to-[#0e1621] pb-28 pt-[10px]"
  >
    <div class="container py-5">
      <!-- BACK -->
      <div class="mb-4 flex items-center gap-3">
        <BackButton />
        <span class="text-base font-medium text-white/80">Orqaga</span>
      </div>

      <!-- HEADER -->
      <div
        class="mb-5 rounded-[10px] border border-white/5 bg-white/5 backdrop-blur-xl p-5"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-pink-400 text-sm font-medium mb-1">Sevimlilar</p>
            <h1 class="text-3xl font-black text-white">Saqlanganlar</h1>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-pink-500/15 flex items-center justify-center border border-pink-500/20"
          >
            <i class="fa-solid fa-heart text-pink-400 text-2xl"></i>
          </div>
        </div>

        <!-- INFO -->
        <div v-if="items.length" class="mt-5 grid grid-cols-2 gap-3 !mt-[10px]">
          <div class="rounded-2xl bg-[#0f1d17] border border-white/5 p-4">
            <p class="text-gray-400 text-sm mb-1">Mahsulotlar</p>
            <h3 class="text-white text-[20px] font-bold">{{ items.length }}</h3>
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
          <i class="fa-regular fa-heart text-pink-400 text-4xl"></i>
        </div>

        <h2 class="text-white text-2xl font-bold mt-5">Sevimlilar bo'sh</h2>
        <p class="text-gray-400 text-center mt-2">
          Yoqqan mahsulotni yurakcha tugmasi orqali saqlang
        </p>
      </div>

      <!-- PRODUCTS -->
      <div v-else class="fav-products !mt-[10px]">
        <ProductCard v-for="item in items" :key="item.id" :product="item" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fav-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.empty-card {
  width: 100%;
  min-height: 70vh;
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
  background: rgba(236, 72, 153, 0.12);
  border: 1px solid rgba(236, 72, 153, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 700px) {
  .fav-products {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>

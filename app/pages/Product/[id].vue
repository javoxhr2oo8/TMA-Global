<script setup lang="ts">
import BackButton from "@/components/UI/BackButton.vue";

const route = useRoute();
const { product, loading, fetchProduct } = useProduct();

onMounted(() => fetchProduct(route.params.id as string));
</script>

<template>
  <div class="container detail">
    <div class="min-h-screen bg-[#101828] pb-32 text-white">
      <!-- MAHSULOT TOPILGANDA -->
      <template v-if="product">
        <ProductGallery :product="product" />

        <div
          class="relative z-10 -mt-6 rounded-t-[32px] border-t border-white/10 bg-[#101828] px-4 pt-6"
        >
          <ProductInfo :product="product" />
        </div>

        <ProductBottomBar :product="product" />
      </template>

      <!-- TOPILMADI (yuklash tugagach) -->
      <div
        v-else-if="!loading"
        class="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <div
          class="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5"
        >
          <i class="fa-solid fa-box-open text-3xl text-gray-400"></i>
        </div>
        <h2 class="text-xl font-bold">Mahsulot topilmadi</h2>
        <p class="mt-2 text-sm text-gray-400">
          Bu mahsulot mavjud emas yoki o'chirilgan.
        </p>
        <BackButton class="mt-6 !h-11 !w-auto !px-5 !bg-[#008236]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 700px) {
  .detail {
    padding: 0 !important;
  }
}
</style>

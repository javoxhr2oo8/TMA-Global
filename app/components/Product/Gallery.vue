<!-- app/components/Product/Gallery.vue -->
<script setup lang="ts">
import { computed } from "vue";
import Button from "@/components/UI/Button.vue";
import BackButton from "@/components/UI/BackButton.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const props = defineProps<{ product: any }>();
const { toggleItem: toggleFav, isFavorite } = useFavorites();

const gallery = computed<string[]>(() => {
  const p = props.product;
  if (!p) return [];
  if (Array.isArray(p.images) && p.images.length) return p.images;
  return p.image ? [p.image] : [];
});
const isFav = computed(() => props.product?.id != null && isFavorite(props.product.id));
const handleFav = () => { if (props.product) toggleFav(props.product); };
</script>

<template>
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
        <i :class="isFav ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-[#22c55e]'" class="text-sm" />
      </Button>
    </div>

    <div v-if="product.badge" class="absolute bottom-5 left-4 z-20">
      <div class="rounded-full bg-[#008236] px-4 py-2 text-sm font-semibold shadow-lg">
        {{ product.badge }}
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.swiper-pagination) { bottom: 18px !important; }
:deep(.swiper-pagination-bullet) {
  width: 8px; height: 8px; background: rgba(255, 255, 255, 0.4); opacity: 1; transition: 0.3s;
}
:deep(.swiper-pagination-bullet-active) { width: 24px; border-radius: 999px; background: #22c55e; }
</style>

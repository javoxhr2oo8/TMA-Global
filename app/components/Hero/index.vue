<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const { hapticImpact } = useTelegram()
const { activeBanners, listen, loaded, loading } = useBanners()

onMounted(() => listen())

const modules = [Navigation, Pagination, Autoplay, EffectFade]
const activeIndex = ref(0)

function onSlideChange(swiper: SwiperClass) {
  activeIndex.value = swiper.realIndex
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<template>
  <section v-if="activeBanners.length > 0" class="hero-section">
    <div class="container">
      <div class="hero relative w-full h-[200px] sm:h-[260px] rounded-[16px] overflow-hidden shadow-lg">
        <swiper
          :modules="modules"
          :slides-per-view="1"
          effect="fade"
          :fade-effect="{ crossFade: true }"
          :loop="activeBanners.length > 1"
          :speed="700"
          :autoplay="{ delay: 4500, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          class="w-full h-full"
          @slide-change="onSlideChange"
        >
          <swiper-slide v-for="(item, i) in activeBanners" :key="item.id">
            <div
              class="relative w-full h-full"
              style="background: linear-gradient(120deg, #065f46 0%, #008236 60%, #16a34a 100%)"
            >
              <img
                :src="item.image"
                :alt="item.title"
                class="hero-img w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                @error="onImgError"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent"></div>
            </div>
          </swiper-slide>
        </swiper>

        <div class="hero-overlay absolute inset-0 z-10 flex flex-col justify-center p-4 sm:p-6 pointer-events-none">
          <Transition name="hero" mode="out-in">
            <div :key="activeIndex" class="hero-content max-w-[78%]">
              <span
                v-if="activeBanners[activeIndex]?.badge"
                class="hero-line inline-flex items-center text-[11px] sm:text-[13px] font-semibold text-white bg-[#008236] px-3 py-1 rounded-full shadow"
              >
                {{ activeBanners[activeIndex]?.badge }}
              </span>

              <h2 class="hero-line text-white font-bold leading-tight mt-2 text-[18px] sm:text-[26px] drop-shadow">
                {{ activeBanners[activeIndex]?.title }}
              </h2>

              <p
                v-if="activeBanners[activeIndex]?.subtitle"
                class="hero-line text-white/85 text-[12px] sm:text-[15px] mt-1 leading-snug"
              >
                {{ activeBanners[activeIndex]?.subtitle }}
              </p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>

  <!-- Banner yo'q bo'lganda skeleton -->
  <section v-else-if="loading && !loaded" class="hero-section">
    <div class="container">
      <div class="w-full h-[200px] sm:h-[260px] rounded-[16px] bg-white/5 animate-pulse"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: 12px 0;
}

.hero :deep(.swiper-slide-active) .hero-img {
  animation: hero-kenburns 6s ease forwards;
}

@keyframes hero-kenburns {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}

.hero-line {
  animation: hero-line-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-content .hero-line:nth-child(1) { animation-delay: 0.05s; }
.hero-content .hero-line:nth-child(2) { animation-delay: 0.13s; }
.hero-content .hero-line:nth-child(3) { animation-delay: 0.21s; }
.hero-content .hero-line:nth-child(4) { animation-delay: 0.29s; }

@keyframes hero-line-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.hero-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

<style>
.hero .swiper-pagination {
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 5px;
  bottom: 10px !important;
}

.hero .swiper-pagination-bullet {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.55);
  opacity: 1;
  margin: 0 !important;
  transition: all 0.3s ease;
}

.hero .swiper-pagination-bullet-active {
  width: 22px;
  background: #ffffff;
}
</style>

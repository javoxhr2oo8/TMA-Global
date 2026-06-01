<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const { hapticImpact } = useTelegram()

const modules = [Navigation, Pagination, Autoplay, EffectFade]

interface HeroSlide {
  image: string
  badge: string
  title: string
  subtitle: string
  cta: string
  to: string
  /* zaxira (rasm yuklanmasa) fon gradienti */
  fallback: string
}

const slides: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    badge: '🔥 Katta chegirma',
    title: 'Mavsumiy savdo — 50% gacha',
    subtitle: 'Eng sara mahsulotlar eng arzon narxlarda',
    cta: 'Xarid qilish',
    to: '/',
    fallback: 'linear-gradient(120deg, #065f46 0%, #008236 60%, #16a34a 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    badge: '🚚 Bepul yetkazib berish',
    title: 'Tezkor buyurtma xizmati',
    subtitle: 'Buyurtmangiz bir kun ichida eshigingizda',
    cta: 'Buyurtma berish',
    to: '/',
    fallback: 'linear-gradient(120deg, #0f3d2e 0%, #166534 55%, #15803d 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    badge: '✨ Yangi kolleksiya',
    title: 'Yangi kelgan mahsulotlar',
    subtitle: 'Eng so‘nggi modellar va trendlar bir joyda',
    cta: 'Ko‘rish',
    to: '/',
    fallback: 'linear-gradient(120deg, #052e16 0%, #14532d 50%, #008236 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    badge: '🎁 Maxsus takliflar',
    title: 'Har kuni yangi aksiyalar',
    subtitle: 'Kuningizni foydali xaridlar bilan boshlang',
    cta: 'Aksiyalar',
    to: '/',
    fallback: 'linear-gradient(120deg, #022c22 0%, #065f46 50%, #16a34a 100%)',
  },
]

/* faol slayd indeksi — yozuvlarni almashtirish uchun */
const activeIndex = ref(0)

function onSlideChange(swiper: SwiperClass) {
  activeIndex.value = swiper.realIndex
}

/* rasm yuklanmasa, uni yashirib zaxira gradientni ko‘rsatamiz */
function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero relative w-full h-[200px] sm:h-[260px] rounded-[16px] overflow-hidden shadow-lg">
        <!-- Rasmlar karuseli -->
        <swiper
          :modules="modules"
          :slides-per-view="1"
          effect="fade"
          :fade-effect="{ crossFade: true }"
          :loop="true"
          :speed="700"
          :autoplay="{ delay: 4500, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          :navigation="{ nextEl: '.hero-next', prevEl: '.hero-prev' }"
          class="w-full h-full"
          @slide-change="onSlideChange"
        >
          <swiper-slide v-for="(item, i) in slides" :key="i">
            <div class="relative w-full h-full" :style="{ background: item.fallback }">
              <img
                :src="item.image"
                :alt="item.title"
                class="hero-img w-full h-full object-cover"
                loading="lazy"
                @error="onImgError"
              />
              <!-- matn o‘qilishi uchun qoraytiruvchi gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent"></div>
            </div>
          </swiper-slide>
        </swiper>

        <!-- Ustki yozuv (rasm bilan birga almashib turadi) -->
        <div class="hero-overlay absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6 pointer-events-none">
          <Transition name="hero" mode="out-in">
            <div :key="activeIndex" class="hero-content max-w-[78%]">
              <span class="hero-line inline-flex items-center text-[11px] sm:text-[13px] font-semibold text-white bg-[#008236] px-3 py-1 rounded-full shadow">
                {{ slides[activeIndex]?.badge }}
              </span>

              <h2 class="hero-line text-white font-bold leading-tight mt-2 text-[18px] sm:text-[26px] drop-shadow">
                {{ slides[activeIndex]?.title }}
              </h2>

              <p class="hero-line text-white/85 text-[12px] sm:text-[15px] mt-1 leading-snug">
                {{ slides[activeIndex]?.subtitle }}
              </p>

              <NuxtLink
                :to="slides[activeIndex]?.to || '/'"
                class="hero-line hero-cta pointer-events-auto inline-flex items-center gap-2 mt-3 bg-white text-[#008236] font-semibold text-[12px] sm:text-[14px] px-4 sm:px-5 py-2 rounded-full shadow-md active:scale-95 transition-transform"
                @click="hapticImpact('light')"
              >
                {{ slides[activeIndex]?.cta }}
                <i class="fa-solid fa-arrow-right text-[10px] sm:text-[12px]"></i>
              </NuxtLink>
            </div>
          </Transition>
        </div>

        <!-- Navigatsiya tugmalari -->
        <button
          class="hero-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-white active:scale-95 transition-all"
          aria-label="Oldingi"
        >
          <i class="fa-solid fa-chevron-left text-gray-800 text-xs"></i>
        </button>
        <button
          class="hero-next absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-white active:scale-95 transition-all"
          aria-label="Keyingi"
        >
          <i class="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: 12px 0;
}

/* faol slaydda rasm sekin kattalashadi (Ken Burns) */
.hero :deep(.swiper-slide-active) .hero-img {
  animation: hero-kenburns 6s ease forwards;
}

@keyframes hero-kenburns {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}

/* yozuvlar almashganda staggered chiqishi */
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

/* eski matn chiqib ketishi */
.hero-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.hero-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

<style>
/* pagination nuqtalari (global, swiper ichidagi elementlar uchun) */
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

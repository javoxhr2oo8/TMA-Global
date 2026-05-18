<template>
  <div class="container">
    <div class="relative w-full">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="16"
        :navigation="{ nextEl: '.btn-next', prevEl: '.btn-prev' }"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :loop="true"
        :breakpoints="{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 }
        }"
        class="w-full h-[150px]"
      >
        <swiper-slide v-for="(item, index) in slides" :key="index">
          <div class="rounded-[10px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group relative">
            <div class="relative overflow-hidden h-56">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <button class="btn-prev absolute left-1 top-[45%] -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-white active:scale-95 transition-all duration-200">
        <i class="fa-solid fa-chevron-left text-gray-800 text-xs"></i>
      </button>
      <button class="btn-next absolute right-1 top-[45%] -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-white active:scale-95 transition-all duration-200">
        <i class="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination, Autoplay]

const slides = [
  { title: 'Slide 1', image: 'https://img.freepik.com/premium-photo/beautiful-mixes-race-woman-holding-shopping-bags-smiling_204996-1035.jpg?semt=ais_hybrid&w=740' },
  { title: 'Slide 2', image: 'https://avatars.mds.yandex.net/i?id=13e248bcb56e8c28c088103d129ece0b5a227ba2-4316934-images-thumbs&n=13' },
  { title: 'Slide 3', image: 'https://i.ytimg.com/vi/dSwUUQwrenY/maxresdefault.jpg' },
  { title: 'Slide 4', image: 'https://uznews.uz/storage/uploads/68/12/97/file_6812970d60152_orig.jpg' },
]
</script>

<style>
.swiper-pagination {
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 5px;
  bottom: 12px !important;
}

.swiper-pagination-bullet {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
  margin: 0 !important;
  transition: all 0.3s ease;
}

.swiper-pagination-bullet-active {
  width: 24px;
  background: #ffffff;
}
</style>
<!-- pages/index.vue -->
<script setup lang="ts">
import ProductCard from '../UI/ProductCard.vue';
const products = [
  {
    id: 1,
    title: 'Nike Air Max 270 React ENG кроссовки',
    price: 1_250_000,
    oldPrice: 1_800_000,
    rating: 4.5,
    reviewCount: 238,
    image: 'https://picsum.photos/400/300?random=10',
    badge: 'Хит',
    isDeliveryFree: true,
  },
  {
    id: 2,
    title: 'Samsung Galaxy A55 5G 8/256GB',
    price: 4_990_000,
    oldPrice: 5_500_000,
    rating: 4,
    reviewCount: 95,
    image: 'https://picsum.photos/400/300?random=11',
    isDeliveryFree: false,
  },
  {
    id: 3,
    title: 'Adidas Ultraboost 22 Running Shoes',
    price: 980_000,
    rating: 5,
    reviewCount: 412,
    image: 'https://picsum.photos/400/300?random=12',
    badge: 'Новинка',
    isDeliveryFree: true,
  },
  {
    id: 4,
    title: 'Apple AirPods Pro 2nd Generation',
    price: 3_200_000,
    oldPrice: 3_800_000,
    rating: 4.5,
    reviewCount: 178,
    image: 'https://picsum.photos/400/300?random=13',
    isDeliveryFree: true,
  },
]
</script>

<template>
  <div class="container py-8">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>
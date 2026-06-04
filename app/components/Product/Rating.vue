<!-- app/components/Product/Rating.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
const props = defineProps<{ product: any }>();
const emit = defineEmits<{ (e: "rated", v: { rating: number; reviewCount: number }): void }>();

const { submitting: rating, getMyRating, submitRating } = useRating();
const { hapticNotification } = useTelegram();
const myRating = ref(0);
const hoverStar = ref(0);
const rateErr = ref("");

const avgRating = computed(() => Number(props.product?.rating) || 0);
const reviewCount = computed(() => Number(props.product?.reviewCount) || 0);

const rate = async (n: number) => {
  if (!props.product?.id || rating.value) return;
  rateErr.value = "";
  try {
    const res = await submitRating(String(props.product.id), n);
    myRating.value = res.myStars;
    emit("rated", { rating: res.rating, reviewCount: res.reviewCount });
    hapticNotification("success");
  } catch (e: any) {
    rateErr.value =
      e?.code === "auth/operation-not-allowed" || e?.code === "auth/admin-restricted-operation"
        ? "Baholash uchun Firebase'da Anonymous auth yoqilishi kerak."
        : "Baho saqlanmadi. Qayta urinib ko'ring.";
    hapticNotification("error");
  }
};

watch(
  () => props.product?.id,
  async (id) => { myRating.value = id ? await getMyRating(String(id)) : 0; },
  { immediate: true },
);
</script>

<template>
  <div class="!mt-7 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-lg font-semibold">Mahsulotni baholang</h2>
      <div v-if="avgRating" class="text-sm text-gray-400">
        O'rtacha <span class="font-medium text-yellow-400">{{ avgRating }}</span>
        <span class="text-gray-500">· {{ reviewCount }} ta</span>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-1.5">
      <button v-for="n in 5" :key="n" type="button" :disabled="rating"
        class="text-[28px] leading-none transition-transform active:scale-90 disabled:opacity-60"
        @click="rate(n)" @mouseenter="hoverStar = n" @mouseleave="hoverStar = 0">
        <i class="fa-solid fa-star" :class="n <= (hoverStar || myRating) ? 'text-yellow-400' : 'text-white/15'" />
      </button>
      <span v-if="myRating" class="ml-2 text-sm text-gray-400">Sizning bahoyingiz: {{ myRating }}</span>
    </div>

    <p v-if="rateErr" class="mt-2 text-sm text-red-400">{{ rateErr }}</p>
    <p v-else-if="rating" class="mt-2 text-sm text-gray-500">Saqlanmoqda…</p>
  </div>
</template>

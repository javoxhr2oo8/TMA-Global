<script setup lang="ts">
// "Orqaga" tugmasi — faqat ZAXIRA sifatida ishlaydi.
// Telegram ichida Telegram'ning o'z native BackButton'i (app.vue da ulangan)
// ishlatiladi, shuning uchun bu tugma yashiriladi. Ilova oddiy brauzerda
// (Telegram'dan tashqarida) ochilganda esa zaxira sifatida ko'rinadi.
import { ref, computed, onMounted } from 'vue'

const router = useRouter()
const { hapticImpact, isTelegram } = useTelegram()

const props = withDefaults(
  defineProps<{
    to?: string | null
  }>(),
  {
    to: null,
  }
)

// SSR/hydration nomuvofiqligini oldini olish uchun mount'dan keyin hisoblaymiz.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
const showFallback = computed(() => mounted.value && !isTelegram)

function goBack(): void {
  hapticImpact('light')

  if (props.to) {
    router.push(props.to)
    return
  }

  // Tarixda orqaga sahifa bo'lsa — qaytamiz, aks holda bosh sahifaga.
  if (import.meta.client && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <button
    v-if="showFallback"
    type="button"
    aria-label="Orqaga"
    @click="goBack"
    class="back-btn inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition-all duration-200 hover:bg-white/10 active:scale-95"
  >
    <i class="fa-solid fa-arrow-left text-sm"></i>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const router = useRouter();
const { hapticImpact, isTelegram } = useTelegram();

const props = withDefaults(
  defineProps<{
    to?: string | null;
    label?: string;
  }>(),
  {
    to: null,
    label: "Orqaga",
  }
);

const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});
const show = computed(() => mounted.value && !isTelegram);

function goBack(): void {
  hapticImpact("light");
  if (props.to) {
    router.push(props.to);
    return;
  }
  if (import.meta.client && window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}
</script>

<template>
  <div v-if="show" class="flex items-center gap-3">
    <button
      type="button"
      :aria-label="label"
      class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition-all duration-200 hover:bg-white/10 active:scale-95"
      @click="goBack"
    >
      <i class="fa-solid fa-arrow-left text-sm"></i>
    </button>
    <span class="text-base font-medium text-white/80">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
const { canInstall, isInstalled, install } = usePwaInstall();

const loading = ref(false);
const done = ref(false);

const handleInstall = async () => {
  if (loading.value) return;
  loading.value = true;

  const result = await install();

  loading.value = false;
  if (result === "accepted") {
    done.value = true;
  }
};
</script>

<template>
  <!-- Allaqachon o'rnatilgan bo'lsa -->
  <div
    v-if="isInstalled || done"
    class="flex items-center gap-2 rounded-2xl border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-sm text-[#22c55e]"
  >
    <i class="fa-solid fa-circle-check text-base"></i>
    <span class="font-medium">Ilova o'rnatilgan</span>
  </div>

  <!-- O'rnatish tugmasi — faqat canInstall = true bo'lganda ko'rinadi -->
  <button
    v-else-if="canInstall"
    @click="handleInstall"
    :disabled="loading"
    class="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#008236] px-4 py-3.5 text-base font-semibold text-white transition-opacity active:opacity-80 disabled:opacity-60"
  >
    <template v-if="loading">
      <!-- Yuklanish animatsiyasi -->
      <svg
        class="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>O'rnatilmoqda…</span>
    </template>
    <template v-else>
      <i class="fa-solid fa-download text-base"></i>
      <span>Ilovani o'rnatish</span>
    </template>
  </button>
</template>

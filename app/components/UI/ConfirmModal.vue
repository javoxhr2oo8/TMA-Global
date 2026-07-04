<!-- app/components/UI/ConfirmModal.vue -->
<script setup lang="ts">
const { state, accept, cancel } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div
        v-if="state.show"
        class="fixed inset-0 z-[99999] flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cancel" />

        <div
          class="relative w-[88%] max-w-[360px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          style="background: linear-gradient(165deg, #111827, #0a0f1a)"
        >
          <div class="p-6 text-center">
            <!-- Icon -->
            <div
              class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
              :class="state.danger ? 'bg-red-500/10' : 'bg-[#008236]/10'"
            >
              <i
                class="text-2xl"
                :class="state.danger ? 'fas fa-trash-alt text-red-400' : 'fas fa-question-circle text-[#008236]'"
              />
            </div>

            <h3 class="text-white font-bold text-lg mb-1.5">{{ state.title }}</h3>
            <p class="text-[#94a3b8] text-sm leading-relaxed">{{ state.message }}</p>
          </div>

          <div class="flex border-t border-white/10">
            <button
              class="flex-1 py-3.5 text-sm font-semibold text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              @click="cancel"
            >
              {{ state.cancelText }}
            </button>
            <button
              class="flex-1 py-3.5 text-sm font-bold transition-colors cursor-pointer border-l border-white/10"
              :class="state.danger
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-[#008236] hover:bg-[#008236]/10'"
              @click="accept"
            >
              {{ state.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-enter-active .relative,
.confirm-leave-active .relative {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}
.confirm-enter-from .relative {
  transform: scale(0.9);
  opacity: 0;
}
.confirm-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

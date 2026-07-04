<!-- app/components/UI/Toasts.vue -->
<script setup lang="ts">
const { toasts, dismiss } = useToast()

const icon = (type: string) => {
  switch (type) {
    case 'success': return 'fas fa-check-circle'
    case 'error': return 'fas fa-exclamation-circle'
    case 'warning': return 'fas fa-exclamation-triangle'
    default: return 'fas fa-info-circle'
  }
}

const color = (type: string) => {
  switch (type) {
    case 'success': return '#22c55e'
    case 'error': return '#ef4444'
    case 'warning': return '#f59e0b'
    default: return '#3b82f6'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[99998] flex flex-col items-center gap-2 w-[90%] max-w-[380px] pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="w-full pointer-events-auto rounded-xl border shadow-2xl px-4 py-3 flex items-center gap-3 cursor-pointer"
          style="background: linear-gradient(165deg, #111827, #0a0f1a)"
          :style="{ borderColor: color(t.type) + '33' }"
          @click="dismiss(t.id)"
        >
          <i :class="icon(t.type)" class="text-base shrink-0" :style="{ color: color(t.type) }" />
          <span class="text-white text-sm font-medium flex-1 min-w-0">{{ t.message }}</span>
          <i class="fas fa-times text-[#475569] text-xs shrink-0 hover:text-white transition-colors" />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.toast-move {
  transition: transform 0.25s ease;
}
</style>

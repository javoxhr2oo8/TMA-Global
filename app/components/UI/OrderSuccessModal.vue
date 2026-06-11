<!-- app/components/UI/OrderSuccessModal.vue -->
<script setup lang="ts">
import Button from "~/components/UI/Button.vue";

const props = defineProps<{
  open: boolean;
  orderId: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="props.open"
      class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      @click.self="emit('close')"
    >
      <Transition name="modal-pop" appear>
        <div
          v-if="props.open"
          class="w-full max-w-[400px] rounded-t-3xl border border-white/10 bg-[#101828] p-6 pb-8 text-center shadow-2xl sm:mx-4 sm:rounded-3xl sm:pb-6"
        >
          <!-- ICON -->
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#008236]/15"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-[#008236]"
            >
              <i class="fa-solid fa-check text-2xl text-white"></i>
            </div>
          </div>

          <!-- TITLE -->
          <h3 class="text-lg font-bold text-white">
            Buyurtmangiz qabul qilindi!
          </h3>
          <p class="mt-1 text-sm text-[#94a3b8]">
            Tez orada operatorlarimiz siz bilan bog'lanishadi.
          </p>

          <!-- ORDER ID -->
          <div
            class="mx-auto mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2"
          >
            <i class="fa-solid fa-receipt text-[#22c55e]"></i>
            <span class="text-sm font-semibold tracking-wide text-[#eef2f8]"
              >#{{ props.orderId }}</span
            >
          </div>

          <!-- ACTION -->
          <Button
            class="!mt-6 !h-14 w-full !rounded-2xl !bg-[#008236] text-base font-semibold text-white"
            @click="emit('close')"
          >
            <i class="fa-solid fa-house"></i>
            Bosh sahifaga
          </Button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active {
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.modal-pop-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
</style>

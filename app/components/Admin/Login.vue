<!-- app/components/Admin/Login.vue -->
<script setup lang="ts">
import { ref } from "vue";
import logoUrl from "../../assets/images/png/Logo2.png";

defineProps<{ loading?: boolean; error?: string }>();
const emit = defineEmits<{
  (e: "submit", payload: { email: string; password: string }): void;
}>();

const email = ref("");
const password = ref("");
const submit = () =>
  emit("submit", { email: email.value.trim(), password: password.value });

const inputCls =
  "w-full bg-[#161f33] text-[#eef2f8] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#22c55e]";
</script>

<template>
  <div class="admin-login min-h-screen grid place-items-center p-6">
    <div
      class="w-full max-w-[380px ] bg-[#101828] border border-white/10 rounded-3xl px-7 py-9"
    >
      <div class="flex items-center gap-3 mb-6 w-36 h-11 mx-auto">
        <img
          :src="logoUrl"
          alt="TMA-Global"
          class="w-full h-full rounded-xl object-contain bg-[#0b1220]"
        />
      </div>

      <div class="mb-4">
        <label class="block text-xs text-[#94a3b8] mb-1.5 font-semibold"
          >Email</label
        >
        <input
          v-model="email"
          type="email"
          placeholder="admin@example.com"
          :class="inputCls"
        />
      </div>
      <div class="mb-4">
        <label class="block text-xs text-[#94a3b8] mb-1.5 font-semibold"
          >Parol</label
        >
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          :class="inputCls"
          @keydown.enter="submit"
        />
      </div>

      <button
        :disabled="loading"
        class="w-full py-3 rounded-xl font-bold text-[#031b0e] bg-gradient-to-br from-[#22c55e] to-[#16a34a] cursor-pointer disabled:opacity-60"
        @click="submit"
      >
        {{ loading ? "Kirilmoqda..." : "Kirish" }}
      </button>
      <div class="text-[#ef4444] text-[13px] mt-2 min-h-4">{{ error }}</div>
    </div>
  </div>
</template>

<style scoped>
.admin-login {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 10px;
}
</style>
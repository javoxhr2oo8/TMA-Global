<!-- app/components/Admin/Registrations.vue -->
<script setup lang="ts">
import type { Registration } from '~/composables/useRegistration'

const props = defineProps<{
  registrations: Registration[]
  loading: boolean
}>()

const emit = defineEmits<{
  delete: [reg: Registration]
  refresh: []
}>()

const formatDate = (ts: any): string => {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds ? ts.seconds * 1000 : ts)
  return d.toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const searchQuery = ref('')

const filtered = computed(() => {
  if (!searchQuery.value.trim()) return props.registrations
  const q = searchQuery.value.toLowerCase()
  return props.registrations.filter(
    (r) =>
      r.firstName?.toLowerCase().includes(q) ||
      r.lastName?.toLowerCase().includes(q) ||
      r.phone?.includes(q) ||
      r.address?.toLowerCase().includes(q) ||
      r.telegramUser?.username?.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div>
    <!-- Sarlavha -->
    <div class="flex justify-between items-center flex-wrap gap-3 mb-5">
      <div>
        <h2 class="text-2xl font-extrabold text-white">So'rovnomalar</h2>
        <p class="text-[#94a3b8] text-[13px] mt-1">
          Foydalanuvchilar to'ldirgan ro'yxatdan o'tish formalari
        </p>
      </div>
      <button
        class="flex items-center gap-2 bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors"
        @click="emit('refresh')"
      >
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }" />
        Yangilash
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
      <div class="bg-white/5 border border-white/10 rounded-xl p-4">
        <p class="text-[#94a3b8] text-xs mb-1">Jami so'rovlar</p>
        <p class="text-2xl font-bold text-white">{{ registrations.length }}</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-xl p-4">
        <p class="text-[#94a3b8] text-xs mb-1">Telegram orqali</p>
        <p class="text-2xl font-bold text-[#22c55e]">
          {{ registrations.filter((r) => r.telegramUser?.id).length }}
        </p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2 sm:col-span-1">
        <p class="text-[#94a3b8] text-xs mb-1">Bugun</p>
        <p class="text-2xl font-bold text-white">
          {{
            registrations.filter((r) => {
              if (!r.createdAt) return false
              const d = r.createdAt.toDate ? r.createdAt.toDate() : new Date(r.createdAt)
              const today = new Date()
              return d.toDateString() === today.toDateString()
            }).length
          }}
        </p>
      </div>
    </div>

    <!-- Qidiruv -->
    <div class="relative mb-4">
      <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] text-sm" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Ism, telefon yoki manzil bo'yicha qidirish..."
        class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#475569] text-sm outline-none focus:border-[#22c55e]/60 transition-colors"
      />
    </div>

    <!-- Yuklanmoqda -->
    <div
      v-if="loading"
      class="text-center py-16 text-[#94a3b8]"
    >
      <i class="fas fa-spinner fa-spin text-2xl mb-3 block" />
      Yuklanmoqda...
    </div>

    <!-- Bo'sh -->
    <div
      v-else-if="filtered.length === 0"
      class="text-center py-16 text-[#94a3b8]"
    >
      <i class="fas fa-inbox text-4xl mb-3 block opacity-40" />
      <p class="text-sm">{{ searchQuery ? "Hech narsa topilmadi" : "Hali so'rovnomalar yo'q" }}</p>
    </div>

    <!-- Jadval / Kartalar -->
    <div v-else class="space-y-3">
      <div
        v-for="reg in filtered"
        :key="reg.id"
        class="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.06] transition-colors"
      >
        <div class="flex justify-between items-start gap-3">
          <!-- Ma'lumotlar -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-white font-semibold text-sm">
                {{ reg.firstName }} {{ reg.lastName }}
              </h3>
              <span
                v-if="reg.telegramUser?.username"
                class="text-[10px] px-2 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] font-medium"
              >
                @{{ reg.telegramUser.username }}
              </span>
            </div>

            <div class="mt-2 space-y-1.5">
              <p class="text-[#94a3b8] text-xs flex items-center gap-2">
                <i class="fas fa-phone text-[10px] text-[#22c55e]/60 w-3" />
                <a
                  :href="'tel:' + reg.phone"
                  class="hover:text-[#22c55e] transition-colors"
                >{{ reg.phone }}</a>
              </p>
              <p class="text-[#94a3b8] text-xs flex items-start gap-2">
                <i class="fas fa-map-marker-alt text-[10px] text-[#22c55e]/60 w-3 mt-0.5" />
                <span class="break-words">{{ reg.address }}</span>
              </p>
              <p class="text-[#475569] text-[11px] flex items-center gap-2">
                <i class="fas fa-clock text-[10px] w-3" />
                {{ formatDate(reg.createdAt) }}
              </p>
            </div>
          </div>

          <!-- O'chirish -->
          <button
            class="text-[#475569] hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors cursor-pointer shrink-0"
            title="O'chirish"
            @click="emit('delete', reg)"
          >
            <i class="fas fa-trash text-xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- app/components/Admin/Banners.vue -->
<script setup lang="ts">
import type { Banner } from '~/composables/useBanners'

const props = defineProps<{
  banners: Banner[]
  loading: boolean
}>()

const emit = defineEmits<{
  add: []
  edit: [banner: Banner]
  delete: [banner: Banner]
  refresh: []
  toggleActive: [banner: Banner]
}>()
</script>

<template>
  <div>
    <!-- Sarlavha -->
    <div class="flex justify-between items-center flex-wrap gap-3 mb-5">
      <div>
        <h2 class="text-2xl font-extrabold text-white">Bannerlar</h2>
        <p class="text-[#94a3b8] text-[13px] mt-1">
          Bosh sahifadagi slayder bannerlari
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="flex items-center gap-2 bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          @click="emit('refresh')"
        >
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }" />
        </button>
        <button
          class="bg-[#008236] text-white font-bold px-4 py-2.5 rounded-xl text-sm cursor-pointer"
          @click="emit('add')"
        >
          ＋ Yangi banner
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3 mb-5">
      <div class="bg-white/5 border border-white/10 rounded-xl p-4">
        <p class="text-[#94a3b8] text-xs mb-1">Jami</p>
        <p class="text-2xl font-bold text-white">{{ banners.length }}</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-xl p-4">
        <p class="text-[#94a3b8] text-xs mb-1">Faol</p>
        <p class="text-2xl font-bold text-[#008236]">
          {{ banners.filter((b) => b.active !== false).length }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16 text-[#94a3b8]">
      <i class="fas fa-spinner fa-spin text-2xl mb-3 block" />
      Yuklanmoqda...
    </div>

    <!-- Bo'sh -->
    <div v-else-if="banners.length === 0" class="text-center py-16 text-[#94a3b8]">
      <i class="fas fa-image text-4xl mb-3 block opacity-40" />
      <p class="text-sm">Hali banner qo'shilmagan</p>
    </div>

    <!-- Bannerlar ro'yxati -->
    <div v-else class="space-y-3">
      <div
        v-for="banner in banners"
        :key="banner.id"
        class="rounded-xl border overflow-hidden transition-colors"
        :class="banner.active !== false
          ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
          : 'bg-white/[0.01] border-white/5 opacity-50'"
      >
        <div class="flex gap-3 p-3">
          <!-- Rasm -->
          <div class="w-[120px] h-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
            <img
              v-if="banner.image"
              :src="banner.image"
              :alt="banner.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-[#475569]">
              <i class="fas fa-image text-xl" />
            </div>
          </div>

          <!-- Ma'lumotlar -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span
                v-if="banner.badge"
                class="text-[10px] px-2 py-0.5 rounded-full bg-[#008236]/10 text-[#008236] font-medium"
              >
                {{ banner.badge }}
              </span>
              <span
                class="text-[10px] px-2 py-0.5 rounded-full font-medium"
                :class="banner.active !== false
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'"
              >
                {{ banner.active !== false ? 'Faol' : 'Nofaol' }}
              </span>
              <span class="text-[#475569] text-[10px]">
                #{{ banner.order ?? 0 }}
              </span>
            </div>

            <h3 class="text-white font-semibold text-sm truncate">
              {{ banner.title }}
            </h3>
            <p v-if="banner.subtitle" class="text-[#94a3b8] text-xs truncate mt-0.5">
              {{ banner.subtitle }}
            </p>
          </div>

          <!-- Amallar -->
          <div class="flex items-center gap-1 shrink-0">
            <button
              class="text-[#94a3b8] hover:text-[#008236] p-2 rounded-lg hover:bg-[#008236]/10 transition-colors cursor-pointer"
              title="Tahrirlash"
              @click="emit('edit', banner)"
            >
              <i class="fas fa-pen text-xs" />
            </button>
            <button
              class="text-[#475569] hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors cursor-pointer"
              title="O'chirish"
              @click="emit('delete', banner)"
            >
              <i class="fas fa-trash text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

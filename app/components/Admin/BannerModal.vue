<!-- app/components/Admin/BannerModal.vue -->
<script setup lang="ts">
import type { Banner } from '~/composables/useBanners'

const props = defineProps<{
  open: boolean
  banner: Banner | null
  saving: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

const { uploadOne, uploading, progress } = useImageUpload()
const { nextOrder } = useBanners()
const toast = useToast()

const form = reactive({
  badge: '',
  title: '',
  subtitle: '',
  image: '',
  order: 0,
  active: true,
})

const preview = ref('')

watch(
  () => props.open,
  (val) => {
    if (!val) return
    if (props.banner) {
      form.badge = props.banner.badge || ''
      form.title = props.banner.title || ''
      form.subtitle = props.banner.subtitle || ''
      form.image = props.banner.image || ''
      form.order = props.banner.order ?? 0
      form.active = props.banner.active !== false
      preview.value = props.banner.image || ''
    } else {
      form.badge = ''
      form.title = ''
      form.subtitle = ''
      form.image = ''
      form.order = nextOrder.value
      form.active = true
      preview.value = ''
    }
  },
)

const onFile = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const url = await uploadOne(file)
    form.image = url
    preview.value = url
  } catch (err: any) {
    toast.error(err.message || "Rasmni yuklab bo'lmadi")
  }
}

const onSave = () => {
  if (!form.title.trim()) return toast.warning("Sarlavha kiriting")
  if (!form.image) return toast.warning("Rasm yuklang")
  emit('save', { ...form })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4"
        @click.self="emit('close')"
      >
        <div
          class="w-full max-w-[480px] my-8 rounded-2xl border border-white/10 shadow-2xl"
          style="background: linear-gradient(165deg, #111827, #0a0f1a)"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 class="text-lg font-bold text-white">
              {{ banner ? 'Bannerni tahrirlash' : 'Yangi banner' }}
            </h3>
            <button
              class="text-[#94a3b8] hover:text-white text-lg cursor-pointer"
              @click="emit('close')"
            >
              <i class="fas fa-times" />
            </button>
          </div>

          <div class="px-5 pb-6 space-y-4">
            <!-- Rasm yuklash -->
            <div>
              <label class="block text-[#94a3b8] text-xs font-medium mb-2">
                Orqa fon rasmi *
              </label>

              <!-- Preview -->
              <div
                v-if="preview"
                class="relative w-full h-[140px] rounded-xl overflow-hidden mb-2 border border-white/10"
              >
                <img
                  :src="preview"
                  class="w-full h-full object-cover"
                />
                <button
                  class="absolute top-2 right-2 bg-black/50 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-red-500/80"
                  @click="preview = ''; form.image = ''"
                >
                  <i class="fas fa-trash" />
                </button>
              </div>

              <label
                v-if="!preview"
                class="flex flex-col items-center justify-center w-full h-[120px] rounded-xl border-2 border-dashed border-white/10 hover:border-[#008236]/40 bg-white/[0.02] cursor-pointer transition-colors"
              >
                <input type="file" accept="image/*" class="hidden" @change="onFile" />
                <template v-if="uploading">
                  <i class="fas fa-spinner fa-spin text-[#008236] text-xl mb-1" />
                  <span class="text-[#94a3b8] text-xs">{{ progress }}%</span>
                </template>
                <template v-else>
                  <i class="fas fa-cloud-upload-alt text-[#475569] text-2xl mb-1" />
                  <span class="text-[#94a3b8] text-xs">Rasm yuklash</span>
                </template>
              </label>
            </div>

            <!-- Badge -->
            <div>
              <label class="block text-[#94a3b8] text-xs font-medium mb-1.5">
                Badge (yuqoridagi yorliq)
              </label>
              <input
                v-model="form.badge"
                type="text"
                placeholder="🔥 Katta chegirma"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#008236]/60"
              />
            </div>

            <!-- Title -->
            <div>
              <label class="block text-[#94a3b8] text-xs font-medium mb-1.5">
                Sarlavha *
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Mavsumiy savdo — 50% gacha"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#008236]/60"
              />
            </div>

            <!-- Subtitle -->
            <div>
              <label class="block text-[#94a3b8] text-xs font-medium mb-1.5">
                Qo'shimcha matn
              </label>
              <input
                v-model="form.subtitle"
                type="text"
                placeholder="Eng sara mahsulotlar eng arzon narxlarda"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#008236]/60"
              />
            </div>

            <!-- Order + Active -->
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-[#94a3b8] text-xs font-medium mb-1.5">
                  Tartib raqami
                </label>
                <input
                  v-model.number="form.order"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#008236]/60"
                />
              </div>
              <div class="flex items-end pb-1">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.active"
                    type="checkbox"
                    class="w-5 h-5 rounded accent-[#008236]"
                  />
                  <span class="text-[#94a3b8] text-sm">Faol</span>
                </label>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-2">
              <button
                class="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94a3b8] font-medium text-sm cursor-pointer hover:text-white transition-colors"
                @click="emit('close')"
              >
                Bekor qilish
              </button>
              <button
                :disabled="saving || uploading"
                class="flex-1 py-2.5 rounded-xl bg-[#008236] text-white font-bold text-sm cursor-pointer disabled:opacity-50"
                @click="onSave"
              >
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2" />
                Saqlash
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

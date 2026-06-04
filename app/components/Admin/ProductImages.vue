<!-- app/components/Admin/ProductImages.vue -->
<!-- Rasmlar grid + yuklash. images v-model orqali, uploading holati v-model:uploading orqali. -->
<script setup lang="ts">
import { ref, watch } from "vue";
import { useImageUpload } from "~/composables/useImageUpload";

const MAX_IMAGES = 5;

const images = defineModel<string[]>("images", { default: () => [] });
const uploadingModel = defineModel<boolean>("uploading", { default: false });

const { uploading, uploadMany } = useImageUpload();
watch(uploading, (v) => (uploadingModel.value = v));

const fileInput = ref<HTMLInputElement | null>(null);
const uploadErr = ref("");

const pickFiles = () => fileInput.value?.click();

const onFiles = async (e: Event) => {
  uploadErr.value = "";
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  input.value = "";
  if (!files.length) return;

  const free = MAX_IMAGES - images.value.length;
  if (free <= 0) {
    uploadErr.value = `Maksimum ${MAX_IMAGES} ta rasm.`;
    return;
  }
  const toUpload = files.slice(0, free);
  try {
    const urls = await uploadMany(toUpload);
    images.value.push(...urls);
  } catch (err: any) {
    uploadErr.value = "Rasm yuklashda xato.";
    console.error(err);
  }
};

const removeImage = (i: number) => images.value.splice(i, 1);
const makeMain = (i: number) => {
  if (i === 0) return;
  const [img] = images.value.splice(i, 1);
  if (img) images.value.unshift(img);
};
</script>

<template>
  <div class="mb-3">
    <label class="block text-xs text-[#94a3b8] mb-1.5 font-semibold">
      Rasmlar * (maksimum {{ MAX_IMAGES }} ta — birinchisi asosiy)
    </label>

    <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
      <!-- Mavjud rasmlar -->
      <div v-for="(img, i) in images" :key="i"
        class="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
        <img :src="img" class="w-full h-full object-cover" />
        <span v-if="i === 0"
          class="absolute top-1 left-1 text-[9px] font-bold bg-[#22c55e] text-[#031b0e] px-1.5 py-0.5 rounded-md">Asosiy</span>
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
          <button v-if="i !== 0" type="button" title="Asosiy qilish"
            class="w-7 h-7 rounded-full bg-white/20 text-white text-xs cursor-pointer hover:bg-white/30"
            @click="makeMain(i)">★</button>
          <button type="button" title="O'chirish"
            class="w-7 h-7 rounded-full bg-red-500/80 text-white text-xs cursor-pointer hover:bg-red-500"
            @click="removeImage(i)">✕</button>
        </div>
      </div>

      <!-- Qo'shish tugmasi -->
      <button v-if="images.length < MAX_IMAGES" type="button" :disabled="uploading"
        class="aspect-square rounded-xl border border-dashed border-white/20 text-[#94a3b8] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#22c55e] hover:text-[#22c55e] transition-colors disabled:opacity-50"
        @click="pickFiles">
        <span v-if="uploading" class="text-[11px]">Yuklanmoqda…</span>
        <template v-else>
          <span class="text-2xl leading-none">＋</span>
          <span class="text-[10px]">Rasm</span>
        </template>
      </button>
    </div>

    <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFiles" />
    <p v-if="uploadErr" class="text-[#ef4444] text-[12px]">{{ uploadErr }}</p>
    <p v-else class="text-[#64748b] text-[11px]">Galereyadan rasm tanlang. {{ images.length }}/{{ MAX_IMAGES }}</p>
  </div>
</template>

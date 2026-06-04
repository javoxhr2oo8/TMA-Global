<!-- app/components/Admin/ProductModal.vue -->
<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useImageUpload } from "~/composables/useImageUpload";

const MAX_IMAGES = 5;

const props = defineProps<{
  open: boolean;
  product: any | null;
  categories: string[];
  saving?: boolean;
}>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: Record<string, any>): void;
}>();

const { uploading, uploadMany } = useImageUpload();
const { formatMoney, unformatMoney } = useInputMask();

// Narx maydonlari uchun: kiritilganda 3 xonadan bo'sh joy bilan formatlaymiz
const onMoney = (key: "price" | "oldPrice", e: Event) => {
  form[key] = formatMoney((e.target as HTMLInputElement).value);
};

const blank = () => ({
  title: "",
  price: "",
  oldPrice: "",
  category: "Kiyimlar",
  brand: "",
  desc: "",
  quantity: "",
});
const form = reactive<any>(blank());
const images = ref<string[]>([]); // tayyor URL'lar (yoki data URL)
const fileInput = ref<HTMLInputElement | null>(null);
const uploadErr = ref("");

watch(
  () => [props.open, props.product],
  () => {
    if (!props.open) return;
    uploadErr.value = "";
    const p = props.product;
    if (p) {
      Object.assign(form, {
        title: p.title || "",
        price: p.price != null ? formatMoney(String(p.price)) : "",
        oldPrice: p.oldPrice != null ? formatMoney(String(p.oldPrice)) : "",
        category: p.category || "Kiyimlar",
        brand: p.brand || "",
        desc: p.desc || "",
        quantity: p.quantity ?? "",
      });
      // Eski mahsulotlarda faqat `image` bo'lishi mumkin — uni ham qo'llab-quvvatlaymiz
      if (Array.isArray(p.images) && p.images.length)
        images.value = [...p.images];
      else if (p.image) images.value = [p.image];
      else images.value = [];
    } else {
      Object.assign(form, blank());
      images.value = [];
    }
  },
  { immediate: true },
);

const pickFiles = () => fileInput.value?.click();

const onFiles = async (e: Event) => {
  uploadErr.value = "";
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  input.value = ""; // bir xil faylni qayta tanlash mumkin bo'lsin
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
if (img) images.value.unshift(img); // img: string ✅
};

const onSave = () => {
  const num = (v: any) => unformatMoney(v);
  const data: Record<string, any> = {
    title: form.title.trim(),
    price: num(form.price) ?? 0,
    images: [...images.value],
    image: images.value[0] || "", // birinchisi — asosiy (eski kod bilan moslik uchun)
    category: form.category,
    brand: form.brand.trim(),
    desc: form.desc.trim(),
    quantity: num(form.quantity),
  };
  const oldP = num(form.oldPrice);
  if (oldP != null) data.oldPrice = oldP;
  emit("save", data);
};

const inputCls =
  "w-full bg-[#161f33] text-[#eef2f8] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#22c55e]";
const labelCls = "block text-xs text-[#94a3b8] mb-1.5 font-semibold";
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-[#030810]/70 backdrop-blur-sm grid place-items-center z-50 p-[18px]"
    @click.self="$emit('close')"
  >
    <div
      class="w-full max-w-[480px] max-h-[90vh] overflow-y-auto bg-[#101828] border border-white/10 rounded-[20px] p-[22px]"
    >
      <h2 class="text-[19px] font-bold mb-4">
        {{ product ? "Mahsulotni tahrirlash" : "Yangi mahsulot" }}
      </h2>

      <div class="mb-3">
        <label :class="labelCls">Nomi *</label>
        <input
          v-model="form.title"
          placeholder="Nike Air Max 270"
          :class="inputCls"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label :class="labelCls">Narxi (so'm) *</label>
          <input
            :value="form.price"
            @input="onMoney('price', $event)"
            type="text"
            inputmode="numeric"
            placeholder="1 250 000"
            :class="inputCls"
          />
        </div>
        <div>
          <label :class="labelCls">Eski narxi</label>
          <input
            :value="form.oldPrice"
            @input="onMoney('oldPrice', $event)"
            type="text"
            inputmode="numeric"
            placeholder="1 800 000"
            :class="inputCls"
          />
        </div>
      </div>

      <!-- RASMLAR -->
      <div class="mb-3">
        <label :class="labelCls"
          >Rasmlar * (maksimum {{ MAX_IMAGES }} ta — birinchisi asosiy)</label
        >

        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
          <!-- Mavjud rasmlar -->
          <div
            v-for="(img, i) in images"
            :key="i"
            class="relative aspect-square rounded-xl overflow-hidden border border-white/10 group"
          >
            <img :src="img" class="w-full h-full object-cover" />
            <span
              v-if="i === 0"
              class="absolute top-1 left-1 text-[9px] font-bold bg-[#22c55e] text-[#031b0e] px-1.5 py-0.5 rounded-md"
              >Asosiy</span
            >
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5"
            >
              <button
                v-if="i !== 0"
                type="button"
                title="Asosiy qilish"
                class="w-7 h-7 rounded-full bg-white/20 text-white text-xs cursor-pointer hover:bg-white/30"
                @click="makeMain(i)"
              >
                ★
              </button>
              <button
                type="button"
                title="O'chirish"
                class="w-7 h-7 rounded-full bg-red-500/80 text-white text-xs cursor-pointer hover:bg-red-500"
                @click="removeImage(i)"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Qo'shish tugmasi -->
          <button
            v-if="images.length < MAX_IMAGES"
            type="button"
            :disabled="uploading"
            class="aspect-square rounded-xl border border-dashed border-white/20 text-[#94a3b8] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#22c55e] hover:text-[#22c55e] transition-colors disabled:opacity-50"
            @click="pickFiles"
          >
            <span v-if="uploading" class="text-[11px]">Yuklanmoqda…</span>
            <template v-else>
              <span class="text-2xl leading-none">＋</span>
              <span class="text-[10px]">Rasm</span>
            </template>
          </button>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="onFiles"
        />
        <p v-if="uploadErr" class="text-[#ef4444] text-[12px]">
          {{ uploadErr }}
        </p>
        <p v-else class="text-[#64748b] text-[11px]">
          Galereyadan rasm tanlang. {{ images.length }}/{{ MAX_IMAGES }}
        </p>
      </div>

      <!-- TAVSIF -->
      <div class="mb-3">
        <label :class="labelCls">Tavsif (description)</label>
        <textarea
          v-model="form.desc"
          rows="3"
          placeholder="Mahsulot haqida qisqa ma'lumot…"
          :class="[inputCls, 'resize-none']"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label :class="labelCls">Kategoriya</label>
          <select v-model="form.category" :class="inputCls">
            <option v-for="c in categories" :key="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label :class="labelCls">Brend</label>
          <input v-model="form.brand" placeholder="Nike" :class="inputCls" />
        </div>
      </div>

      <div class="mb-3">
        <label :class="labelCls">Soni (omborda) — bo'sh qoldirsangiz ko'rsatilmaydi</label>
        <input v-model="form.quantity" type="number" min="0" placeholder="masalan: 10" :class="inputCls" />
      </div>

      <div class="flex gap-2.5 mt-2">
        <button
          :disabled="saving || uploading"
          class="flex-[2] py-3 rounded-xl font-bold text-[#031b0e] bg-gradient-to-br from-[#22c55e] to-[#16a34a] cursor-pointer disabled:opacity-60"
          @click="onSave"
        >
          {{
            saving
              ? "Saqlanmoqda..."
              : uploading
                ? "Rasm yuklanmoqda..."
                : "Saqlash"
          }}
        </button>
        <button
          class="flex-1 bg-[#161f33] text-[#eef2f8] border border-white/10 rounded-xl text-[13px] font-semibold cursor-pointer hover:border-white/20 transition-colors"
          @click="$emit('close')"
        >
          Bekor qilish
        </button>
      </div>
    </div>
  </div>
</template>

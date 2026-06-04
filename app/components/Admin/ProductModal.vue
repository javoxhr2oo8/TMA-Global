<!-- app/components/Admin/ProductModal.vue -->
<script setup lang="ts">
import { reactive, ref, watch } from "vue";

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

const { formatMoney, unformatMoney } = useInputMask();

// Narx maydonlari: kiritilganda 3 xonadan bo'sh joy bilan formatlaymiz
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
const images = ref<string[]>([]); // ProductImages bilan v-model
const uploading = ref(false); // ProductImages'dagi yuklash holati

watch(
  () => [props.open, props.product],
  () => {
    if (!props.open) return;
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
      if (Array.isArray(p.images) && p.images.length) images.value = [...p.images];
      else if (p.image) images.value = [p.image];
      else images.value = [];
    } else {
      Object.assign(form, blank());
      images.value = [];
    }
  },
  { immediate: true },
);

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
  <div v-if="open" class="fixed inset-0 bg-[#030810]/70 backdrop-blur-sm grid place-items-center z-50 p-[18px]" @click.self="$emit('close')">
    <div class="w-full max-w-[480px] max-h-[90vh] overflow-y-auto bg-[#101828] border border-white/10 rounded-[20px] p-[22px]">
      <h2 class="text-[19px] font-bold mb-4">{{ product ? "Mahsulotni tahrirlash" : "Yangi mahsulot" }}</h2>

      <div class="mb-3">
        <label :class="labelCls">Nomi *</label>
        <input v-model="form.title" placeholder="Nike Air Max 270" :class="inputCls" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label :class="labelCls">Narxi (so'm) *</label>
          <input :value="form.price" @input="onMoney('price', $event)" type="text" inputmode="numeric" placeholder="1 250 000" :class="inputCls" />
        </div>
        <div>
          <label :class="labelCls">Eski narxi</label>
          <input :value="form.oldPrice" @input="onMoney('oldPrice', $event)" type="text" inputmode="numeric" placeholder="1 800 000" :class="inputCls" />
        </div>
      </div>

      <!-- RASMLAR (alohida komponent) -->
      <AdminProductImages v-model:images="images" v-model:uploading="uploading" />

      <!-- TAVSIF -->
      <div class="mb-3">
        <label :class="labelCls">Tavsif (description)</label>
        <textarea v-model="form.desc" rows="3" placeholder="Mahsulot haqida qisqa ma'lumot…" :class="[inputCls, 'resize-none']"></textarea>
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
        <button :disabled="saving || uploading"
          class="flex-[2] py-3 rounded-xl font-bold text-[#031b0e] bg-gradient-to-br from-[#22c55e] to-[#16a34a] cursor-pointer disabled:opacity-60"
          @click="onSave">
          {{ saving ? "Saqlanmoqda..." : uploading ? "Rasm yuklanmoqda..." : "Saqlash" }}
        </button>
        <button class="flex-1 bg-[#161f33] text-[#eef2f8] border border-white/10 rounded-xl text-[13px] font-semibold cursor-pointer hover:border-white/20 transition-colors"
          @click="$emit('close')">
          Bekor qilish
        </button>
      </div>
    </div>
  </div>
</template>

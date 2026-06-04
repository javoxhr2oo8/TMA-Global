<!-- app/components/Admin/ProductModal.vue -->
<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import UiSelect from "~/components/UI/Select.vue";

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

const priceError = ref("");

const validatePrices = () => {
  const price = unformatMoney(form.price) ?? 0;
  const oldPrice = unformatMoney(form.oldPrice);
  if (oldPrice != null && oldPrice > 0 && oldPrice <= price) {
    priceError.value = "Eski narx yangi narxdan katta bo'lishi kerak";
  } else {
    priceError.value = "";
  }
};

// Narx maydonlari: kiritilganda 3 xonadan bo'sh joy bilan formatlaymiz
const onMoney = (key: "price" | "oldPrice", e: Event) => {
  const el = e.target as HTMLInputElement;
  const formatted = formatMoney(el.value);
  form[key] = formatted;
  el.value = formatted; // Vue qiymat o'zgarmaganda DOM ni yangilamaydi — majburan sinxronlaymiz
  validatePrices();
};

const blank = () => ({
  title: "",
  price: "",
  oldPrice: "",
  category: "Kiyimlar",
  brand: "",
  desc: "",
  quantity: "",
  rating: 0,
});
const form = reactive<any>(blank());
const images = ref<string[]>([]); // ProductImages bilan v-model
const uploading = ref(false); // ProductImages'dagi yuklash holati
const hoverStar = ref(0); // admin reyting tanlashda hover effekti

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
        rating: Number(p.rating) || 0,
      });
      if (Array.isArray(p.images) && p.images.length)
        images.value = [...p.images];
      else if (p.image) images.value = [p.image];
      else images.value = [];
    } else {
      Object.assign(form, blank());
      images.value = [];
    }
    priceError.value = "";
  },
  { immediate: true },
);

const onSave = () => {
  validatePrices();
  if (priceError.value) return;

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
    rating: Number(form.rating) || 0,
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
  <Transition name="modal">
    <div
      v-if="open"
      class="modal-overlay fixed inset-0 z-50 grid place-items-center bg-[#030810]/70 p-4 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        class="modal-card flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#101828] shadow-2xl"
      >
        <!-- HEADER (qotib turadi) -->
        <div
          class="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-[22px] py-4"
        >
          <h2 class="text-[19px] font-bold text-white">
            {{ product ? "Mahsulotni tahrirlash" : "Yangi mahsulot" }}
          </h2>
          <button
            type="button"
            aria-label="Yopish"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#94a3b8] transition-colors hover:bg-white/10 hover:text-white active:scale-95"
            @click="$emit('close')"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- BODY (faqat shu qism scroll bo'ladi — chiroyli scrollbar) -->
        <div class="modal-body min-h-0 flex-1 overflow-y-auto px-[22px] py-5">
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
                :class="[inputCls, priceError ? '!border-red-500' : '']"
              />
              <p v-if="priceError" class="mt-1 text-xs text-red-400">
                <i class="fa-solid fa-circle-exclamation mr-1"></i
                >{{ priceError }}
              </p>
            </div>
          </div>

          <!-- RASMLAR (alohida komponent) -->
          <AdminProductImages
            v-model:images="images"
            v-model:uploading="uploading"
          />

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
              <UiSelect v-model="form.category" :options="categories" />
            </div>
            <div>
              <label :class="labelCls">Brend</label>
              <input
                v-model="form.brand"
                placeholder="Nike"
                :class="inputCls"
              />
            </div>
          </div>

          <!-- REYTING (admin qo'lda 1..5 yulduzcha qo'yadi) -->
          <div class="mb-3">
            <label :class="labelCls">Reyting (yulduzcha)</label>
            <div class="flex items-center gap-3">
              <div
                class="flex items-center gap-1.5"
                @mouseleave="hoverStar = 0"
              >
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  class="text-[26px] leading-none transition-transform active:scale-90"
                  :class="
                    n <= (hoverStar || form.rating)
                      ? 'text-yellow-400'
                      : 'text-white/20'
                  "
                  :aria-label="`${n} yulduz`"
                  @click="form.rating = n"
                  @mouseenter="hoverStar = n"
                >
                  <i class="fa-solid fa-star"></i>
                </button>
              </div>
              <span class="text-sm text-[#94a3b8]">
                {{ form.rating ? form.rating + " / 5" : "Belgilanmagan" }}
              </span>
              <button
                v-if="form.rating"
                type="button"
                class="ml-auto text-xs font-medium text-[#94a3b8] transition-colors hover:text-white"
                @click="form.rating = 0"
              >
                Tozalash
              </button>
            </div>
          </div>

          <div class="mb-3">
            <label :class="labelCls"
              >Soni (omborda) — bo'sh qoldirsangiz ko'rsatilmaydi</label
            >
            <input
              v-model="form.quantity"
              type="number"
              min="0"
              placeholder="masalan: 10"
              :class="[inputCls, 'field-number']"
            />
          </div>
        </div>
        <!-- /modal-body -->

        <!-- FOOTER (qotib turadi — "Saqlash" har doim ko'rinadi) -->
        <div
          class="flex shrink-0 gap-2.5 border-t border-white/10 px-[22px] py-4"
        >
          <button
            :disabled="saving || uploading || !!priceError"
            class="flex-[2] cursor-pointer rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] py-3 font-bold text-[#031b0e] transition-opacity active:scale-[0.99] disabled:opacity-60"
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
            class="flex-1 cursor-pointer rounded-xl border border-white/10 bg-[#161f33] text-[13px] font-semibold text-[#eef2f8] transition-colors hover:border-white/20"
            @click="$emit('close')"
          >
            Bekor qilish
          </button>
        </div>
      </div>
      <!-- /modal-card -->
    </div>
    <!-- /modal-overlay -->
  </Transition>
</template>

<style scoped>
/* Yumshoq kirish/chiqish animatsiyasi */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition:
    transform 0.26s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease;
}
.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: translateY(14px) scale(0.97);
  opacity: 0;
}

/* Chiroyli, ingichka scrollbar — faqat body ichida */
.modal-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
}
.modal-body::-webkit-scrollbar {
  width: 8px;
}
.modal-body::-webkit-scrollbar-track {
  background: transparent;
}
.modal-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.26);
  background-clip: padding-box;
}

/* type=number spinnerlarini olib tashlash */
.field-number::-webkit-outer-spin-button,
.field-number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.field-number {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>

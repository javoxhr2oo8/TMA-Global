<!-- app/pages/checkout/index.vue -->
<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import Button from "~/components/UI/Button.vue";
import BackButton from "~/components/UI/BackButton.vue";
import { formatPrice } from "@/utils/util";

const { items, totalItems, totalPrice } = useCart();
const { placeOrder, submitting } = useOrder();
const { formatPhone, phoneDigits } = useInputMask();

// Telefon kiritilganda +998 XX XXX XX XX ko'rinishiga keltiramiz
const onPhone = (e: Event) => {
  form.phone = formatPhone((e.target as HTMLInputElement).value);
};

const regions = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Buxoro",
  "Farg'ona",
  "Jizzax",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Qoraqalpog'iston",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
  "Xorazm",
];

const deliveries = ["Kuryer (yetkazib berish)", "Olib ketish (do'kondan)"];
const payments = ["Naqd", "Karta (terminal)"];

const form = reactive({
  phone: "",
  region: "",
  address: "",
  delivery: deliveries[0]!,
  payment: payments[0]!,
  comment: "",
});

const isPickup = computed(() => form.delivery.startsWith("Olib ketish"));
const err = ref("");

const onSubmit = async () => {
  err.value = "";
  if (phoneDigits(form.phone).length < 9) {
    err.value = "To'liq telefon raqamni kiriting.";
    return;
  }
  if (!form.region) {
    err.value = "Viloyatni tanlang.";
    return;
  }
  if (!isPickup.value && !form.address.trim()) {
    err.value = "Yetkazib berish manzilini kiriting.";
    return;
  }
  await placeOrder({
    phone: form.phone.trim(),
    region: form.region,
    address: form.address.trim(),
    delivery: form.delivery,
    payment: form.payment,
    comment: form.comment.trim(),
  });
};

// Savat bo'sh bo'lsa — bosh sahifaga qaytaramiz
onMounted(() => {
  if (!items.value.length) navigateTo("/");
});

const inputCls =
  "w-full bg-[#161f33] text-[#eef2f8] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#22c55e]";
const labelCls = "block text-xs text-[#94a3b8] mb-1.5 font-semibold";
</script>

<template>
  <div class="min-h-screen bg-[#0e1621] pb-28 pt-[10px] text-white">
    <div class="container py-5">
      <!-- BACK -->
      <div class="mb-4 flex items-center gap-3">
        <BackButton />
        <span class="text-base font-medium text-white/80">Rasmiylashtirish</span>
      </div>

      <!-- SUMMARY -->
      <div class="mb-5 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-xl">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-400">Mahsulotlar</span>
          <span class="font-semibold">{{ totalItems }} ta</span>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <span class="text-sm text-gray-400">Jami summa</span>
          <span class="text-[20px] font-bold text-[#00c853]">{{ formatPrice(totalPrice) }} so'm</span>
        </div>
      </div>

      <!-- FORM -->
      <div class="space-y-3.5">
        <div>
          <label :class="labelCls">Telefon raqam *</label>
          <input
            :value="form.phone"
            @input="onPhone($event)"
            type="tel"
            inputmode="tel"
            placeholder="+998 90 123 45 67"
            :class="inputCls"
          />
        </div>

        <div>
          <label :class="labelCls">Viloyat / shahar *</label>
          <select v-model="form.region" :class="inputCls">
            <option value="" disabled>Tanlang…</option>
            <option v-for="r in regions" :key="r">{{ r }}</option>
          </select>
        </div>

        <div>
          <label :class="labelCls">
            Manzil (ko'cha, uy, mo'ljal){{ isPickup ? "" : " *" }}
          </label>
          <textarea
            v-model="form.address"
            rows="2"
            :placeholder="isPickup ? 'Olib ketish — manzil shart emas' : 'Masalan: Chilonzor 9-kvartal, 3-uy, 12-xonadon'"
            :class="[inputCls, 'resize-none']"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label :class="labelCls">Yetkazib berish</label>
            <select v-model="form.delivery" :class="inputCls">
              <option v-for="d in deliveries" :key="d">{{ d }}</option>
            </select>
          </div>
          <div>
            <label :class="labelCls">To'lov (yetkazishda)</label>
            <select v-model="form.payment" :class="inputCls">
              <option v-for="p in payments" :key="p">{{ p }}</option>
            </select>
          </div>
        </div>

        <div>
          <label :class="labelCls">Izoh (ixtiyoriy)</label>
          <textarea
            v-model="form.comment"
            rows="2"
            placeholder="Qo'shimcha ma'lumot…"
            :class="[inputCls, 'resize-none']"
          ></textarea>
        </div>

        <div class="rounded-xl border border-[#008236]/20 bg-[#008236]/10 p-3 text-[13px] text-[#22c55e]">
          <i class="fa-solid fa-money-bill-wave mr-1.5"></i>
          To'lov yetkazib berishda amalga oshiriladi (naqd yoki karta).
        </div>

        <p v-if="err" class="text-sm text-red-400">{{ err }}</p>
      </div>
    </div>

    <!-- SUBMIT -->
    <div class="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-[#101828]/90 p-4 backdrop-blur">
      <Button
        class="!h-14 w-full !rounded-2xl !bg-[#008236] text-base font-semibold text-white disabled:opacity-60"
        :disabled="submitting"
        @click="onSubmit"
      >
        <i class="fa-solid fa-circle-check"></i>
        {{ submitting ? "Yuborilmoqda..." : `Buyurtmani tasdiqlash · ${formatPrice(totalPrice)} so'm` }}
      </Button>
    </div>
  </div>
</template>

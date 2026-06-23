<template>
  <div class="min-h-screen bg-[#0e1621] pt-6 text-white">
    <div class="container px-4 pt-6">
      <BackBar class="pb-6" />

      <div class="bg-[#17212b] rounded-[20px] p-5 border border-white/5">
        <div class="flex items-center gap-4">
          <div class="relative">
            <img
              v-if="!user?.photo_url"
              src="https://telegram.org/img/t_logo.png"
              class="w-24 h-24 rounded-full border-4 border-[#008236] object-cover"
              alt=""
            />
            <img
              v-else
              :src="user.photo_url"
              alt=""
              class="w-24 h-24 rounded-full border-4 border-[#008236] object-cover"
            />
            <div
              class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#00c853] border-2 border-[#17212b]"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-[24px] font-bold">
              {{ user?.first_name ? user?.first_name : firstName }}
            </h1>
            <p class="text-gray-400 mt-1">
              @{{ user?.username ? user?.username : username }}
            </p>
            <div
              class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008236]/15 text-[#39ff88] text-sm"
            >
              <i class="fa-solid fa-id-card"></i>
              {{ user?.id ? user?.id : tgId }}
            </div>
          </div>
        </div>
      </div>

      <div class="!mt-5 flex flex-col gap-3">
        <NuxtLink to="/cart">
          <Button
            class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-[#008236]/15 flex items-center justify-center"
                >
                  <i
                    class="fa-solid fa-cart-shopping text-[#00c853] text-lg"
                  ></i>
                </div>
                <div class="text-left">
                  <h3 class="font-semibold text-[16px]">Savat</h3>
                  <p class="text-sm text-gray-400">Mahsulotlar</p>
                </div>
              </div>
              <i class="fa-solid fa-chevron-right text-gray-500"></i>
            </div>
          </Button>
        </NuxtLink>

        <NuxtLink to="/favorites">
          <Button
            class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-pink-500/15 flex items-center justify-center"
                >
                  <i class="fa-solid fa-heart text-pink-400 text-lg"></i>
                </div>
                <div class="text-left">
                  <h3 class="font-semibold text-[16px]">Sevimlilar</h3>
                  <p class="text-sm text-gray-400">Saqlanganlar</p>
                </div>
              </div>
              <i class="fa-solid fa-chevron-right text-gray-500"></i>
            </div>
          </Button>
        </NuxtLink>

        <Button
          class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-2xl bg-sky-500/15 flex items-center justify-center"
              >
                <i class="fa-brands fa-telegram text-sky-400 text-xl"></i>
              </div>
              <div class="text-left">
                <h3 class="font-semibold text-[16px]">Telegram Kanal</h3>
                <p class="text-sm text-gray-400">Obuna bo'ling</p>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-gray-500"></i>
          </div>
        </Button>

        <Button
          class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-2xl bg-[#008236]/15 flex items-center justify-center"
              >
                <i class="fa-solid fa-users text-[#00c853] text-lg"></i>
              </div>
              <div class="text-left">
                <h3 class="font-semibold text-[16px]">Telegram Group</h3>
                <p class="text-sm text-gray-400">Guruhga qo'shilish</p>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-gray-500"></i>
          </div>
        </Button>

        <Button
          class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center"
              >
                <i class="fa-solid fa-headset text-blue-400 text-lg"></i>
              </div>
              <div class="text-left">
                <h3 class="font-semibold text-[16px]">Qo'llab quvatlash</h3>
                <p class="text-sm text-gray-400">
                  Muomolar va takliflar bo'yicha
                </p>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-gray-500"></i>
          </div>
        </Button>

        <div class="grid grid-cols-2 gap-3 mt-1">
          <Button
            @click="installApp()"
            class="!block !p-[3px] !bg-[#17212b] rounded-2xl border border-[#008236]/20 active:scale-[0.98] duration-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-[#008236]/15 flex items-center justify-center flex-shrink-0"
              >
                <i
                  class="text-[#00c853] text-sm"
                  :class="
                    isInstalled || addedToHomeScreen
                      ? 'fa-solid fa-circle-check'
                      : 'fa-solid fa-download'
                  "
                ></i>
              </div>
              <div class="text-left">
                <p class="font-semibold text-[13px] text-[#00c853]">
                  {{
                    isInstalled || addedToHomeScreen
                      ? "O'rnatildi"
                      : "O'rnatish"
                  }}
                </p>
                <p class="text-[11px] text-gray-500">Dastur sifatida</p>
              </div>
            </div>
          </Button>

          <Button
            @click="closeApp"
            class="!block !p-[3px] !bg-[#17212b] rounded-2xl border border-red-500/20 active:scale-[0.98] duration-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0"
              >
                <i class="fa-solid fa-power-off text-red-400 text-sm"></i>
              </div>
              <div class="text-left">
                <p class="font-semibold text-[13px] text-red-400">Yopish</p>
                <p class="text-[11px] text-gray-500">Ilovani yopish</p>
              </div>
            </div>
          </Button>
        </div>
      </div>
      <div
        v-if="showInstallModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
      >
        <div
          class="w-full max-w-sm rounded-3xl bg-[#17212b] border border-white/10 p-5"
        >
          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#008236]/15"
          >
            <i class="fa-solid fa-download text-[#00c853] text-xl"></i>
          </div>

          <h3 class="text-center text-lg font-semibold">Ilovani o'rnatish</h3>

          <!-- Telegram ichida: tashqi brauzerda ochish taklifi -->
          <template v-if="installMode === 'telegram'">
            <p class="mt-3 text-center text-sm text-gray-400">
              Ilovani telefonga o'rnatish uchun Chrome brauzerida ochish kerak.
              Quyidagi tugmani bosing — sahifa Chrome'da ochiladi, so'ng
              <b class="text-white">«Bosh ekranga qo'shish»</b> tugmasini
              toping.
            </p>

            <div class="mt-5 flex gap-3">
              <button
                @click="showInstallModal = false"
                class="flex-1 rounded-xl border border-white/10 py-3 text-sm"
              >
                Bekor qilish
              </button>

              <button
                @click="openInBrowser"
                class="flex-1 rounded-xl bg-[#008236] py-3 text-sm font-medium text-white"
              >
                Chrome'da ochish
              </button>
            </div>
          </template>

          <!-- iPhone / iPad (Safari) -->
          <template v-else-if="installMode === 'ios'">
            <p class="mt-3 text-center text-sm text-gray-400">
              iPhone yoki iPad'da ilovani bosh ekranga o'rnatish uchun:
            </p>
            <ol
              class="mt-3 space-y-2 text-sm text-gray-300 list-decimal list-inside"
            >
              <li>
                Pastdagi
                <i
                  class="fa-solid fa-arrow-up-from-bracket text-[#00c853] mx-1"
                ></i>
                <b class="text-white">Ulashish</b> tugmasini bosing
              </li>
              <li>
                Ro'yxatdan
                <b class="text-white">«Bosh ekranga qo'shish»</b>
                (Add to Home Screen) bandini tanlang
              </li>
              <li>
                Yuqori o'ng burchakdagi
                <b class="text-white">«Qo'shish»</b> tugmasini bosing
              </li>
            </ol>
            <button
              @click="showInstallModal = false"
              class="mt-5 w-full rounded-xl bg-[#008236] py-3 text-sm font-medium text-white"
            >
              Tushundim
            </button>
          </template>

          <!-- Android (Chrome o'rnatish promptini avtomatik ko'rsatmagan holat) -->
          <template v-else-if="installMode === 'android'">
            <p class="mt-3 text-center text-sm text-gray-400">
              Ilovani telefonga o'rnatish uchun:
            </p>
            <ol
              class="mt-3 space-y-2 text-sm text-gray-300 list-decimal list-inside"
            >
              <li>
                Yuqori o'ng burchakdagi
                <i
                  class="fa-solid fa-ellipsis-vertical text-[#00c853] mx-1"
                ></i>
                menyuni oching
              </li>
              <li>
                <b class="text-white">«Ilovani o'rnatish»</b> yoki
                <b class="text-white">«Bosh ekranga qo'shish»</b> bandini
                tanlang
              </li>
              <li>
                Tasdiqlash uchun <b class="text-white">«O'rnatish»</b> tugmasini
                bosing
              </li>
            </ol>
            <p class="mt-3 text-center text-xs text-gray-500">
              Eslatma: bu funksiya Chrome yoki Edge brauzerida mavjud.
            </p>
            <button
              @click="showInstallModal = false"
              class="mt-5 w-full rounded-xl bg-[#008236] py-3 text-sm font-medium text-white"
            >
              Tushundim
            </button>
          </template>

          <!-- Kompyuter (Desktop) -->
          <template v-else>
            <p class="mt-3 text-center text-sm text-gray-400">
              Kompyuterga ilova sifatida o'rnatish uchun:
            </p>
            <ol
              class="mt-3 space-y-2 text-sm text-gray-300 list-decimal list-inside"
            >
              <li>
                Manzil satrining o'ng tomonidagi
                <i class="fa-solid fa-circle-down text-[#00c853] mx-1"></i>
                o'rnatish belgisini bosing
              </li>
              <li>
                Yoki brauzer menyusi (⋮) →
                <b class="text-white">«Ilovani o'rnatish»</b> ni tanlang
              </li>
            </ol>
            <button
              @click="showInstallModal = false"
              class="mt-5 w-full rounded-xl bg-[#008236] py-3 text-sm font-medium text-white"
            >
              Tushundim
            </button>
          </template>
        </div>
      </div>
      <p class="text-center text-[12px] text-gray-600 mt-6 pb-6">
        Version 0.0.1
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Button from "~/components/UI/Button.vue";
import BackBar from "~/components/UI/BackBar.vue";

const firstName = "Javokhir";
const username = "javokhir";
const tgId = "123456789";
const {
  user,
  hapticImpact,
  closeApp,
  openLink,
  tg,
  isTelegram,
  canAddToHomeScreen,
  addToHomeScreen,
  onHomeScreenAdded,
} = useTelegram();
const { install, canInstall, isInstalled } = usePwaInstall();
const showInstallModal = ref(false);
const addedToHomeScreen = ref(false);

if (import.meta.client) {
  onHomeScreenAdded(() => {
    addedToHomeScreen.value = true;
    if (hapticImpact) hapticImpact("light");
  });
}

const installMode = computed(() => {
  if (isTelegram) return "telegram";

  if (!import.meta.client) return "desktop";

  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  if (isIOS) return "ios";

  const isAndroid = /Android/.test(ua);
  if (isAndroid) return "android";

  return "desktop";
});

const installApp = async () => {
  if (hapticImpact) hapticImpact("light");

  if (isInstalled.value || addedToHomeScreen.value) {
    alert("Ilova allaqachon o'rnatilgan!");
    return;
  }

  if (isTelegram && canAddToHomeScreen) {
    addToHomeScreen();
    return;
  }

  if (canInstall.value) {
    await install();
    return;
  }

  showInstallModal.value = true;
};

const openInBrowser = () => {
  const appUrl = window.location.origin;
  showInstallModal.value = false;

  if (tg && typeof tg.openLink === "function") {
    tg.openLink(appUrl, { try_instant_view: false });
  } else {
    window.open(appUrl, "_blank");
  }
};
</script>

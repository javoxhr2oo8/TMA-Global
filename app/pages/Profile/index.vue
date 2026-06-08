<template>
  <div class="min-h-screen bg-[#0e1621] pt-6 text-white">
    <div class="container px-4 pt-6">
      <BackBar class="pb-6" />

      <div class="bg-[#17212b] rounded-[20px] p-5 border border-white/5">
        <div class="flex items-center gap-4">
          <div class="relative">
            <img v-if="!user?.photo_url" src="https://telegram.org/img/t_logo.png"
              class="w-24 h-24 rounded-full border-4 border-[#008236] object-cover" alt="" />
            <img v-else :src="user.photo_url" alt=""
              class="w-24 h-24 rounded-full border-4 border-[#008236] object-cover" />
            <div class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#00c853] border-2 border-[#17212b]" />
          </div>
          <div class="flex-1">
            <h1 class="text-[24px] font-bold">
              {{ user?.first_name ? user?.first_name : firstName }}
            </h1>
            <p class="text-gray-400 mt-1">
              @{{ user?.username ? user?.username : username }}
            </p>
            <div
              class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008236]/15 text-[#39ff88] text-sm">
              <i class="fa-solid fa-id-card"></i>
              {{ user?.id ? user?.id : tgId }}
            </div>
          </div>
        </div>
      </div>

      <div class="!mt-5 flex flex-col gap-3">
        <NuxtLink to="/cart">
          <Button
            class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-[#008236]/15 flex items-center justify-center">
                  <i class="fa-solid fa-cart-shopping text-[#00c853] text-lg"></i>
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
            class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-pink-500/15 flex items-center justify-center">
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
          class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-sky-500/15 flex items-center justify-center">
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
          class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#008236]/15 flex items-center justify-center">
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
          class="!block !p-[3px] w-full !justify-start !items-start text-left !bg-[#17212b] rounded-2xl p-4 border border-white/5 active:scale-[0.98] duration-200">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center">
                <i class="fa-solid fa-headset text-blue-400 text-lg"></i>
              </div>
              <div class="text-left">
                <h3 class="font-semibold text-[16px]">Qo'llab quvatlash</h3>
                <p class="text-sm text-gray-400">Muomolar va takliflar bo'yicha</p>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-gray-500"></i>
          </div>
        </Button>

        <div class="grid grid-cols-2 gap-3 mt-1">
          <Button @click="installApp()"
            class="!block !p-[3px] !bg-[#17212b] rounded-2xl border border-[#008236]/20 active:scale-[0.98] duration-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#008236]/15 flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-download text-[#00c853] text-sm"></i>
              </div>
              <div class="text-left">
                <p class="font-semibold text-[13px] text-[#00c853]">O'rnatish</p>
                <p class="text-[11px] text-gray-500">Dastur sifatida</p>
              </div>
            </div>
          </Button>

          <Button @click="closeApp"
            class="!block !p-[3px] !bg-[#17212b] rounded-2xl border border-red-500/20 active:scale-[0.98] duration-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
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

      <p class="text-center text-[12px] text-gray-600 mt-6 pb-6">Version 0.0.1</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Button from "~/components/UI/Button.vue";
import BackBar from "~/components/UI/BackBar.vue";

const firstName = "Javokhir";
const username = "javokhir";
const tgId = "123456789";
const { user, hapticImpact, closeApp } = useTelegram();

const deferredPrompt = ref(null);
const showInstallBtn = ref(false);

const captureInstallEvent = (e) => {
  e.preventDefault();
  deferredPrompt.value = e;
  showInstallBtn.value = true;
};

onMounted(() => {
  // Слушаем событие от браузера
  window.addEventListener('beforeinstallprompt', captureInstallEvent);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', captureInstallEvent);
});

const installApp = async () => {
  console.log("Кнопка нажата!");

  if (!deferredPrompt.value) {
    console.warn("Браузер еще не разрешил установку! deferredPrompt равен null.");
    return;
  }

  try {
    if (hapticImpact) hapticImpact('light');
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    console.log(`Пользователь ответил: ${outcome}`);
  } catch (err) {
    console.error("Ошибка при вызове окна установки:", err);
  }

  deferredPrompt.value = null;
  showInstallBtn.value = false;
};
</script>
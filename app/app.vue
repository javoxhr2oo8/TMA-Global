<script setup lang="ts">
import { useStore } from './store/store';
import Loader from './components/UI/Loader.vue';
import RegistrationModal from './components/UI/RegistrationModal.vue';

const store = useStore()
const route = useRoute();
const router = useRouter();
const { showBackButton, hideBackButton, setHeaderColor, expand } = useTelegram();
const { submit, isRegistered, markRegistered } = useRegistration();
useColorMode()

// Ro'yxatdan o'tish modal holati
const showRegModal = ref(false)
const regSaving = ref(false)

watch(
  () => route.path,
  (path) => {
    if (path === '/') {
      hideBackButton();
      setHeaderColor('#008236')
    } else {
      showBackButton(() => router.back());
      setHeaderColor('#101828')
    }
  },
  { immediate: true }
);

onMounted(() => {
  expand()
  setHeaderColor('#008236')

  // Agar foydalanuvchi ro'yxatdan o'tmagan bo'lsa — formani ko'rsatish
  if (!isRegistered()) {
    showRegModal.value = true
  }
})

const onRegSubmit = async (data: { firstName: string; lastName: string; phone: string; address: string }) => {
  regSaving.value = true
  try {
    await submit(data)
    markRegistered()
    showRegModal.value = false
  } catch (e: any) {
    console.error('Registration error:', e)
    if (import.meta.client && window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert("Xatolik yuz berdi. Qayta urinib ko'ring.")
    } else {
      alert("Xatolik yuz berdi. Qayta urinib ko'ring.")
    }
  } finally {
    regSaving.value = false
  }
}
</script>

<template>
  <div class="app bg-olive-300 dark:bg-gray-900 transition-colors duration-300">
    <NuxtPwaManifest />
    <NuxtLayout />
    <Loader v-if="store.loader"/>

    <!-- Ro'yxatdan o'tish formasi -->
    <RegistrationModal
      :open="showRegModal"
      :saving="regSaving"
      @submit="onRegSubmit"
    />
  </div>
</template>

<!-- min-h-screen -->
<style>
.app {
  height: 100%;
  /* overflow-y: auto !important;
  height: 100vh !important; */
  /* padding-top: 100px; */
}
</style>
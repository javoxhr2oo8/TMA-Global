// composables/usePwaInstall.ts
// Foydalanuvchiga ilovani telefoniga o'rnatish imkonini beradi (PWA install prompt).
// Telegram Mini App ichida ham, oddiy brauzerda ham ishlaydi.

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const usePwaInstall = () => {
  // beforeinstallprompt eventi kelganida saqlab qo'yamiz
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);

  // O'rnatish tugmasi ko'rsatiladimi?
  const canInstall = computed(() => !!deferredPrompt.value);

  // Allaqachon o'rnatilganmi? (standalone rejim)
  const isInstalled = computed(() => {
    if (!import.meta.client) return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as any).standalone === true
    );
  });

  if (import.meta.client) {
    // Chrome/Edge/Android: o'rnatish imkoniyati paydo bo'lganda
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault(); // Brauzerning avtomatik popup'ini to'xamiz
      deferredPrompt.value = e;
    });

    // Muvaffaqiyatli o'rnatilganda promptni tozalaymiz
    window.addEventListener("appinstalled", () => {
      deferredPrompt.value = null;
    });
  }

  // Tugma bosilganda chaqiriladigan funksiya
  const install = async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!deferredPrompt.value) return "unavailable";

    await deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;

    if (outcome === "accepted") {
      deferredPrompt.value = null;
    }

    return outcome;
  };

  return {
    canInstall,
    isInstalled,
    install,
  };
};

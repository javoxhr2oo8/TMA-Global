
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
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
  const canInstall = computed(() => !!deferredPrompt.value);
  const isInstalled = computed(() => {
    if (!import.meta.client) return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );
  });

  if (import.meta.client) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault(); // Brauzerning avtomatik popup'ini to'xamiz
      deferredPrompt.value = e;
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt.value = null;
    });
  }

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

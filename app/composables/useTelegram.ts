// composables/useTelegram.ts

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

type HapticNotificationType = "error" | "success" | "warning";
type HapticImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat?: object;
    auth_date?: number;
    hash?: string;
  };
  themeParams: TelegramThemeParams;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    notificationOccurred: (type: HapticNotificationType) => void;
    impactOccurred: (style: HapticImpactStyle) => void;
  };
  close: () => void;
  sendData: (data: string) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (
    message: string,
    callback: (confirmed: boolean) => void,
  ) => void;
  setHeaderColor: (color: string) => void;
  expand: () => void;
  isExpanded: boolean;
  version: string;
  platform?: string;
  isVersionAtLeast: (version: string) => boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface UseTelegramReturn {
  tg: TelegramWebApp | null;
  user: TelegramUser | undefined;
  closeApp: () => void;
  sendData: (data: string) => void;
  showAlert: (message: string) => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hapticNotification: (type: HapticNotificationType) => void;
  hapticImpact: (style?: HapticImpactStyle) => void;
  setHeaderColor: (color: string) => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  expand: () => void;
  isVersionAtLeast: (version: string) => boolean;
  isReady: boolean;
  isTelegram: boolean;
  initData: string;
  themeParams: TelegramThemeParams;
}

export const useTelegram = (): UseTelegramReturn => {
  const tg: TelegramWebApp | null = import.meta.client
    ? (window.Telegram?.WebApp ?? null)
    : null;

  const user: TelegramUser | undefined = tg?.initDataUnsafe?.user;

  // Ilova haqiqatan ham Telegram ichida ochilganmi?
  // telegram-web-app.js skripti brauzerda ham window.Telegram.WebApp ni
  // yaratadi, lekin u holda platform === 'unknown' va initData bo'sh bo'ladi.
  // Shu sababli faqat !!tg yetarli emas.
  const platform: string = tg?.platform ?? "unknown";
  const isTelegram: boolean =
    !!tg && (platform !== "unknown" || (tg.initData?.length ?? 0) > 0);

  // Telegram metodlari versiyaga bog'liq. Masalan setHeaderColor,
  // BackButton va HapticFeedback faqat 6.1+ da bor. 6.0 da chaqirilsa
  // "not supported in version 6.0" ogohlantirishi chiqadi — shuning
  // uchun har bir chaqiruvni versiya bilan tekshiramiz.
  const isVersionAtLeast = (version: string): boolean => {
    if (!tg) return false;
    if (typeof tg.isVersionAtLeast === "function") {
      return tg.isVersionAtLeast(version);
    }
    return parseFloat(tg.version ?? "6.0") >= parseFloat(version);
  };

  const closeApp = (): void => {
    if (!tg) return;
    if (isVersionAtLeast("6.2")) {
      tg.showConfirm("Ilovani yopmoqchimisiz?", (confirmed) => {
        if (confirmed) tg.close();
      });
    } else {
      tg.close();
    }
  };

  // Buyurtma ma'lumotini Telegram bot'ga yuboradi (web_app_data update).
  // Diqqat: sendData faqat Mini App reply-keyboard tugmasi orqali ochilganda
  // ishlaydi va yuborgandan keyin ilovani avtomatik yopadi. Limit ~4096 bayt.
  const sendData = (data: string): void => {
    tg?.sendData(data);
  };

  const showAlert = (message: string): void => {
    // tg.showAlert faqat Bot API 6.2+ da bor. Eski versiyalarda
    // "WebAppMethodUnsupported" xatosi tashlanadi — shuning uchun
    // versiyani tekshirib, bo'lmasa oddiy alert'ga tushamiz.
    if (tg && isVersionAtLeast("6.2")) {
      tg.showAlert(message);
    } else if (import.meta.client) {
      window.alert(message);
    }
  };

  const hapticNotification = (type: HapticNotificationType): void => {
    if (!isVersionAtLeast("6.1")) return;
    tg?.HapticFeedback.notificationOccurred(type);
  };

  const hapticImpact = (style: HapticImpactStyle = "light"): void => {
    if (!isVersionAtLeast("6.1")) return;
    tg?.HapticFeedback.impactOccurred(style);
  };

  const showMainButton = (text: string, onClick: () => void): void => {
    if (tg) {
      tg.MainButton.text = text;
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    }
  };

  const setHeaderColor = (color: string): void => {
    if (!isVersionAtLeast("6.1")) return;
    tg?.setHeaderColor(color);
  };

  let backButtonCallback: (() => void) | null = null;

  const showBackButton = (onClick: () => void): void => {
    if (tg && isVersionAtLeast("6.1")) {
      if (backButtonCallback) {
        tg.BackButton.offClick(backButtonCallback);
      }
      backButtonCallback = onClick;
      tg.BackButton.onClick(backButtonCallback);
      tg.BackButton.show();
    }
  };

  const hideBackButton = (): void => {
    if (tg && isVersionAtLeast("6.1")) {
      if (backButtonCallback) {
        tg.BackButton.offClick(backButtonCallback);
        backButtonCallback = null;
      }
      tg.BackButton.hide();
    }
  };

  const expand = (): void => {
    tg?.expand();
  };

  return {
    tg,
    user,
    closeApp,
    sendData,
    showAlert,
    showMainButton,
    hapticNotification,
    hapticImpact,
    setHeaderColor,
    showBackButton,
    hideBackButton,
    expand,
    isVersionAtLeast,
    isReady: !!tg,
    isTelegram,
    initData: tg?.initData ?? "",
    themeParams: tg?.themeParams ?? {},
  };
};

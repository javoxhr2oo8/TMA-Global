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

type HapticNotificationType = 'error' | 'success' | 'warning';
type HapticImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';

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
    showAlert: (message: string, callback?: () => void) => void;
    setHeaderColor: (color: string) => void;
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
    showAlert: (message: string) => void;
    showMainButton: (text: string, onClick: () => void) => void;
    hapticNotification: (type: HapticNotificationType) => void;
    hapticImpact: (style?: HapticImpactStyle) => void;
    setHeaderColor: (color: string) => void;
    showBackButton: (onClick: () => void) => void;
    hideBackButton: () => void;
    isReady: boolean;
    initData: string;
    themeParams: TelegramThemeParams;
}

export const useTelegram = (): UseTelegramReturn => {
    const tg: TelegramWebApp | null = import.meta.client
        ? (window.Telegram?.WebApp ?? null)
        : null;

    const user: TelegramUser | undefined = tg?.initDataUnsafe?.user;

    const closeApp = (): void => {
        tg?.close();
    };

    const showAlert = (message: string): void => {
        tg?.showAlert(message);
    };

    const hapticNotification = (type: HapticNotificationType): void => {
        tg?.HapticFeedback.notificationOccurred(type);
    };

    const hapticImpact = (style: HapticImpactStyle = 'light'): void => {
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
        tg?.setHeaderColor(color);
    };

    // Хранит текущий колбэк, чтобы можно было снять его перед заменой
    let backButtonCallback: (() => void) | null = null;

    const showBackButton = (onClick: () => void): void => {
        if (tg) {
            // Снимаем предыдущий обработчик если есть
            if (backButtonCallback) {
                tg.BackButton.offClick(backButtonCallback);
            }
            backButtonCallback = onClick;
            tg.BackButton.onClick(backButtonCallback);
            tg.BackButton.show();
        }
    };

    const hideBackButton = (): void => {
        if (tg) {
            if (backButtonCallback) {
                tg.BackButton.offClick(backButtonCallback);
                backButtonCallback = null;
            }
            tg.BackButton.hide();
        }
    };

    return {
        tg,
        user,
        closeApp,
        showAlert,
        showMainButton,
        hapticNotification,
        hapticImpact,
        setHeaderColor,
        showBackButton,
        hideBackButton,
        isReady: !!tg,
        initData: tg?.initData ?? '',
        themeParams: tg?.themeParams ?? {}
    };
};
// composables/useTelegram.js
export const useTelegram = () => {
    const tg = process.client ? window.Telegram?.WebApp : null;

    const user = tg?.initDataUnsafe?.user;

    const closeApp = () => {
        tg?.close();
    };

    const showAlert = (message) => {
        tg?.showAlert(message);
    };

    const hapticNotification = (type) => {
        tg?.HapticFeedback.notificationOccurred(type);
    };

    const hapticImpact = (style = 'light') => {
        tg?.HapticFeedback.impactOccurred(style);
    };

    const showMainButton = (text, onClick) => {
        if (tg) {
            tg.MainButton.text = text;
            tg.MainButton.show();
            tg.MainButton.onClick(onClick);
        }
    };

    const setHeaderColor = (color) => {
        if (tg) {
            tg.setHeaderColor(color);
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
        isReady: !!tg,
        initData: tg?.initData || '',
        themeParams: tg?.themeParams || {}
    };
};
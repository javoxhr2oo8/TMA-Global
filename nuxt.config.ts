// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
      ],
      link: [
        // Tashqi resurslarga oldindan ulanish (DNS/TLS) — birinchi yuklash tezroq
        {
          rel: "preconnect",
          href: "https://cdnjs.cloudflare.com",
          crossorigin: "anonymous",
        },
        { rel: "preconnect", href: "https://firestore.googleapis.com" },
        { rel: "preconnect", href: "https://firebasestorage.googleapis.com" },
        { rel: "preconnect", href: "https://avatars.mds.yandex.net" },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
          integrity:
            "sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==",
          crossorigin: "anonymous",
          referrerpolicy: "no-referrer",
        },
      ],
      script: [
        { src: "https://telegram.org/js/telegram-web-app.js", defer: true },
      ],
    },
  },
  runtimeConfig: {
    // server-only (maxfiy) — faqat serverda o'qiladi, klientga chiqmaydi
    botToken: "", // NUXT_BOT_TOKEN
    adminChatId: "", // NUXT_ADMIN_CHAT_ID
    firebaseServiceAccount: "", // NUXT_FIREBASE_SERVICE_ACCOUNT (ixtiyoriy, JSON string)
    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      firebaseStorageBucket: "",
      firebaseMessagingSenderId: "",
      firebaseAppId: "",
    },
  },
  modules: ["@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    typeCheck: false,
  },
  ssr: false,
  css: ["~/assets/css/main.css"],
  devtools: { enabled: false },
});

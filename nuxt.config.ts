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
        { rel: 'manifest', href: '/manifest.webmanifest' },
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
    botToken: "",
    adminChatId: "",
    firebaseServiceAccount: "",
    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      firebaseStorageBucket: "",
      firebaseMessagingSenderId: "",
      firebaseAppId: "",
    },
  },
  modules: ["@pinia/nuxt", '@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      id: '/',
      name: 'Quulay Market',
      short_name: 'Quulay',
      description: 'Telegram orqali qulay va tezkor onlayn xarid qilish tajribasi',
      theme_color: '#008236',
      background_color: '#008236',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icons/app-logo.png',
          sizes: '1254x1254',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/app-logo.png',
          sizes: '1254x1254',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      screenshots: [
        {
          src: '/icons/app-logo.png',
          sizes: '1254x1254',
          type: 'image/png',
          form_factor: 'wide'
        },
        {
          src: '/icons/app-logo.png',
          sizes: '1254x1254',
          type: 'image/png',
          form_factor: 'narrow'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    typeCheck: false,
  },
  ssr: false,
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
});
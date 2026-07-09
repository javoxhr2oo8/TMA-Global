
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  'AdminBannerModal': typeof import("../../app/components/Admin/BannerModal.vue").default
  'AdminBanners': typeof import("../../app/components/Admin/Banners.vue").default
  'AdminLogin': typeof import("../../app/components/Admin/Login.vue").default
  'AdminOrders': typeof import("../../app/components/Admin/Orders.vue").default
  'AdminProductCard': typeof import("../../app/components/Admin/ProductCard.vue").default
  'AdminProductGrid': typeof import("../../app/components/Admin/ProductGrid.vue").default
  'AdminProductImages': typeof import("../../app/components/Admin/ProductImages.vue").default
  'AdminProductModal': typeof import("../../app/components/Admin/ProductModal.vue").default
  'AdminRegistrations': typeof import("../../app/components/Admin/Registrations.vue").default
  'AdminStats': typeof import("../../app/components/Admin/Stats.vue").default
  'AdminToast': typeof import("../../app/components/Admin/Toast.vue").default
  'AdminTopBar': typeof import("../../app/components/Admin/TopBar.vue").default
  'Categories': typeof import("../../app/components/Categories/index.vue").default
  'Header': typeof import("../../app/components/Header/index.vue").default
  'Hero': typeof import("../../app/components/Hero/index.vue").default
  'HeroSlides': typeof import("../../app/components/Hero/slides").default
  'Main': typeof import("../../app/components/Main/index.vue").default
  'ProductBottomBar': typeof import("../../app/components/Product/BottomBar.vue").default
  'ProductGallery': typeof import("../../app/components/Product/Gallery.vue").default
  'ProductInfo': typeof import("../../app/components/Product/Info.vue").default
  'UIAppSwiper': typeof import("../../app/components/UI/AppSwiper.vue").default
  'UIBackBar': typeof import("../../app/components/UI/BackBar.vue").default
  'UIBackButton': typeof import("../../app/components/UI/BackButton.vue").default
  'UIButton': typeof import("../../app/components/UI/Button.vue").default
  'UIConfirmModal': typeof import("../../app/components/UI/ConfirmModal.vue").default
  'UIInstallButton': typeof import("../../app/components/UI/InstallButton.vue").default
  'UILoader': typeof import("../../app/components/UI/Loader.vue").default
  'UIOrderSuccessModal': typeof import("../../app/components/UI/OrderSuccessModal.vue").default
  'UIProductCard': typeof import("../../app/components/UI/ProductCard.vue").default
  'UIRegistrationModal': typeof import("../../app/components/UI/RegistrationModal.vue").default
  'UISelect': typeof import("../../app/components/UI/Select.vue").default
  'UIToasts': typeof import("../../app/components/UI/Toasts.vue").default
  'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default
  'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default
  'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
  'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only").default
  'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default
  'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default
  'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default
  'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
  'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
  'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
  'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
  'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
  'VitePwaManifest': typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest").default
  'NuxtPwaManifest': typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest").default
  'NuxtPwaAssets': typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/NuxtPwaAssets").default
  'PwaAppleImage': typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaAppleImage").default
  'PwaAppleSplashScreenImage': typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaAppleSplashScreenImage").default
  'PwaFaviconImage': typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaFaviconImage").default
  'PwaMaskableImage': typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaMaskableImage").default
  'PwaTransparentImage': typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaTransparentImage").default
  'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page").default
  'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript
  'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link
  'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base
  'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title
  'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta
  'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style
  'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head
  'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html
  'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body
  'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default
  'LazyAdminBannerModal': LazyComponent<typeof import("../../app/components/Admin/BannerModal.vue").default>
  'LazyAdminBanners': LazyComponent<typeof import("../../app/components/Admin/Banners.vue").default>
  'LazyAdminLogin': LazyComponent<typeof import("../../app/components/Admin/Login.vue").default>
  'LazyAdminOrders': LazyComponent<typeof import("../../app/components/Admin/Orders.vue").default>
  'LazyAdminProductCard': LazyComponent<typeof import("../../app/components/Admin/ProductCard.vue").default>
  'LazyAdminProductGrid': LazyComponent<typeof import("../../app/components/Admin/ProductGrid.vue").default>
  'LazyAdminProductImages': LazyComponent<typeof import("../../app/components/Admin/ProductImages.vue").default>
  'LazyAdminProductModal': LazyComponent<typeof import("../../app/components/Admin/ProductModal.vue").default>
  'LazyAdminRegistrations': LazyComponent<typeof import("../../app/components/Admin/Registrations.vue").default>
  'LazyAdminStats': LazyComponent<typeof import("../../app/components/Admin/Stats.vue").default>
  'LazyAdminToast': LazyComponent<typeof import("../../app/components/Admin/Toast.vue").default>
  'LazyAdminTopBar': LazyComponent<typeof import("../../app/components/Admin/TopBar.vue").default>
  'LazyCategories': LazyComponent<typeof import("../../app/components/Categories/index.vue").default>
  'LazyHeader': LazyComponent<typeof import("../../app/components/Header/index.vue").default>
  'LazyHero': LazyComponent<typeof import("../../app/components/Hero/index.vue").default>
  'LazyHeroSlides': LazyComponent<typeof import("../../app/components/Hero/slides").default>
  'LazyMain': LazyComponent<typeof import("../../app/components/Main/index.vue").default>
  'LazyProductBottomBar': LazyComponent<typeof import("../../app/components/Product/BottomBar.vue").default>
  'LazyProductGallery': LazyComponent<typeof import("../../app/components/Product/Gallery.vue").default>
  'LazyProductInfo': LazyComponent<typeof import("../../app/components/Product/Info.vue").default>
  'LazyUIAppSwiper': LazyComponent<typeof import("../../app/components/UI/AppSwiper.vue").default>
  'LazyUIBackBar': LazyComponent<typeof import("../../app/components/UI/BackBar.vue").default>
  'LazyUIBackButton': LazyComponent<typeof import("../../app/components/UI/BackButton.vue").default>
  'LazyUIButton': LazyComponent<typeof import("../../app/components/UI/Button.vue").default>
  'LazyUIConfirmModal': LazyComponent<typeof import("../../app/components/UI/ConfirmModal.vue").default>
  'LazyUIInstallButton': LazyComponent<typeof import("../../app/components/UI/InstallButton.vue").default>
  'LazyUILoader': LazyComponent<typeof import("../../app/components/UI/Loader.vue").default>
  'LazyUIOrderSuccessModal': LazyComponent<typeof import("../../app/components/UI/OrderSuccessModal.vue").default>
  'LazyUIProductCard': LazyComponent<typeof import("../../app/components/UI/ProductCard.vue").default>
  'LazyUIRegistrationModal': LazyComponent<typeof import("../../app/components/UI/RegistrationModal.vue").default>
  'LazyUISelect': LazyComponent<typeof import("../../app/components/UI/Select.vue").default>
  'LazyUIToasts': LazyComponent<typeof import("../../app/components/UI/Toasts.vue").default>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default>
  'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
  'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only").default>
  'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default>
  'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
  'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
  'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
  'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
  'LazyVitePwaManifest': LazyComponent<typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest").default>
  'LazyNuxtPwaManifest': LazyComponent<typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest").default>
  'LazyNuxtPwaAssets': LazyComponent<typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/NuxtPwaAssets").default>
  'LazyPwaAppleImage': LazyComponent<typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaAppleImage").default>
  'LazyPwaAppleSplashScreenImage': LazyComponent<typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaAppleSplashScreenImage").default>
  'LazyPwaFaviconImage': LazyComponent<typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaFaviconImage").default>
  'LazyPwaMaskableImage': LazyComponent<typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaMaskableImage").default>
  'LazyPwaTransparentImage': LazyComponent<typeof import("../../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaTransparentImage").default>
  'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page").default>
  'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript>
  'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link>
  'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base>
  'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title>
  'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta>
  'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style>
  'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head>
  'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html>
  'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body>
  'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}


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


export const AdminLogin: typeof import("../app/components/Admin/Login.vue").default
export const AdminOrders: typeof import("../app/components/Admin/Orders.vue").default
export const AdminProductCard: typeof import("../app/components/Admin/ProductCard.vue").default
export const AdminProductGrid: typeof import("../app/components/Admin/ProductGrid.vue").default
export const AdminProductImages: typeof import("../app/components/Admin/ProductImages.vue").default
export const AdminProductModal: typeof import("../app/components/Admin/ProductModal.vue").default
export const AdminStats: typeof import("../app/components/Admin/Stats.vue").default
export const AdminToast: typeof import("../app/components/Admin/Toast.vue").default
export const AdminTopBar: typeof import("../app/components/Admin/TopBar.vue").default
export const Categories: typeof import("../app/components/Categories/index.vue").default
export const Header: typeof import("../app/components/Header/index.vue").default
export const Hero: typeof import("../app/components/Hero/index.vue").default
export const HeroSlides: typeof import("../app/components/Hero/slides").default
export const Main: typeof import("../app/components/Main/index.vue").default
export const ProductBottomBar: typeof import("../app/components/Product/BottomBar.vue").default
export const ProductGallery: typeof import("../app/components/Product/Gallery.vue").default
export const ProductInfo: typeof import("../app/components/Product/Info.vue").default
export const UIAppSwiper: typeof import("../app/components/UI/AppSwiper.vue").default
export const UIBackBar: typeof import("../app/components/UI/BackBar.vue").default
export const UIBackButton: typeof import("../app/components/UI/BackButton.vue").default
export const UIButton: typeof import("../app/components/UI/Button.vue").default
export const UIInstallButton: typeof import("../app/components/UI/InstallButton.vue").default
export const UILoader: typeof import("../app/components/UI/Loader.vue").default
export const UIOrderSuccessModal: typeof import("../app/components/UI/OrderSuccessModal.vue").default
export const UIProductCard: typeof import("../app/components/UI/ProductCard.vue").default
export const UISelect: typeof import("../app/components/UI/Select.vue").default
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue").default
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout").default
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only").default
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only").default
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder").default
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link").default
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
export const VitePwaManifest: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest").default
export const NuxtPwaManifest: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest").default
export const NuxtPwaAssets: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/NuxtPwaAssets").default
export const PwaAppleImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaAppleImage").default
export const PwaAppleSplashScreenImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaAppleSplashScreenImage").default
export const PwaFaviconImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaFaviconImage").default
export const PwaMaskableImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaMaskableImage").default
export const PwaTransparentImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaTransparentImage").default
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page").default
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components").NoScript
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components").Link
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components").Base
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components").Title
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components").Meta
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components").Style
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components").Head
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components").Html
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components").Body
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island").default
export const LazyAdminLogin: LazyComponent<typeof import("../app/components/Admin/Login.vue").default>
export const LazyAdminOrders: LazyComponent<typeof import("../app/components/Admin/Orders.vue").default>
export const LazyAdminProductCard: LazyComponent<typeof import("../app/components/Admin/ProductCard.vue").default>
export const LazyAdminProductGrid: LazyComponent<typeof import("../app/components/Admin/ProductGrid.vue").default>
export const LazyAdminProductImages: LazyComponent<typeof import("../app/components/Admin/ProductImages.vue").default>
export const LazyAdminProductModal: LazyComponent<typeof import("../app/components/Admin/ProductModal.vue").default>
export const LazyAdminStats: LazyComponent<typeof import("../app/components/Admin/Stats.vue").default>
export const LazyAdminToast: LazyComponent<typeof import("../app/components/Admin/Toast.vue").default>
export const LazyAdminTopBar: LazyComponent<typeof import("../app/components/Admin/TopBar.vue").default>
export const LazyCategories: LazyComponent<typeof import("../app/components/Categories/index.vue").default>
export const LazyHeader: LazyComponent<typeof import("../app/components/Header/index.vue").default>
export const LazyHero: LazyComponent<typeof import("../app/components/Hero/index.vue").default>
export const LazyHeroSlides: LazyComponent<typeof import("../app/components/Hero/slides").default>
export const LazyMain: LazyComponent<typeof import("../app/components/Main/index.vue").default>
export const LazyProductBottomBar: LazyComponent<typeof import("../app/components/Product/BottomBar.vue").default>
export const LazyProductGallery: LazyComponent<typeof import("../app/components/Product/Gallery.vue").default>
export const LazyProductInfo: LazyComponent<typeof import("../app/components/Product/Info.vue").default>
export const LazyUIAppSwiper: LazyComponent<typeof import("../app/components/UI/AppSwiper.vue").default>
export const LazyUIBackBar: LazyComponent<typeof import("../app/components/UI/BackBar.vue").default>
export const LazyUIBackButton: LazyComponent<typeof import("../app/components/UI/BackButton.vue").default>
export const LazyUIButton: LazyComponent<typeof import("../app/components/UI/Button.vue").default>
export const LazyUIInstallButton: LazyComponent<typeof import("../app/components/UI/InstallButton.vue").default>
export const LazyUILoader: LazyComponent<typeof import("../app/components/UI/Loader.vue").default>
export const LazyUIOrderSuccessModal: LazyComponent<typeof import("../app/components/UI/OrderSuccessModal.vue").default>
export const LazyUIProductCard: LazyComponent<typeof import("../app/components/UI/ProductCard.vue").default>
export const LazyUISelect: LazyComponent<typeof import("../app/components/UI/Select.vue").default>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue").default>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout").default>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only").default>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only").default>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder").default>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link").default>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
export const LazyVitePwaManifest: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest").default>
export const LazyNuxtPwaManifest: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest").default>
export const LazyNuxtPwaAssets: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/NuxtPwaAssets").default>
export const LazyPwaAppleImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaAppleImage").default>
export const LazyPwaAppleSplashScreenImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaAppleSplashScreenImage").default>
export const LazyPwaFaviconImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaFaviconImage").default>
export const LazyPwaMaskableImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaMaskableImage").default>
export const LazyPwaTransparentImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/nuxt4/PwaTransparentImage").default>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page").default>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").NoScript>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Link>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Base>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Title>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Meta>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Style>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Head>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Html>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Body>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island").default>

export const componentNames: string[]

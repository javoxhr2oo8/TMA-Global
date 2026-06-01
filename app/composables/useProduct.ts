// app/composables/useProduct.ts
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, getDoc, type Firestore } from 'firebase/firestore'
import { useStore } from '~/store/store'
import { findDemoProduct } from '~/utils/products'

const getFirestoreInstance = (): Firestore => {
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }
  const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)
  return getFirestore(app)
}

export const useProduct = () => {
  const product = ref<any | null>(null)
  const loading = ref(false)
  const store = useStore()

  const fetchProduct = async (id: string | number) => {
    loading.value = true
    store.loader = true
    try {
      const config = useRuntimeConfig()

      // Firebase sozlangan bo'lsa — Firestore'dan hujjatni olamiz
      if (config.public.firebaseProjectId) {
        const db = getFirestoreInstance()
        const snap = await getDoc(doc(db, 'products', String(id)))
        if (snap.exists()) {
          product.value = { id: snap.id, ...snap.data() }
          return
        }
      }

      // Firebase bo'sh yoki hujjat topilmasa — demo mahsulotga tushamiz
      product.value = findDemoProduct(id)
    } catch (e) {
      console.error('Product fetch error:', e)
      product.value = findDemoProduct(id)
    } finally {
      loading.value = false
      store.loader = false
    }
  }

  return { product, loading, fetchProduct }
}

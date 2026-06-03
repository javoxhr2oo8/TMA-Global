// app/composables/useProduct.ts
import { doc, getDoc } from 'firebase/firestore'
import { getDb } from '~/composables/useFirebase'
import { useStore } from '~/store/store'
import { findDemoProduct } from '~/utils/products'

export const useProduct = () => {
  const product = ref<any | null>(null)
  const loading = ref(false)
  const store = useStore()

  const fetchProduct = async (id: string | number) => {
    loading.value = true
    store.loader = true
    try {
      const db = getDb()
      const snap = await getDoc(doc(db, 'products', String(id)))

      if (snap.exists()) {
        product.value = { id: snap.id, ...snap.data() }
        console.log(`[Firestore] products/${id} olindi`)
      } else {
        // Firestore'da topilmasa — zaxira (demo). Xohlasangiz bu qatorni olib tashlang.
        console.warn(`[Firestore] products/${id} topilmadi, demo'ga tushildi`)
        product.value = findDemoProduct(id)
      }
    } catch (e) {
      console.error('[Firestore] mahsulotni o\'qishda xato:', e)
      product.value = findDemoProduct(id)
    } finally {
      loading.value = false
      store.loader = false
    }
  }

  return { product, loading, fetchProduct }
}

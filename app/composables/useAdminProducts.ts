// app/composables/useAdminProducts.ts
import {
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { getDb } from '~/composables/useFirebase'

// Firestore hujjati ~1 MB. Agar payload katta bo'lsa (masalan, ichida base64
// rasm qolib ketgan bo'lsa) — tushunarli xato beramiz, cryptic Firestore xatosi emas.
const MAX_DOC_BYTES = 900 * 1024

const assertNotTooLarge = (payload: Record<string, any>) => {
  const size = new Blob([JSON.stringify(payload)]).size
  if (size > MAX_DOC_BYTES) {
    throw new Error(
      `Mahsulot hajmi juda katta (~${Math.round(size / 1024)} KB). ` +
        "Rasmlar Firestore'ga URL sifatida saqlanishi kerak (base64 emas). " +
        "Firebase Storage yoqilganiga ishonch hosil qiling.",
    )
  }
}

const toNumber = (v: any) => (v === '' || v == null ? null : Number(v))

export const useAdminProducts = () => {
  const products = ref<any[]>([])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      const snap = await getDocs(collection(getDb(), 'products'))
      products.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (e) {
      console.error("[admin] o'qishda xato:", e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Record<string, any>) => {
    const payload: Record<string, any> = {
      ...data,
      price: toNumber(data.price) ?? 0,
      oldPrice: toNumber(data.oldPrice),
      randomIndex: Math.random(), // storefront tasodifiy tartibi uchun SHART
      createdAt: Date.now(),
    }
    assertNotTooLarge(payload)
    const created = await addDoc(collection(getDb(), 'products'), payload)
    await load()
    return created.id
  }

  const update = async (id: string, data: Record<string, any>) => {
    const payload: Record<string, any> = {
      ...data,
      price: toNumber(data.price) ?? 0,
      oldPrice: toNumber(data.oldPrice),
      updatedAt: Date.now(),
    }
    // Eski hujjatda randomIndex bo'lmasa — storefrontda ko'rinishi uchun beramiz
    if (payload.randomIndex == null) payload.randomIndex = Math.random()
    assertNotTooLarge(payload)
    await updateDoc(doc(getDb(), 'products', id), payload)
    await load()
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(getDb(), 'products', id))
    await load()
  }

  return { products, loading, load, create, update, remove }
}

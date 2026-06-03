// app/composables/useAdminProducts.ts
import {
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { getDb } from '~/composables/useFirebase'

export const useAdminProducts = () => {
  const products = ref<any[]>([])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      const snap = await getDocs(collection(getDb(), 'products'))
      products.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (e) {
      console.error('[admin] o\'qishda xato:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Record<string, any>) => {
    const payload = { ...data, randomIndex: Math.random(), createdAt: Date.now() }
    await addDoc(collection(getDb(), 'products'), payload)
    await load()
  }

  const update = async (id: string, data: Record<string, any>) => {
    await updateDoc(doc(getDb(), 'products', id), data)
    await load()
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(getDb(), 'products', id))
    await load()
  }

  return { products, loading, load, create, update, remove }
}

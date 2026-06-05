// app/composables/useAdminOrders.ts
// Admin uchun buyurtmalarni Firestore 'orders' kolleksiyasidan o'qiydi.
// Buyurtmalar mijoz checkout qilganda yoziladi (useOrder.placeOrder).
// firestore.rules: orders read/update/delete faqat admin (email/parol) uchun.

import {
  collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { getDb } from '~/composables/useFirebase'

export const useAdminOrders = () => {
  const orders = ref<any[]>([])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      let snap
      try {
        // Eng yangisi tepada
        snap = await getDocs(query(collection(getDb(), 'orders'), orderBy('createdAt', 'desc')))
      } catch {
        // createdAt bo'lmasa — tartibsiz olamiz
        snap = await getDocs(collection(getDb(), 'orders'))
      }
      orders.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (e) {
      console.error("[admin orders] o'qishda xato:", e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(getDb(), 'orders', id), { status })
    const o = orders.value.find((x) => x.id === id)
    if (o) o.status = status
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(getDb(), 'orders', id))
    orders.value = orders.value.filter((x) => x.id !== id)
  }

  return { orders, loading, load, updateStatus, remove }
}

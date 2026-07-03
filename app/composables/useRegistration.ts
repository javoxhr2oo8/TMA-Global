// app/composables/useRegistration.ts
// Foydalanuvchi ro'yxatdan o'tish formasi uchun Firebase CRUD

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { getDb } from './useFirebase'

export interface Registration {
  id: string
  firstName: string
  lastName: string
  phone: string
  address: string
  telegramUser?: {
    id?: number
    username?: string
    first_name?: string
    last_name?: string
  }
  createdAt: any
}

const COLLECTION = 'registrations'

export const useRegistration = () => {
  const registrations = ref<Registration[]>([])
  const loading = ref(false)

  /** Yangi ro'yxatdan o'tishni saqlash */
  const submit = async (data: {
    firstName: string
    lastName: string
    phone: string
    address: string
  }) => {
    const db = getDb()

    // Telegram user ma'lumotlarini olish
    let telegramUser: Registration['telegramUser'] = undefined
    if (import.meta.client && window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const u = window.Telegram.WebApp.initDataUnsafe.user
      telegramUser = {
        id: u.id,
        username: u.username,
        first_name: u.first_name,
        last_name: u.last_name,
      }
    }

    await addDoc(collection(db, COLLECTION), {
      ...data,
      telegramUser: telegramUser || null,
      createdAt: serverTimestamp(),
    })
  }

  /** Barcha ro'yxatlarni yuklash (Admin uchun) */
  const load = async () => {
    loading.value = true
    try {
      const db = getDb()
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      registrations.value = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Registration[]
    } finally {
      loading.value = false
    }
  }

  /** Ro'yxatni o'chirish (Admin uchun) */
  const remove = async (id: string) => {
    const db = getDb()
    await deleteDoc(doc(db, COLLECTION, id))
    registrations.value = registrations.value.filter((r) => r.id !== id)
  }

  /** Foydalanuvchi allaqachon ro'yxatdan o'tganmi? */
  const isRegistered = (): boolean => {
    if (!import.meta.client) return false
    return localStorage.getItem('tma_registered') === '1'
  }

  /** Ro'yxatdan o'tganligini belgilash */
  const markRegistered = () => {
    if (import.meta.client) {
      localStorage.setItem('tma_registered', '1')
    }
  }

  return {
    registrations,
    loading,
    submit,
    load,
    remove,
    isRegistered,
    markRegistered,
  }
}

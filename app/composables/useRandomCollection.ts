// app/composables/useRandomCollection.ts
// Real-time listener (onSnapshot) orqali ishlaydi —
// admin mahsulot qo'shsa/o'zgartirsa, Telegram appda darhol ko'rinadi.
//
// MUHIM: orderBy('createdAt') ISHLATILMAYDI!
// Sabab: Firestore'da orderBy qo'yilsa, faqat shu maydon MAVJUD bo'lgan
// hujjatlar qaytadi. createdAt yo'q mahsulotlar yashirinib qoladi.
// Buning o'rniga BARCHA mahsulotlarni olib, client-side tartiblаymiz.
import {
  collection,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Ref } from 'vue'
import { getDb } from '~/composables/useFirebase'

interface CollState {
  data: Ref<any[]>
  loading: Ref<boolean>
  hasMore: Ref<boolean>
  loaded: Ref<boolean>
  unsub: Unsubscribe | null
}

const caches = new Map<string, CollState>()

function getState(name: string): CollState {
  let s = caches.get(name)
  if (!s) {
    s = {
      data: ref<any[]>([]),
      loading: ref(false),
      hasMore: ref(false),
      loaded: ref(false),
      unsub: null,
    }
    caches.set(name, s)
  }
  return s
}

// Client-side tartiblash: yangi mahsulotlar birinchi, createdAt yo'qlar oxirida
function sortByNewest(items: any[]): any[] {
  return [...items].sort((a, b) => {
    const ta = a.createdAt ?? 0
    const tb = b.createdAt ?? 0
    return tb - ta
  })
}

export const useRandomCollection = (collectionName: string) => {
  const state = getState(collectionName)
  const { data, loading, hasMore, loaded } = state

  const fetchRandom = async () => {
    // Agar allaqachon real-time listener mavjud bo'lsa, qayta ulanish shart emas
    if (state.unsub) return

    // Birinchi yuklashda skeleton ko'rsatamiz
    if (!loaded.value) {
      loading.value = true
    }

    // orderBy/limit YO'Q — BARCHA mahsulotlarni olamiz
    // onSnapshot real-time tinglaydi: admin qo'shsa/o'chirsa darhol yangilanadi
    const colRef = collection(getDb(), collectionName)

    state.unsub = onSnapshot(
      colRef,
      (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        data.value = sortByNewest(all)
        hasMore.value = false
        loaded.value = true
        loading.value = false
        console.log(`[Firestore] ${collectionName}: ${all.length} ta mahsulot yuklandi`)
      },
      (err) => {
        console.error('[Firestore] onSnapshot xato:', err)
        if (!loaded.value) data.value = []
        loading.value = false
      },
    )
  }

  // loadMore endi kerak emas (barcha mahsulotlar bir yo'la yuklanadi),
  // lekin interfeysni buzmaslik uchun saqlab qo'yamiz
  const loadMore = async () => {}

  return { data, loading, hasMore, fetchRandom, loadMore }
}
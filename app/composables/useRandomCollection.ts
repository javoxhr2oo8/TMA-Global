// app/composables/useRandomCollection.ts
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  getDocsFromCache,
  type DocumentSnapshot,
} from 'firebase/firestore'
import type { Ref } from 'vue'
import { getDb } from '~/composables/useFirebase'

// Sahifalar orasida ULASHILADIGAN kesh (har bir kolleksiya uchun bitta holat).
// Shu sababli bosh sahifaga qayta kirilganda ro'yxat qaytadan so'ralmaydi —
// darhol ko'rinadi va fon rejimida yangilanadi.
interface CollState {
  data: Ref<any[]>
  loading: Ref<boolean>
  hasMore: Ref<boolean>
  lastDoc: Ref<DocumentSnapshot | null>
  loaded: Ref<boolean>
}

const caches = new Map<string, CollState>()
const pageSize = 10

function getState(name: string): CollState {
  let s = caches.get(name)
  if (!s) {
    s = {
      data: ref<any[]>([]),
      loading: ref(false),
      hasMore: ref(true),
      lastDoc: ref<DocumentSnapshot | null>(null),
      loaded: ref(false),
    }
    caches.set(name, s)
  }
  return s
}

export const useRandomCollection = (collectionName: string) => {
  const { data, loading, hasMore, lastDoc, loaded } = getState(collectionName)

  const fetchRandom = async () => {
    const baseQuery = query(
      collection(getDb(), collectionName),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
    )

    const hasMemory = loaded.value && data.value.length > 0

    // 1) Xotirada bo'lmasa — avval IndexedDB keshidan o'qiymiz (darhol ko'rsatish).
    if (!hasMemory) {
      try {
        const cached = await getDocsFromCache(baseQuery)
        if (!cached.empty) {
          data.value = cached.docs.map((d) => ({ id: d.id, ...d.data() }))
          lastDoc.value = cached.docs[cached.docs.length - 1] ?? null
          hasMore.value = cached.docs.length === pageSize
          loaded.value = true
        } else {
          loading.value = true // kesh bo'sh — skeleton ko'rsatamiz
        }
      } catch {
        loading.value = true // kesh yo'q/qo'llab-quvvatlanmaydi
      }
    }

    // 2) Serverdan yangilaymiz (revalidate) — kesh ko'rsatilgan bo'lsa fon rejimida.
    try {
      const snap = await getDocs(baseQuery)
      data.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      lastDoc.value = snap.docs[snap.docs.length - 1] ?? null
      hasMore.value = snap.docs.length === pageSize
      loaded.value = true
    } catch (e) {
      console.error('[Firestore] xato:', e)
      if (!loaded.value) data.value = []
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if (!lastDoc.value || loading.value) return
    loading.value = true
    try {
      const snap = await getDocs(
        query(
          collection(getDb(), collectionName),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc.value),
          limit(pageSize),
        ),
      )
      data.value = [...data.value, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))]
      lastDoc.value = snap.docs[snap.docs.length - 1] ?? null
      hasMore.value = snap.docs.length === pageSize
    } catch (e) {
      console.error('[Firestore] loadMore xato:', e)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, hasMore, fetchRandom, loadMore }
}

// app/composables/useRandomCollection.ts
import {
  collection, query, orderBy, startAfter, limit, getDocs, type DocumentSnapshot,
} from 'firebase/firestore'
import { getDb } from '~/composables/useFirebase'
import { useStore } from '~/store/store'

export const useRandomCollection = (collectionName: string) => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const hasMore = ref(true)
  const lastDoc = ref<DocumentSnapshot | null>(null)
  const pageSize = 10
  const store = useStore()

  const fetchRandom = async () => {
    loading.value = true
    store.loader = true
    try {
      const db = getDb()
      const snap = await getDocs(
        query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(pageSize))
      )
      data.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      lastDoc.value = snap.docs[snap.docs.length - 1] ?? null
      hasMore.value = snap.docs.length === pageSize
    } catch (e) {
      console.error('[Firestore] xato:', e)
      data.value = []
    } finally {
      loading.value = false
      store.loader = false
    }
  }

  const loadMore = async () => {
    if (!lastDoc.value || loading.value) return
    loading.value = true
    try {
      const db = getDb()
      const snap = await getDocs(
        query(
          collection(db, collectionName),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc.value),
          limit(pageSize)
        )
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
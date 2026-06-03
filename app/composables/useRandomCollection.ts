// app/composables/useRandomCollection.ts
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from 'firebase/firestore'
import { getDb } from '~/composables/useFirebase'
import { useStore } from '~/store/store'

export const useRandomCollection = (collectionName: string) => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const store = useStore()

  const fetchRandom = async (count = 20) => {
    loading.value = true
    store.loader = true
    try {
      const db = getDb()

      // 1) randomIndex bo'yicha tasodifiy nuqtadan boshlab o'qishga urinamiz
      const randomStart = Math.random()
      let snapshot = await getDocs(
        query(
          collection(db, collectionName),
          orderBy('randomIndex'),
          startAfter(randomStart),
          limit(count),
        ),
      )

      // 2) bo'sh bo'lsa — randomIndex bo'yicha boshidan
      if (snapshot.empty) {
        snapshot = await getDocs(
          query(collection(db, collectionName), orderBy('randomIndex'), limit(count)),
        )
      }

      // 3) HALI HAM bo'sh bo'lsa — demak hujjatlarda 'randomIndex' maydoni yo'q.
      //    Bu holda oddiy o'qishga tushamiz (tartibsiz, lekin ma'lumot keladi).
      if (snapshot.empty) {
        snapshot = await getDocs(query(collection(db, collectionName), limit(count)))
      }

      data.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      console.log(
        `[Firestore] '${collectionName}' kolleksiyasidan ${data.value.length} ta hujjat olindi`,
      )
    } catch (e) {
      console.error('[Firestore] o\'qishda xato:', e)
      data.value = []
    } finally {
      loading.value = false
      store.loader = false
    }
  }

  return { data, loading, fetchRandom }
}

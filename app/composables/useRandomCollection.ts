// composables/useRandomCollection.ts
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, query, orderBy, startAfter, limit, getDocs, Firestore } from 'firebase/firestore'
import { useStore } from '~/store/store'

const getFirestoreInstance = (): Firestore => {
  const config = useRuntimeConfig()


  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }

  const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)
  return getFirestore(app)
}

export const useRandomCollection = (collectionName: string) => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const store = useStore()
  const fetchRandom = async (count = 20) => {
    store.loader = true
    try {
      const firestore = getFirestoreInstance()
      const randomStart = Math.random()

      let q = query(
        collection(firestore, collectionName),
        orderBy('randomIndex'),
        startAfter(randomStart),
        limit(count)
      )

      let snapshot = await getDocs(q)

      if (snapshot.empty) {
        q = query(
          collection(firestore, collectionName),
          orderBy('randomIndex'),
          limit(count)
        )
        snapshot = await getDocs(q)
      }

      data.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

    } catch (e) {
      console.error('Firestore error:', e)
    } finally {
      store.loader = false
    }
  }

  return { data, loading, fetchRandom }
}
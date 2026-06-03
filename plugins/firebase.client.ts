// plugins/firebase.client.ts
import { getAuth } from 'firebase/auth'
import { getDb, getFirebaseApp } from '~/composables/useFirebase'

export default defineNuxtPlugin(() => {
  const app = getFirebaseApp()
  const firestore = getDb()
  const auth = getAuth(app)

  return {
    provide: {
      firebaseApp: app,
      firestore,
      auth,
    },
  }
})

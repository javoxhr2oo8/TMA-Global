// app/plugins/firebase.client.ts
// Nuxt 4'da plaginlar app/plugins/ ichida bo'lishi kerak — ildizdagi
// plugins/ papkasi O'QILMAYDI (srcDir = app/). Eski faylni o'chiring:
//   plugins/firebase.client.ts   ← buni o'chirib tashlang
//
// Composable'lar Firebase'ni o'zi init qiladi, shuning uchun bu plagin
// majburiy emas; faqat ilk yuklashda ulanishni tayyorlab qo'yadi.
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

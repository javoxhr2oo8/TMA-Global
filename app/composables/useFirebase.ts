// app/composables/useFirebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const DEMO_CONFIG = {
  apiKey: 'AIzaSyCMWOYBbQmbPz8PVY08_5MMF3p5O9L1nMQ',
  authDomain: 'king-avto-system.firebaseapp.com',
  projectId: 'king-avto-system',
  storageBucket: 'king-avto-system.firebasestorage.app',
  messagingSenderId: '107636324237',
  appId: '1:107636324237:web:47a096022647385f2b6fc4',
}

let warnedDemo = false

export const getFirebaseConfig = () => {
  const c = useRuntimeConfig().public
  const hasEnv = !!(c.firebaseApiKey && c.firebaseProjectId && c.firebaseAppId)

  if (!hasEnv && !warnedDemo && import.meta.client) {
    warnedDemo = true
    console.warn(
      "[Firebase] .env to'ldirilmagan — DEMO loyiha (king-avto-system) ishlatilyapti.\n" +
        "Qo'shgan mahsulotlaringiz SIZNING Firebase konsolingizda KO'RINMAYDI.\n" +
        "Tuzatish uchun .env ga NUXT_PUBLIC_FIREBASE_* qiymatlarini o'z loyihangizdan yozing.",
    )
  }

  console.log('[Firebase Config]', {
    apiKey: c.firebaseApiKey,
    projectId: c.firebaseProjectId,
    appId: c.firebaseAppId,
  })

  return {
    apiKey: c.firebaseApiKey || DEMO_CONFIG.apiKey,
    authDomain: c.firebaseAuthDomain || DEMO_CONFIG.authDomain,
    projectId: c.firebaseProjectId || DEMO_CONFIG.projectId,
    storageBucket: c.firebaseStorageBucket || DEMO_CONFIG.storageBucket,
    messagingSenderId: c.firebaseMessagingSenderId || DEMO_CONFIG.messagingSenderId,
    appId: c.firebaseAppId || DEMO_CONFIG.appId,
  }
}

export const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length) {
    const app = getApp()
    console.log('[Firebase] уже инициализирован:', app.options.projectId)
    return app
  }
  const config = getFirebaseConfig()
  console.log('[Firebase] инициализируется с:', config.projectId)
  return initializeApp(config)
}

export const getDb = (): Firestore => getFirestore(getFirebaseApp())

export const getStorageInstance = (): FirebaseStorage => getStorage(getFirebaseApp())
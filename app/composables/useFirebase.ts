// app/composables/useFirebase.ts
// Butun ilova uchun YAGONA Firebase manbasi.
//
// DIQQAT: Quyidagi konfiguratsiya — BOSHQA loyiha (king-avto-system).
// Bu shunchaki demo qulaylik uchun. Mahsulotlaringiz SIZNING Firebase
// konsolingizda ko'rinishi uchun .env (NUXT_PUBLIC_FIREBASE_*) ga
// O'ZINGIZNING loyihangiz qiymatlarini yozing. Aks holda ma'lumot demo
// loyihaga yoziladi yoki ruxsat berilmaydi — va konsolingiz bo'sh ko'rinadi.

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

  return {
    apiKey: c.firebaseApiKey || DEMO_CONFIG.apiKey,
    authDomain: c.firebaseAuthDomain || DEMO_CONFIG.authDomain,
    projectId: c.firebaseProjectId || DEMO_CONFIG.projectId,
    storageBucket: c.firebaseStorageBucket || DEMO_CONFIG.storageBucket,
    messagingSenderId: c.firebaseMessagingSenderId || DEMO_CONFIG.messagingSenderId,
    appId: c.firebaseAppId || DEMO_CONFIG.appId,
  }
}

export const getFirebaseApp = (): FirebaseApp =>
  getApps().length ? getApp() : initializeApp(getFirebaseConfig())

export const getDb = (): Firestore => getFirestore(getFirebaseApp())

export const getStorageInstance = (): FirebaseStorage => getStorage(getFirebaseApp())

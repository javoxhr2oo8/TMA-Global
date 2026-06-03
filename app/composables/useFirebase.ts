// app/composables/useFirebase.ts
// Butun ilova uchun YAGONA Firebase manbasi.
// .env (NUXT_PUBLIC_FIREBASE_*) to'ldirilgan bo'lsa o'shandan oladi,
// bo'lmasa quyidagi DEFAULT konfiguratsiyaga tushadi — shuning uchun
// .env bo'lmasa ham Firestore baribir ishlaydi.

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const DEFAULT_CONFIG = {
  apiKey: 'AIzaSyCMWOYBbQmbPz8PVY08_5MMF3p5O9L1nMQ',
  authDomain: 'king-avto-system.firebaseapp.com',
  projectId: 'king-avto-system',
  storageBucket: 'king-avto-system.firebasestorage.app',
  messagingSenderId: '107636324237',
  appId: '1:107636324237:web:47a096022647385f2b6fc4',
}

export const getFirebaseConfig = () => {
  const c = useRuntimeConfig().public
  return {
    apiKey: c.firebaseApiKey || DEFAULT_CONFIG.apiKey,
    authDomain: c.firebaseAuthDomain || DEFAULT_CONFIG.authDomain,
    projectId: c.firebaseProjectId || DEFAULT_CONFIG.projectId,
    storageBucket: c.firebaseStorageBucket || DEFAULT_CONFIG.storageBucket,
    messagingSenderId: c.firebaseMessagingSenderId || DEFAULT_CONFIG.messagingSenderId,
    appId: c.firebaseAppId || DEFAULT_CONFIG.appId,
  }
}

export const getFirebaseApp = (): FirebaseApp =>
  getApps().length ? getApp() : initializeApp(getFirebaseConfig())

export const getDb = (): Firestore => getFirestore(getFirebaseApp())

export const getStorageInstance = (): FirebaseStorage => getStorage(getFirebaseApp())

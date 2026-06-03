// app/composables/useAdminAuth.ts
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User,
} from 'firebase/auth'
import { getFirebaseApp } from '~/composables/useFirebase'

export const useAdminAuth = () => {
  // SSR o'chiq (ssr:false), shuning uchun faqat klientda ishlaydi
  const user = useState<User | null>('adminUser', () => null)
  const ready = useState<boolean>('adminAuthReady', () => false)

  const init = () => {
    const auth = getAuth(getFirebaseApp())
    onAuthStateChanged(auth, (u) => {
      user.value = u
      ready.value = true
    })
  }

  const login = async (email: string, password: string) => {
    const auth = getAuth(getFirebaseApp())
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(getAuth(getFirebaseApp()))
  }

  return { user, ready, init, login, logout }
}

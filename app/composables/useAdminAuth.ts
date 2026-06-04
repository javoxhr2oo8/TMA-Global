// app/composables/useAdminAuth.ts
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User,
} from 'firebase/auth'
import { getFirebaseApp } from '~/composables/useFirebase'

export const useAdminAuth = () => {
  const user = useState<User | null>('adminUser', () => null)
  const ready = useState<boolean>('adminAuthReady', () => false)

  const init = (onAuthed?: () => void) => {
    const auth = getAuth(getFirebaseApp())
    onAuthStateChanged(auth, (u) => {
      user.value = u
      ready.value = true
      if (u && onAuthed) onAuthed()
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
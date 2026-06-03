// app/composables/useImageUpload.ts
// Rasmni Firebase Storage'ga yuklaydi va yuklab olish (download) URL qaytaradi.
// Agar admin Firebase Auth bilan kirmagan bo'lsa (demo rejim) — Storage'ga
// yozib bo'lmaydi, shuning uchun lokal base64 (data URL) ga tushadi.
import { getAuth } from 'firebase/auth'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseApp, getStorageInstance } from '~/composables/useFirebase'

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(file)
  })

export const useImageUpload = () => {
  const uploading = ref(false)
  const progress = ref(0) // 0..nUploaded

  // Bitta faylni yuklaydi, URL qaytaradi
  const uploadOne = async (file: File): Promise<string> => {
    const user = getAuth(getFirebaseApp()).currentUser

    // Auth yo'q (demo) — Storage qoidalari yozishni taqiqlaydi, shuning uchun
    // base64'ga o'tamiz. Bu faqat demo ko'rinish uchun (Firestore'ga ketmaydi).
    if (!user) {
      return fileToDataUrl(file)
    }

    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const name = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const r = storageRef(getStorageInstance(), name)
      const snap = await uploadBytes(r, file, { contentType: file.type })
      return await getDownloadURL(snap.ref)
    } catch (e) {
      console.error('[Storage] yuklashda xato, base64 ga tushildi:', e)
      // Fallback — yuklash bo'lmasa hech bo'lmasa ko'rinsin
      return fileToDataUrl(file)
    }
  }

  // Bir nechta faylni ketma-ket yuklaydi
  const uploadMany = async (files: File[]): Promise<string[]> => {
    uploading.value = true
    progress.value = 0
    const urls: string[] = []
    try {
      for (const f of files) {
        const url = await uploadOne(f)
        urls.push(url)
        progress.value++
      }
      return urls
    } finally {
      uploading.value = false
    }
  }

  return { uploading, progress, uploadOne, uploadMany }
}

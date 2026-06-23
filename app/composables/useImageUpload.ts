

import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getStorageInstance } from '~/composables/useFirebase'

const SAFE_BASE64_BYTES = 700 * 1024

const compressImage = (file: File, maxSize = 1280, quality = 0.82): Promise<Blob> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error("Bu fayl rasm emas"))
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width >= height) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error("Canvas 2D context topilmadi"))
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Rasmni siqib bo'lmadi"))),
        'image/jpeg',
        quality,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Rasmni o'qib bo'lmadi"))
    }
    img.src = url
  })

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(blob)
  })

export const useImageUpload = () => {
  const uploading = ref(false)
  const progress = ref(0) // 0..100 — joriy fayl uchun
  const usedFallback = ref(false) // Storage ishlamay base64'ga tushilgani

  const uploadOne = async (file: File): Promise<string> => {
    const blob = await compressImage(file)

    try {
      const name = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
      const r = storageRef(getStorageInstance(), name)
      const task = uploadBytesResumable(r, blob, { contentType: 'image/jpeg' })

      await new Promise<void>((resolve, reject) => {
        task.on(
          'state_changed',
          (snap) => {
            progress.value = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          },
          reject,
          resolve,
        )
      })

      return await getDownloadURL(task.snapshot.ref)
    } catch (e: any) {
      console.error('[Storage] yuklashda xato:', e?.code || e?.message || e)

      if (blob.size <= SAFE_BASE64_BYTES) {
        usedFallback.value = true
        return blobToDataUrl(blob)
      }
      throw new Error(
        "Rasmni yuklab bo'lmadi. Firebase Storage yoqilmagan yoki Rules noto'g'ri " +
          "(Storage → Rules: products uchun auth bilan yozishga ruxsat bering). " +
          "Hozircha kichikroq rasm tanlang yoki Storage'ni yoqing.",
      )
    }
  }

  const uploadMany = async (files: File[]): Promise<string[]> => {
    uploading.value = true
    usedFallback.value = false
    const urls: string[] = []
    try {
      for (const f of files) {
        progress.value = 0
        urls.push(await uploadOne(f))
      }
      return urls
    } finally {
      uploading.value = false
      progress.value = 0
    }
  }

  return { uploading, progress, usedFallback, uploadOne, uploadMany }
}

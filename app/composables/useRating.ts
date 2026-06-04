// app/composables/useRating.ts
// Mijozlar mahsulotga baho beradi (yulduzcha bosib).
// - Mijoz Firebase'ga anonim (Anonymous auth) sifatida kiradi → request.auth bo'ladi.
// - Har bir foydalanuvchi bahosi `products/{pid}/ratings/{uid}` da saqlanadi (bittadan).
// - Mahsulot hujjatida `ratingSum`, `reviewCount`, `rating` (o'rtacha) transaction
//   orqali yangilanadi — shunda do'kon ro'yxati o'rtacha bahoni arzon o'qiydi.
//
// MUHIM: Firebase Console → Authentication → Sign-in method → "Anonymous" yoqilgan
// bo'lishi kerak, va firestore.rules yangilangan bo'lishi shart (ratings + reyting
// maydonlarini yangilashga ruxsat).

import { getAuth, signInAnonymously } from 'firebase/auth'
import { doc, getDoc, runTransaction } from 'firebase/firestore'
import { getFirebaseApp, getDb } from '~/composables/useFirebase'
import { useTelegram } from '~/composables/useTelegram'

export const useRating = () => {
  const { user } = useTelegram()
  const submitting = ref(false)

  const ensureAuth = async () => {
    const auth = getAuth(getFirebaseApp())
    if (!auth.currentUser) {
      await signInAnonymously(auth)
    }
    return auth.currentUser!
  }

  // Foydalanuvchining shu mahsulotga qo'ygan bahosini oladi (kirgan bo'lsa).
  // Kirmagan bo'lsa 0 qaytaradi (baho qo'yganda kiradi).
  const getMyRating = async (pid: string): Promise<number> => {
    const auth = getAuth(getFirebaseApp())
    const u = auth.currentUser
    if (!u) return 0
    try {
      const snap = await getDoc(doc(getDb(), 'products', pid, 'ratings', u.uid))
      return snap.exists() ? Number(snap.data().stars) || 0 : 0
    } catch {
      return 0
    }
  }

  // Baho qo'yadi / yangilaydi. Yangi o'rtacha va sonni qaytaradi.
  const submitRating = async (
    pid: string,
    stars: number,
  ): Promise<{ rating: number; reviewCount: number; myStars: number }> => {
    if (stars < 1 || stars > 5) throw new Error("Baho 1..5 bo'lishi kerak")
    submitting.value = true
    try {
      const u = await ensureAuth()
      const db = getDb()
      const productRef = doc(db, 'products', pid)
      const ratingRef = doc(db, 'products', pid, 'ratings', u.uid)

      const result = await runTransaction(db, async (tx) => {
        const prodSnap = await tx.get(productRef)
        const mySnap = await tx.get(ratingRef)
        const p: any = prodSnap.exists() ? prodSnap.data() : {}

        const prevCount = Number(p.reviewCount) || 0
        // ratingSum bo'lmasa, eski rating*reviewCount'dan tiklab olamiz
        const prevSum =
          p.ratingSum != null
            ? Number(p.ratingSum)
            : (Number(p.rating) || 0) * prevCount

        let newSum = prevSum
        let newCount = prevCount
        if (mySnap.exists()) {
          // mavjud bahoni yangilash — son o'zgarmaydi
          newSum = prevSum - (Number(mySnap.data().stars) || 0) + stars
        } else {
          newSum = prevSum + stars
          newCount = prevCount + 1
        }
        const avg = newCount ? Math.round((newSum / newCount) * 10) / 10 : 0

        // Foydalanuvchi bahosi — har doim saqlanadi (rules ruxsat beradi).
        tx.set(ratingRef, {
          stars,
          tgId: user?.id ?? null,
          updatedAt: Date.now(),
        })

        // O'rtacha/son — FAQAT mahsulot hujjati Firestore'da MAVJUD bo'lsa
        // yangilanadi. Demo mahsulotlarda (utils/products dan, Firestore'da yo'q)
        // tx.update "No document to update" xatosini berib butun tranzaksiyani
        // yiqitardi — shu sababli avval mavjudligini tekshiramiz.
        if (prodSnap.exists()) {
          tx.update(productRef, {
            ratingSum: newSum,
            reviewCount: newCount,
            rating: avg,
          })
        }
        return { rating: avg, reviewCount: newCount }
      })

      return { ...result, myStars: stars }
    } finally {
      submitting.value = false
    }
  }

  return { submitting, ensureAuth, getMyRating, submitRating }
}

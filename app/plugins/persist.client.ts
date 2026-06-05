// app/plugins/persist.client.ts
// Savat va sevimlilarni localStorage bilan sinxronlaydi (faqat brauzer/client).
// - Ishga tushganda localStorage'dan yuklaydi (hydrate)
// - O'zgarganda localStorage'ga yozadi
// localStorage ≈5MB — cookie'dan farqli o'laroq uzun rasm URL'lari ham sig'adi
// va Telegram webview'da ilova yopilib qayta ochilganda ham saqlanib qoladi.

export default defineNuxtPlugin(() => {
  const cart = useState<any[]>('cart', () => [])
  const favorites = useState<any[]>('favorites', () => [])

  const load = (key: string, target: { value: any[] }) => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) target.value = JSON.parse(raw)
    } catch {
      /* buzuq ma'lumot bo'lsa — e'tibor bermaymiz */
    }
  }
  load('cart', cart)
  load('favorites', favorites)

  const save = (key: string) => (v: any[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(v))
    } catch {
      /* localStorage to'lgan/o'chiq bo'lsa — jim o'tamiz */
    }
  }
  watch(cart, save('cart'), { deep: true })
  watch(favorites, save('favorites'), { deep: true })
})

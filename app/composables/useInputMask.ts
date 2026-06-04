// app/composables/useInputMask.ts
// Admin narx maydonlari uchun "Price Mask" va checkout telefon uchun "Phone Formatter".

export const useInputMask = () => {
  // NARX: faqat raqamlar, har 3 xona bo'sh joy bilan ajraladi → "1 250 000"
  const formatMoney = (v: any): string =>
    String(v ?? '')
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  // Formatlangan narxdan toza son → 1250000 | null
  const unformatMoney = (v: any): number | null => {
    const d = String(v ?? '').replace(/\D/g, '')
    return d ? Number(d) : null
  }

  // TELEFON: +998 XX XXX XX XX (O'zbekiston)
  const formatPhone = (v: any): string => {
    let d = String(v ?? '').replace(/\D/g, '')
    if (d.startsWith('998')) d = d.slice(3)
    d = d.slice(0, 9) // operator(2) + 7 raqam
    if (!d) return ''
    const g = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean)
    return '+998 ' + g.join(' ')
  }

  // Lokal raqamlar soni (to'liqligini tekshirish uchun) — to'liq = 9
  const phoneDigits = (v: any): string => {
    let d = String(v ?? '').replace(/\D/g, '')
    if (d.startsWith('998')) d = d.slice(3)
    return d.slice(0, 9)
  }

  return { formatMoney, unformatMoney, formatPhone, phoneDigits }
}

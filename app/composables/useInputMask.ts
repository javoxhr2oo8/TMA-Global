
export const useInputMask = () => {
  const formatMoney = (v: any): string =>
    String(v ?? '')
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  const unformatMoney = (v: any): number | null => {
    const d = String(v ?? '').replace(/\D/g, '')
    return d ? Number(d) : null
  }

  const formatPhone = (v: any): string => {
    let d = String(v ?? '').replace(/\D/g, '')
    if (d.startsWith('998')) d = d.slice(3)
    d = d.slice(0, 9) // operator(2) + 7 raqam
    if (!d) return ''
    const g = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean)
    return '+998 ' + g.join(' ')
  }

  const phoneDigits = (v: any): string => {
    let d = String(v ?? '').replace(/\D/g, '')
    if (d.startsWith('998')) d = d.slice(3)
    return d.slice(0, 9)
  }

  return { formatMoney, unformatMoney, formatPhone, phoneDigits }
}

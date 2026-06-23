
export default defineNuxtPlugin(() => {
  const cart = useState<any[]>('cart', () => [])
  const favorites = useState<any[]>('favorites', () => [])

  const load = (key: string, target: { value: any[] }) => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) target.value = JSON.parse(raw)
    } catch {
    }
  }
  load('cart', cart)
  load('favorites', favorites)

  const save = (key: string) => (v: any[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(v))
    } catch {
    }
  }
  watch(cart, save('cart'), { deep: true })
  watch(favorites, save('favorites'), { deep: true })
})

// app/composables/useFavorites.ts
// Sevimlilar (like) localStorage'da saqlanadi (app/plugins/persist.client.ts orqali).
// Foydalanuvchi o'zi olib tashlamaguncha saqlanib turadi (ilova yopilsa ham).

interface Product {
  id: number
  title: string
  price: number
  oldPrice?: number
  rating: number
  reviewCount: number
  image: string
  badge?: string
  isFavorite?: boolean
  isDeliveryFree?: boolean
  quantity?: number
}

export const useFavorites = () => {
  const items = useState<Product[]>('favorites', () => [])

  const isFavorite = (id: number) => items.value.some((i) => i.id === id)

  const addItem = (product: Product) => {
    if (!isFavorite(product.id)) items.value.push({ ...product })
  }

  const removeItem = (id: number) => {
    items.value = items.value.filter((i) => i.id !== id)
  }

  const toggleItem = (product: Product) => {
    if (isFavorite(product.id)) removeItem(product.id)
    else addItem(product)
  }

  const clear = () => {
    items.value = []
  }

  const totalItems = computed(() => items.value.length)
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + (i.price || 0), 0))

  return { items, isFavorite, addItem, removeItem, toggleItem, clear, totalItems, totalPrice }
}

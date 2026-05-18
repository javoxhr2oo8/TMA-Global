// app/composables/useCart.ts

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

interface CartItem extends Product {
  quantity: number
}

export const useCart = () => {
  const cookie = useCookie<CartItem[]>('cart', { default: () => [] })
  const items = useState<CartItem[]>('cart', () => cookie.value)

  watch(items, (val) => {
    cookie.value = val
  }, { deep: true })

  const addItem = (product: Product) => {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  const removeItem = (id: number) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    const index = items.value.findIndex(i => i.id === id)
    if (index === -1) return
    items.value[index] = { ...items.value[index], quantity } as CartItem
  }

  const clearCart = () => {
    items.value = []
  }

  const isInCart = (id: number) => {
    return items.value.some(i => i.id === id)
  }

  const totalItems = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const totalDiscount = computed(() =>
    items.value.reduce((sum, i) => sum + ((i.oldPrice ?? i.price) - i.price) * i.quantity, 0)
  )

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    totalItems,
    totalPrice,
    totalDiscount,
  }
}
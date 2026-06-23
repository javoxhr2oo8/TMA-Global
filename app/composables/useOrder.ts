// app/composables/useOrder.ts
import { useCart } from '~/composables/useCart'
import { useTelegram } from '~/composables/useTelegram'
import { getDb } from '~/composables/useFirebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export interface OrderCustomer {
  phone: string
  region: string
  address: string
  delivery: string
  payment: string
  comment?: string
}

export const useOrder = () => {
  const { items, totalItems, clearCart } = useCart()
  const { tg, user, initData, showAlert, hapticNotification } = useTelegram()

  const submitting = ref(false)
  const lastOrderId = ref('')

  const buildItems = () =>
    items.value.map((i) => ({
      id: i.id,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
    }))

  const notifyTelegram = async (customer: OrderCustomer) => {
    if (!tg || !initData) return
    try {
      await $fetch('/api/orders', {
        method: 'POST',
        body: { initData, items: buildItems(), customer },
      })
    } catch (e: any) {
      console.warn(
        '[Order] Telegram xabari yuborilmadi (bot sozlanmagan bo\'lishi mumkin):',
        e?.data?.statusMessage || e?.statusMessage || e?.message,
      )
    }
  }

  const placeOrder = async (customer: OrderCustomer): Promise<boolean> => {
    if (!items.value.length || submitting.value) return false
    submitting.value = true

    try {
      const orderItems = buildItems()
      const total = orderItems.reduce(
        (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1),
        0,
      )
      const orderId = 'ORD-' + Date.now().toString().slice(-8)

      const db = getDb()
      await setDoc(doc(db, 'orders', orderId), {
        orderId,
        items: orderItems,
        total,
        totalItems: totalItems.value,
        customer: {
          phone: customer.phone || '',
          region: customer.region || '',
          address: customer.address || '',
          delivery: customer.delivery || '',
          payment: customer.payment || '',
          comment: customer.comment || '',
        },
        user:
          tg && user
            ? {
                id: user.id,
                first_name: user.first_name ?? '',
                last_name: user.last_name ?? '',
                username: user.username ?? '',
              }
            : null,
        status: 'new',
        createdAt: serverTimestamp(),
      })

      await notifyTelegram(customer)

      hapticNotification('success')
      lastOrderId.value = orderId
      clearCart()
      return true
    } catch (e: any) {
      console.error('Order error:', e?.code, e?.message, e)
      hapticNotification('error')
      const msg =
        e?.code === 'permission-denied'
          ? "Ruxsat yo'q — Firestore rules'da 'orders' uchun create ruxsatini bering va Publish qiling."
          : 'Buyurtma yuborishda xatolik.'
      showAlert(`${msg} Iltimos, qayta urinib ko'ring.`)
      return false
    } finally {
      submitting.value = false
    }
  }

  return { placeOrder, submitting, buildItems, lastOrderId }
}

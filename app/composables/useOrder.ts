// app/composables/useOrder.ts
import { useCart } from '~/composables/useCart'
import { useTelegram } from '~/composables/useTelegram'

export interface OrderCustomer {
  phone: string
  region: string
  address: string
  delivery: string
  payment: string
  comment?: string
}

export const useOrder = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { tg, initData, showAlert, hapticNotification } = useTelegram()

  const submitting = ref(false)

  const buildItems = () =>
    items.value.map((i) => ({
      id: i.id,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
    }))

  // Mijoz ma'lumoti bilan buyurtma yuboradi. Muvaffaqiyatda true qaytaradi.
  const placeOrder = async (customer: OrderCustomer): Promise<boolean> => {
    if (!items.value.length || submitting.value) return false
    submitting.value = true

    try {
      // Telegram ichida — backend orqali. Server initData'ni tekshiradi,
      // summani qayta hisoblaydi va admin'ga + mijozga xabar yuboradi.
      if (tg && initData) {
        const res = await $fetch<{ ok: boolean; orderId: string; total: number }>(
          '/api/orders',
          {
            method: 'POST',
            body: { initData, items: buildItems(), customer },
          },
        )

        hapticNotification('success')
        showAlert(`Buyurtmangiz qabul qilindi!\nRaqam: #${res.orderId}`)
        clearCart()
        await navigateTo('/')
        return true
      }

      // Telegramdan tashqarida (brauzerda test) — server tekshiruvi ishlamaydi
      console.log('ORDER (dev):', {
        items: buildItems(),
        customer,
        totalItems: totalItems.value,
        totalPrice: totalPrice.value,
      })
      hapticNotification('success')
      showAlert('Buyurtmangiz qabul qilindi! (test rejimi)')
      clearCart()
      await navigateTo('/')
      return true
    } catch (e: any) {
      console.error('Order error:', e)
      hapticNotification('error')
      const msg = e?.data?.statusMessage || e?.statusMessage || 'Buyurtma yuborishda xatolik.'
      showAlert(`${msg} Iltimos, qayta urinib ko'ring.`)
      return false
    } finally {
      submitting.value = false
    }
  }

  return { placeOrder, submitting, buildItems }
}

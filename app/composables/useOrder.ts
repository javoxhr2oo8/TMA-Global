// app/composables/useOrder.ts
import { useCart } from '~/composables/useCart'
import { useTelegram } from '~/composables/useTelegram'

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

  const placeOrder = async (): Promise<void> => {
    if (!items.value.length || submitting.value) return
    submitting.value = true

    try {
      // Telegram ichida — buyurtmani backend orqali yuboramiz.
      // Server initData'ni tekshiradi, summani qayta hisoblaydi va
      // admin'ga + mijozga xabar yuboradi.
      if (tg && initData) {
        const res = await $fetch<{ ok: boolean; orderId: string; total: number }>(
          '/api/orders',
          {
            method: 'POST',
            body: { initData, items: buildItems() },
          },
        )

        hapticNotification('success')
        showAlert(`Buyurtmangiz qabul qilindi!\nRaqam: #${res.orderId}`)
        clearCart()
        return
      }

      // Telegramdan tashqarida (brauzerda test) — server tekshiruvi ishlamaydi,
      // shuning uchun shunchaki muvaffaqiyatni ko'rsatamiz.
      console.log('ORDER (dev):', { items: buildItems(), totalItems: totalItems.value, totalPrice: totalPrice.value })
      hapticNotification('success')
      showAlert("Buyurtmangiz qabul qilindi! (test rejimi)")
      clearCart()
    } catch (e: any) {
      console.error('Order error:', e)
      hapticNotification('error')
      const msg = e?.data?.statusMessage || e?.statusMessage || "Buyurtma yuborishda xatolik."
      showAlert(`${msg} Iltimos, qayta urinib ko'ring.`)
    } finally {
      submitting.value = false
    }
  }

  return { placeOrder, submitting, buildItems }
}

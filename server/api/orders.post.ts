// server/api/orders.post.ts
import { verifyTelegramInitData, type TelegramUser } from '../utils/verifyTelegram'

interface IncomingItem {
  id: number | string
  title: string
  price: number
  quantity: number
}

interface IncomingCustomer {
  phone?: string
  region?: string
  address?: string
  delivery?: string
  payment?: string
  comment?: string
}

function formatSum(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// parse_mode: 'HTML' uchun foydalanuvchi matnini xavfsizlash
function esc(s: any): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function sendTelegramMessage(token: string, chatId: number | string, text: string) {
  return $fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    body: { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true },
  })
}

// Ixtiyoriy: service account bo'lsa Firestore'ga saqlaymiz
async function saveOrderToFirestore(serviceAccountJson: string, order: any) {
  if (!serviceAccountJson) return
  const mod: any = await import('firebase-admin')
  const admin = mod.default ?? mod
  if (!admin.apps?.length) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
    })
  }
  const db = admin.firestore()
  await db
    .collection('orders')
    .doc(order.orderId)
    .set({
      ...order,
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const botToken = config.botToken as string
  const adminChatId = config.adminChatId as string
  const serviceAccount = config.firebaseServiceAccount as string

  const body = await readBody<{
    initData?: string
    items?: IncomingItem[]
    customer?: IncomingCustomer
  }>(event)
  const initData = body?.initData ?? ''
  const items = Array.isArray(body?.items) ? body!.items! : []
  const c = body?.customer ?? {}

  if (!items.length) {
    throw createError({ statusCode: 400, statusMessage: "Savat bo'sh" })
  }
  if (!botToken) {
    throw createError({ statusCode: 500, statusMessage: 'Bot token sozlanmagan (NUXT_BOT_TOKEN)' })
  }
  if (!c.phone || !String(c.phone).trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Telefon raqam kiritilmagan' })
  }

  // 1) Telegram foydalanuvchisini tekshiramiz
  const { ok, user } = verifyTelegramInitData(initData, botToken)
  if (!ok || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Telegram tekshiruvi muvaffaqiyatsiz' })
  }
  const u = user as TelegramUser

  // 2) Summani SERVERDA qayta hisoblaymiz (klient yuborgan summaga ishonmaymiz)
  const safeItems = items.map((i) => ({
    id: i.id,
    title: String(i.title ?? ''),
    price: Number(i.price) || 0,
    quantity: Math.max(1, Number(i.quantity) || 1),
  }))
  const total = safeItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const orderId = 'ORD-' + Date.now().toString().slice(-8)

  // 3) Admin'ga xabar
  const itemLines = safeItems.map(
    (i, idx) =>
      `${idx + 1}. ${esc(i.title)} — ${i.quantity} x ${formatSum(i.price)} = <b>${formatSum(
        i.price * i.quantity,
      )}</b>`,
  )
  const fullName = `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
  const username = u.username ? ` (@${u.username})` : ''

  const addressLine = [c.region, c.address].filter((x) => x && String(x).trim()).map(esc).join(', ')

  const adminText = [
    `🆕 <b>Yangi buyurtma</b> #${orderId}`,
    ``,
    `👤 ${esc(fullName)}${username}`,
    `🆔 <code>${u.id}</code>`,
    `📞 ${esc(c.phone)}`,
    ...(addressLine ? [`📍 ${addressLine}`] : []),
    ...(c.delivery ? [`🚚 ${esc(c.delivery)}`] : []),
    `💳 ${esc(c.payment || 'Naqd')} (yetkazishda to'lov)`,
    ...(c.comment && String(c.comment).trim() ? [`📝 ${esc(c.comment)}`] : []),
    ``,
    ...itemLines,
    ``,
    `💰 <b>Jami: ${formatSum(total)} so'm</b>`,
  ].join('\n')

  try {
    if (adminChatId) {
      await sendTelegramMessage(botToken, adminChatId, adminText)
    }
    // 4) Mijozga tasdiq (xato bo'lsa ham buyurtmani buzmaydi)
    await sendTelegramMessage(
      botToken,
      u.id,
      `✅ Buyurtmangiz qabul qilindi!\nRaqam: <b>#${orderId}</b>\nJami: <b>${formatSum(
        total,
      )} so'm</b>\nTo'lov: yetkazishda (${esc(c.payment || 'Naqd')})\n\nTez orada siz bilan bog'lanamiz.`,
    ).catch(() => {})
  } catch (e: any) {
    console.error('Telegram sendMessage error:', e?.message)
    throw createError({ statusCode: 502, statusMessage: 'Buyurtmani yuborib bolmadi' })
  }

  // 5) Ixtiyoriy: Firestore'ga saqlash (service account sozlangan bo'lsa)
  await saveOrderToFirestore(serviceAccount, {
    orderId,
    user: { id: u.id, first_name: u.first_name, last_name: u.last_name, username: u.username },
    customer: {
      phone: c.phone ?? '',
      region: c.region ?? '',
      address: c.address ?? '',
      delivery: c.delivery ?? '',
      payment: c.payment ?? '',
      comment: c.comment ?? '',
    },
    items: safeItems,
    total,
  }).catch((e) => console.error("Firestore saqlash o'tkazib yuborildi:", e?.message))

  return { ok: true, orderId, total }
})

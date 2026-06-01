// server/utils/verifyTelegram.ts
import crypto from 'node:crypto'

export interface TelegramUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface VerifyResult {
  ok: boolean
  user?: TelegramUser
  reason?: string
}

/**
 * Telegram Mini App'dan kelgan initData'ni bot token bilan tekshiradi.
 * Algoritm: Telegram rasmiy hujjatidagi HMAC-SHA256 usuli.
 *   secret_key = HMAC_SHA256("WebAppData", bot_token)
 *   hash       = HMAC_SHA256(secret_key, data_check_string)
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSec = 86400,
): VerifyResult {
  if (!initData || !botToken) return { ok: false, reason: 'no_data' }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return { ok: false, reason: 'no_hash' }

  // hash va signature data_check_string'ga kirmaydi
  params.delete('hash')
  params.delete('signature')

  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n')

  const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
  const computed = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex')

  // doimiy vaqtli taqqoslash
  const a = Buffer.from(computed, 'hex')
  const b = Buffer.from(hash, 'hex')
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: 'bad_hash' }
  }

  // auth_date eskirmaganini tekshiramiz
  const authDate = Number(params.get('auth_date') || 0)
  if (maxAgeSec && authDate && Date.now() / 1000 - authDate > maxAgeSec) {
    return { ok: false, reason: 'expired' }
  }

  const userRaw = params.get('user')
  let user: TelegramUser | undefined
  try {
    user = userRaw ? (JSON.parse(userRaw) as TelegramUser) : undefined
  } catch {
    return { ok: false, reason: 'bad_user' }
  }

  return { ok: true, user }
}

// app/composables/useToast.ts
// Global toast/sonner tizimi — alert() o'rniga

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

let nextId = 0
const toasts = ref<ToastItem[]>([])

export const useToast = () => {
  const add = (message: string, type: ToastItem['type'] = 'info', duration = 3000) => {
    const id = ++nextId
    toasts.value.push({ id, message, type, duration })

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)

    return id
  }

  const success = (msg: string, ms?: number) => add(msg, 'success', ms)
  const error = (msg: string, ms?: number) => add(msg, 'error', ms ?? 4000)
  const warning = (msg: string, ms?: number) => add(msg, 'warning', ms)
  const info = (msg: string, ms?: number) => add(msg, 'info', ms)

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, add, success, error, warning, info, dismiss }
}

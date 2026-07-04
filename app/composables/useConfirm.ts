// app/composables/useConfirm.ts
// Browser confirm() o'rniga chiroyli modal

interface ConfirmState {
  show: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  danger: boolean
  resolve: ((val: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  show: false,
  title: '',
  message: '',
  confirmText: 'Ha, o\'chirish',
  cancelText: 'Bekor qilish',
  danger: true,
  resolve: null,
})

export const useConfirm = () => {
  const confirm = (opts: {
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      state.title = opts.title ?? 'Tasdiqlash'
      state.message = opts.message
      state.confirmText = opts.confirmText ?? 'Ha, o\'chirish'
      state.cancelText = opts.cancelText ?? 'Bekor qilish'
      state.danger = opts.danger !== false
      state.resolve = resolve
      state.show = true
    })
  }

  const accept = () => {
    state.show = false
    state.resolve?.(true)
    state.resolve = null
  }

  const cancel = () => {
    state.show = false
    state.resolve?.(false)
    state.resolve = null
  }

  return {
    state,
    confirm,
    accept,
    cancel,
  }
}

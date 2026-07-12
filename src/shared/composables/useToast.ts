import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type: ToastType
  duration?: number
}

const toasts = ref<ToastMessage[]>([])

export const useToast = () => {
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = toast.duration || 3000
    
    toasts.value.push({
      id,
      ...toast,
      duration
    })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    addToast,
    removeToast,
    success: (title: string, message?: string) => addToast({ title, message, type: 'success' }),
    error: (title: string, message?: string) => addToast({ title, message, type: 'error' }),
    warning: (title: string, message?: string) => addToast({ title, message, type: 'warning' }),
    info: (title: string, message?: string) => addToast({ title, message, type: 'info' })
  }
}

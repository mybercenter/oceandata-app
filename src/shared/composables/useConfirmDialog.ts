import { ref } from 'vue'

export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => Promise<void> | void
}

const isOpen = ref(false)
const options = ref<ConfirmDialogOptions | null>(null)
const isLoading = ref(false)

export const useConfirmDialog = () => {
  const confirm = (opts: ConfirmDialogOptions) => {
    options.value = {
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      type: 'danger',
      ...opts
    }
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    setTimeout(() => {
      options.value = null
      isLoading.value = false
    }, 300)
  }

  const handleConfirm = async () => {
    if (!options.value) return
    isLoading.value = true
    try {
      await options.value.onConfirm()
    } finally {
      close()
    }
  }

  return {
    isOpen,
    options,
    isLoading,
    confirm,
    close,
    handleConfirm
  }
}

import { ref } from 'vue'
import { mockSettings } from '../mock/settings.mock'
import { useToast } from '@/shared/composables/useToast'

export const useSettings = () => {
  const toast = useToast()
  
  // Clone the mock to make it reactive and independent
  const settings = ref(JSON.parse(JSON.stringify(mockSettings)))
  const isSaving = ref(false)

  const saveSettings = async (category: string) => {
    isSaving.value = true
    try {
      // simulate network request
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Settings Saved', category + ' settings have been updated successfully.')
    } finally {
      isSaving.value = false
    }
  }

  const resetSettings = (category: keyof typeof mockSettings) => {
    settings.value[category] = JSON.parse(JSON.stringify(mockSettings[category]))
    toast.info('Settings Reset', category + ' settings have been reverted.')
  }

  return {
    settings,
    isSaving,
    saveSettings,
    resetSettings
  }
}

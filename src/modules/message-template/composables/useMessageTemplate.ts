import { storeToRefs } from 'pinia'
import { useMessageTemplateStore } from '@/stores/message-template.store'

export const useMessageTemplate = () => {
  const store = useMessageTemplateStore()
  const { items: messageTemplates, loading: isLoading, submitting: isSubmitting, pagination, filters, sort } = storeToRefs(store)

  return {
    templates: messageTemplates,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchTemplates: store.fetchItems,
    createTemplate: store.create,
    updateTemplate: store.update,
    deleteTemplate: store.delete,
    deleteSelected: async (ids: string[]) => {
      let success = true
      for (const id of ids) {
        const res = await store.delete(id)
        if (!res) success = false
      }
      return success
    }
  }
}

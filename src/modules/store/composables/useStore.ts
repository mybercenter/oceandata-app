import { storeToRefs } from 'pinia'
import { useStoreStore } from '@/stores/store.store'

export const useStore = () => {
  const storeStore = useStoreStore()
  const { items: stores, loading: isLoading, submitting: isSubmitting, pagination, filters, sort } = storeToRefs(storeStore)

  return {
    stores,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchStores: storeStore.fetchItems,
    createStore: storeStore.create,
    updateStore: storeStore.update,
    deleteStore: storeStore.delete,
    deleteSelected: async (ids: string[]) => {
      let success = true
      for (const id of ids) {
        const res = await storeStore.delete(id)
        if (!res) success = false
      }
      return success
    }
  }
}

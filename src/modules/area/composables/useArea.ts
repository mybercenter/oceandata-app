import { storeToRefs } from 'pinia'
import { useAreaStore } from '@/stores/area.store'

export const useArea = () => {
  const store = useAreaStore()
  const { items: areas, loading: isLoading, submitting: isSubmitting, pagination, filters, sort } = storeToRefs(store)

  return {
    areas,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchAreas: store.fetchItems,
    createArea: store.create,
    updateArea: store.update,
    deleteArea: store.delete,
    deleteSelected: async (ids: string[]) => {
      // Basic bulk delete via loops since no bulk endpoint exists
      let success = true
      for (const id of ids) {
        const res = await store.delete(id)
        if (!res) success = false
      }
      return success
    }
  }
}


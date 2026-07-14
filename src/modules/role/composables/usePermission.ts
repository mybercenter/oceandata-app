import { storeToRefs } from 'pinia'
import { usePermissionStore } from '@/stores/permission.store'

export const usePermission = () => {
  const store = usePermissionStore()
  const { items: permissions, loading: isLoading, submitting: isSubmitting, pagination, filters, sort } = storeToRefs(store)

  return {
    permissions,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchPermissions: store.fetchItems,
    createPermission: store.create,
    updatePermission: store.update,
    deletePermission: store.delete,
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

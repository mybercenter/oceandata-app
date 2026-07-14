import { storeToRefs } from 'pinia'
import { useRoleStore } from '@/stores/role.store'

export const useRole = () => {
  const store = useRoleStore()
  const { items: roles, loading: isLoading, submitting: isSubmitting, pagination, filters, sort } = storeToRefs(store)

  return {
    roles,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchRoles: store.fetchItems,
    createRole: store.create,
    updateRole: store.update,
    deleteRole: store.delete,
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

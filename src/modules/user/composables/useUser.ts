import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store'

export const useUser = () => {
  const store = useUserStore()
  const { items: users, loading: isLoading, submitting: isSubmitting, pagination, filters, sort } = storeToRefs(store)

  return {
    users,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchUsers: store.fetchItems,
    createUser: store.create,
    updateUser: store.update,
    deleteUser: store.delete,
    resetPassword: store.resetPassword,
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

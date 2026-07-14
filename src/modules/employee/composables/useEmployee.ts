import { storeToRefs } from 'pinia'
import { useEmployeeStore } from '@/stores/employee.store'

export const useEmployee = () => {
  const store = useEmployeeStore()
  const { items: employees, loading: isLoading, submitting: isSubmitting, pagination, filters, sort } = storeToRefs(store)

  return {
    employees,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchEmployees: store.fetchItems,
    createEmployee: store.create,
    updateEmployee: store.update,
    deleteEmployee: store.delete,
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

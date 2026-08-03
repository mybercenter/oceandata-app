import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer.store'
import { customerService } from '../services/customer.service'
import { useToast } from '@/shared/composables/useToast'

export const useCustomer = () => {
  const store = useCustomerStore()
  const {
    customers,
    customer,
    loading: isLoading,
    submitting: isSubmitting,
    pagination,
    filters,
    sort,
    statistics
  } = storeToRefs(store)

  const toast = useToast()

  const fetchCustomers = async () => {
    await store.fetchCustomers()
  }

  // CRM Metrics Computed Properties based on backend statistics
  // These statistics are calculated from all customer data, not just the current page
  const metrics = computed(() => {
    const stats = statistics.value
    return {
      total: stats.total || pagination.value.total || customers.value.length,
      inquiry: stats.inquiry || 0,
      purchased: stats.purchased || 0,
      potential: stats.potential || 0,
      prospect: stats.prospect || 0,
      hotProspect: stats.hot_prospect || 0,
      today: stats.today || 0,
      thisMonth: stats.this_month || 0
    }
  })

  const getCustomerHistory = async (id: string | number) => {
    return await customerService.getHistory(id)
  }

  const createCustomer = async (data: any, createAnother = false) => {
    return await store.createCustomer(data)
  }

  const updateCustomer = async (id: string | number, data: any) => {
    return await store.updateCustomer(id, data)
  }

  const deleteCustomer = async (id: string | number) => {
    return await store.deleteCustomer(id)
  }

  const deleteSelected = async (ids: (string|number)[]) => {
    try {
      store.submitting = true
      // Naive implementation for bulk delete, as there is no bulk endpoint yet
      for (const id of ids) {
        await customerService.destroy(id)
      }
      toast.success('Success', 'Selected customers deleted')
      await fetchCustomers()
      return true
    } catch (e: any) {
      toast.error('Error', 'Failed to delete some customers')
      return false
    } finally {
      store.submitting = false
    }
  }
  
  const updateStatus = async (id: string | number) => {
    return await store.updateStatus(id)
  }
  
  const updateConversion = async (id: string | number, conversion: string) => {
    return await store.updateConversion(id, conversion)
  }

  const exportCustomers = async () => {
    return await store.exportCustomers()
  }

  return {
    customers,
    customer,
    metrics,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchCustomers,
    getCustomerHistory,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    deleteSelected,
    updateStatus,
    updateConversion,
    exportCustomers
  }
}

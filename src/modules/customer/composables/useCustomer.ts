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
    sort 
  } = storeToRefs(store)

  const toast = useToast()

  const fetchCustomers = async () => {
    await store.fetchCustomers()
  }

  // CRM Metrics Computed Properties based on currently loaded unfiltered customers (Wait, if we use server-side pagination, the metrics won't be accurate for ALL customers unless the backend provides an aggregate API). 
  // For now, we will compute metrics based on the loaded page, or if it requires global metrics, backend integration is needed. 
  // Let's provide a basic computation so the component doesn't break, but ideally we'd fetch stats from a backend endpoint in the future.
  const metrics = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    const thisMonthPrefix = today.substring(0, 7) // YYYY-MM
    
    return {
      total: pagination.value.total || customers.value.length,
      inquiry: customers.value.filter(c => c.customer_status === 'Inquiry').length,
      purchased: customers.value.filter(c => c.customer_status === 'Purchased').length,
      potential: customers.value.filter(c => c.current_conversion === 'Potential').length,
      prospect: customers.value.filter(c => c.current_conversion === 'Prospect').length,
      hotProspect: customers.value.filter(c => c.current_conversion === 'Hot Prospect').length,
      today: customers.value.filter(c => c.customer_date === today).length,
      thisMonth: customers.value.filter(c => (c.customer_date || '').startsWith(thisMonthPrefix)).length
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
    updateConversion
  }
}

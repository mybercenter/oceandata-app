import { ref, computed } from 'vue'
import type { Customer, FollowUpHistory } from '../types/customer.types'
import { customerService } from '../services/customer.service'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination, TableFilters } from '@/shared/components/table/table.types'

export interface CustomerFilters extends TableFilters {
  areaId?: string
  storeId?: string
  employeeId?: string
  customerStatus?: string
  currentConversion?: string
  dateRange?: { start: string, end: string }
}

export const useCustomer = () => {
  const customers = ref<Customer[]>([])
  const allCustomers = ref<Customer[]>([]) // For metrics
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  
  const filters = ref<CustomerFilters>({
    search: '',
    areaId: '',
    storeId: '',
    employeeId: '',
    customerStatus: '',
    currentConversion: ''
  })

  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })
  
  const sort = ref({ key: 'customerDate', order: 'desc' })
  const toast = useToast()

  const fetchCustomers = async () => {
    isLoading.value = true
    try {
      const all = await customerService.getCustomers()
      allCustomers.value = all // Keep raw copy for global metrics if needed
      
      let result = all.filter(c => {
        const searchTerms = filters.value.search.toLowerCase()
        const matchSearch = c.fullName.toLowerCase().includes(searchTerms) || 
                            (c.phone || '').includes(searchTerms) || 
                            (c.product || '').toLowerCase().includes(searchTerms)
        
        const matchEmployee = filters.value.employeeId ? c.employeeId === filters.value.employeeId : true
        const matchStore = filters.value.storeId ? c.employee?.storeId === filters.value.storeId : true
        
        // Match Area through Employee -> Store -> Area
        const matchArea = filters.value.areaId ? c.employee?.areas?.some(a => a.id === filters.value.areaId) : true
        
        const matchStatus = filters.value.customerStatus ? c.customerStatus === filters.value.customerStatus : true
        const matchConversion = filters.value.currentConversion ? c.currentConversion === filters.value.currentConversion : true
        
        return matchSearch && matchEmployee && matchStore && matchArea && matchStatus && matchConversion
      })

      if (sort.value.key) {
        result.sort((a, b) => {
          let valA: any = (a as any)[sort.value.key]
          let valB: any = (b as any)[sort.value.key]
          
          if (sort.value.key === 'employee') {
            valA = a.employee?.fullName || ''
            valB = b.employee?.fullName || ''
          }
          if (sort.value.key === 'store') {
            valA = a.employee?.store?.name || ''
            valB = b.employee?.store?.name || ''
          }
          
          if (valA < valB) return sort.value.order === 'asc' ? -1 : 1
          if (valA > valB) return sort.value.order === 'asc' ? 1 : -1
          return 0
        })
      }

      pagination.value.total = result.length
      const start = (pagination.value.page - 1) * pagination.value.limit
      const end = start + pagination.value.limit
      customers.value = result.slice(start, end)
      
    } catch (error: any) {
      toast.error('Failed to load customers', error.message)
    } finally {
      isLoading.value = false
    }
  }

  // CRM Metrics Computed Properties based on currently loaded unfiltered customers
  const metrics = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    const thisMonthPrefix = today.substring(0, 7) // YYYY-MM
    
    return {
      total: allCustomers.value.length,
      inquiry: allCustomers.value.filter(c => c.customerStatus === 'Inquiry').length,
      purchased: allCustomers.value.filter(c => c.customerStatus === 'Purchased').length,
      potential: allCustomers.value.filter(c => c.currentConversion === 'Potential').length,
      prospect: allCustomers.value.filter(c => c.currentConversion === 'Prospect').length,
      hotProspect: allCustomers.value.filter(c => c.currentConversion === 'Hot Prospect').length,
      today: allCustomers.value.filter(c => c.customerDate === today).length,
      thisMonth: allCustomers.value.filter(c => c.customerDate.startsWith(thisMonthPrefix)).length
    }
  })

  const getCustomerHistory = async (id: string) => {
    return await customerService.getCustomerHistory(id)
  }

  const createCustomer = async (data: any, createAnother = false) => {
    isSubmitting.value = true
    try {
      await customerService.createCustomer(data)
      toast.success('Customer Created', 'Customer data has been saved.')
      await fetchCustomers()
      return true
    } catch (error: any) {
      toast.error('Creation Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateCustomer = async (id: string, data: any) => {
    isSubmitting.value = true
    try {
      await customerService.updateCustomer(id, data)
      toast.success('Customer Updated', 'Customer data has been successfully updated.')
      await fetchCustomers()
      return true
    } catch (error: any) {
      toast.error('Update Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      await customerService.deleteCustomer(id)
      toast.success('Customer Deleted', 'Customer has been removed.')
      await fetchCustomers()
      return true
    } catch (error: any) {
      toast.error('Deletion Failed', error.message)
      return false
    }
  }

  const deleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await customerService.deleteCustomer(id)
      }
      toast.success('Customers Deleted', ids.length + ' customers removed.')
      if (customers.value.length === ids.length && pagination.value.page > 1) {
        pagination.value.page -= 1
      }
      await fetchCustomers()
      return true
    } catch (error: any) {
      toast.error('Bulk Deletion Failed', error.message)
      return false
    }
  }

  return {
    customers,
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
    deleteSelected
  }
}

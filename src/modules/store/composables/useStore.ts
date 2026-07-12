import { ref } from 'vue'
import type { Store } from '../types/store.types'
import { storeService } from '../services/store.service'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination, TableFilters } from '@/shared/components/table/table.types'

// Add Area filter support
export interface StoreFilters extends TableFilters {
  areaId?: string
}

export const useStore = () => {
  const stores = ref<Store[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  
  const filters = ref<StoreFilters>({
    search: '',
    status: '',
    areaId: ''
  })

  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })
  
  const sort = ref({ key: 'createdAt', order: 'desc' })

  const toast = useToast()

  const fetchStores = async () => {
    isLoading.value = true
    try {
      const allStores = await storeService.getStores()
      
      // Simulate backend filtering
      let result = allStores.filter(store => {
        const matchSearch = store.code.toLowerCase().includes(filters.value.search.toLowerCase()) || 
                            store.name.toLowerCase().includes(filters.value.search.toLowerCase())
        const matchStatus = filters.value.status ? store.status === filters.value.status : true
        const matchArea = filters.value.areaId ? store.areaId === filters.value.areaId : true
        return matchSearch && matchStatus && matchArea
      })

      // Simulate sorting
      if (sort.value.key) {
        result.sort((a, b) => {
          const valA = (a as any)[sort.value.key]
          const valB = (b as any)[sort.value.key]
          if (valA < valB) return sort.value.order === 'asc' ? -1 : 1
          if (valA > valB) return sort.value.order === 'asc' ? 1 : -1
          return 0
        })
      }

      pagination.value.total = result.length

      // Simulate pagination
      const start = (pagination.value.page - 1) * pagination.value.limit
      const end = start + pagination.value.limit
      
      stores.value = result.slice(start, end)
      
    } catch (error: any) {
      toast.error('Failed to load stores', error.message)
    } finally {
      isLoading.value = false
    }
  }

  const createStore = async (data: any, createAnother = false) => {
    isSubmitting.value = true
    try {
      const newStore = await storeService.createStore(data)
      toast.success('Store Created', `${newStore.name} has been successfully created.`)
      await fetchStores()
      return true
    } catch (error: any) {
      toast.error('Creation Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateStore = async (id: string, data: any) => {
    isSubmitting.value = true
    try {
      const updatedStore = await storeService.updateStore(id, data)
      toast.success('Store Updated', `${updatedStore.name} has been successfully updated.`)
      await fetchStores()
      return true
    } catch (error: any) {
      toast.error('Update Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteStore = async (id: string) => {
    try {
      await storeService.deleteStore(id)
      toast.success('Store Deleted', `Store has been deleted.`)
      await fetchStores()
      return true
    } catch (error: any) {
      toast.error('Deletion Failed', error.message)
      return false
    }
  }

  const deleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await storeService.deleteStore(id)
      }
      toast.success('Stores Deleted', `${ids.length} stores have been deleted.`)
      
      if (stores.value.length === ids.length && pagination.value.page > 1) {
        pagination.value.page -= 1
      }
      
      await fetchStores()
      return true
    } catch (error: any) {
      toast.error('Bulk Deletion Failed', error.message)
      return false
    }
  }

  return {
    stores,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    deleteSelected
  }
}

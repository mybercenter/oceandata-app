import { ref, computed } from 'vue'
import type { Area } from '../types/area.types'
import { areaService } from '../services/area.service'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination, TableFilters } from '@/shared/components/table/table.types'

export const useArea = () => {
  const areas = ref<Area[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  
  const filters = ref<TableFilters>({
    search: '',
    status: ''
  })

  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })
  
  const sort = ref({ key: 'createdAt', order: 'desc' })

  const toast = useToast()

  const fetchAreas = async () => {
    isLoading.value = true
    try {
      const allAreas = await areaService.getAreas()
      
      // Simulate backend filtering
      let result = allAreas.filter(area => {
        const matchSearch = area.code.toLowerCase().includes(filters.value.search.toLowerCase()) || 
                            area.name.toLowerCase().includes(filters.value.search.toLowerCase())
        const matchStatus = filters.value.status ? area.status === filters.value.status : true
        return matchSearch && matchStatus
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
      
      areas.value = result.slice(start, end)
      
    } catch (error: any) {
      toast.error('Failed to load areas', error.message)
    } finally {
      isLoading.value = false
    }
  }

  const createArea = async (data: any, createAnother = false) => {
    isSubmitting.value = true
    try {
      const newArea = await areaService.createArea(data)
      toast.success('Area Created', `${newArea.name} has been successfully created.`)
      await fetchAreas()
      return true
    } catch (error: any) {
      toast.error('Creation Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateArea = async (id: string, data: any) => {
    isSubmitting.value = true
    try {
      const updatedArea = await areaService.updateArea(id, data)
      toast.success('Area Updated', `${updatedArea.name} has been successfully updated.`)
      await fetchAreas()
      return true
    } catch (error: any) {
      toast.error('Update Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteArea = async (id: string) => {
    try {
      await areaService.deleteArea(id)
      toast.success('Area Deleted', `Area has been deleted.`)
      await fetchAreas()
      return true
    } catch (error: any) {
      toast.error('Deletion Failed', error.message)
      return false
    }
  }

  const deleteSelected = async (ids: string[]) => {
    try {
      // Simulate bulk deletion
      for (const id of ids) {
        await areaService.deleteArea(id)
      }
      toast.success('Areas Deleted', `${ids.length} areas have been deleted.`)
      
      // Fix pagination if deleting current page
      if (areas.value.length === ids.length && pagination.value.page > 1) {
        pagination.value.page -= 1
      }
      
      await fetchAreas()
      return true
    } catch (error: any) {
      toast.error('Bulk Deletion Failed', error.message)
      return false
    }
  }

  return {
    areas,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
    deleteSelected
  }
}

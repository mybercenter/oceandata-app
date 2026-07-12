import { ref } from 'vue'
import type { Permission } from '../types/permission.types'
import { permissionService } from '../services/permission.service'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination, TableFilters } from '@/shared/components/table/table.types'

export interface PermissionFilters extends TableFilters {
  module?: string
  action?: string
}

export const usePermission = () => {
  const permissions = ref<Permission[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  
  const filters = ref<PermissionFilters>({
    search: '',
    module: '',
    action: ''
  })

  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })
  
  const sort = ref({ key: 'module', order: 'asc' })
  const toast = useToast()

  const fetchPermissions = async () => {
    isLoading.value = true
    try {
      const all = await permissionService.getPermissions()
      
      let result = all.filter(p => {
        const searchTerms = filters.value.search.toLowerCase()
        const matchSearch = p.name.toLowerCase().includes(searchTerms)
        const matchModule = filters.value.module ? p.module === filters.value.module : true
        const matchAction = filters.value.action ? p.action === filters.value.action : true
        return matchSearch && matchModule && matchAction
      })

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
      const start = (pagination.value.page - 1) * pagination.value.limit
      const end = start + pagination.value.limit
      permissions.value = result.slice(start, end)
      
    } catch (error: any) {
      toast.error('Failed to load permissions', error.message)
    } finally {
      isLoading.value = false
    }
  }

  const createPermission = async (data: any, createAnother = false) => {
    isSubmitting.value = true
    try {
      await permissionService.createPermission(data)
      toast.success('Permission Created', 'New permission has been saved.')
      await fetchPermissions()
      return true
    } catch (error: any) {
      toast.error('Creation Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updatePermission = async (id: string, data: any) => {
    isSubmitting.value = true
    try {
      await permissionService.updatePermission(id, data)
      toast.success('Permission Updated', 'Permission has been successfully updated.')
      await fetchPermissions()
      return true
    } catch (error: any) {
      toast.error('Update Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deletePermission = async (id: string) => {
    try {
      await permissionService.deletePermission(id)
      toast.success('Permission Deleted', 'Permission has been removed.')
      await fetchPermissions()
      return true
    } catch (error: any) {
      toast.error('Deletion Failed', error.message)
      return false
    }
  }

  const deleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await permissionService.deletePermission(id)
      }
      toast.success('Permissions Deleted', ids.length + ' permissions removed.')
      if (permissions.value.length === ids.length && pagination.value.page > 1) {
        pagination.value.page -= 1
      }
      await fetchPermissions()
      return true
    } catch (error: any) {
      toast.error('Bulk Deletion Failed', error.message)
      return false
    }
  }

  return {
    permissions,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    deleteSelected
  }
}

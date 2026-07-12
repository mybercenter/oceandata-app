import { ref } from 'vue'
import type { Role } from '../types/role.types'
import { roleService } from '../services/role.service'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination, TableFilters } from '@/shared/components/table/table.types'

export const useRole = () => {
  const roles = ref<(Role & { permissionsCount?: number })[]>([])
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

  const fetchRoles = async () => {
    isLoading.value = true
    try {
      const allRoles = await roleService.getRoles()
      
      let result = allRoles.filter(r => {
        const searchTerms = filters.value.search.toLowerCase()
        const matchSearch = r.name.toLowerCase().includes(searchTerms) || 
                            (r.description || '').toLowerCase().includes(searchTerms)
        const matchStatus = filters.value.status ? r.status === filters.value.status : true
        return matchSearch && matchStatus
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
      roles.value = result.slice(start, end)
      
    } catch (error: any) {
      toast.error('Failed to load roles', error.message)
    } finally {
      isLoading.value = false
    }
  }

  const createRole = async (data: any, createAnother = false) => {
    isSubmitting.value = true
    try {
      await roleService.createRole(data)
      toast.success('Role Created', 'New role has been saved.')
      await fetchRoles()
      return true
    } catch (error: any) {
      toast.error('Creation Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateRole = async (id: string, data: any) => {
    isSubmitting.value = true
    try {
      await roleService.updateRole(id, data)
      toast.success('Role Updated', 'Role has been successfully updated.')
      await fetchRoles()
      return true
    } catch (error: any) {
      toast.error('Update Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteRole = async (id: string) => {
    try {
      await roleService.deleteRole(id)
      toast.success('Role Deleted', 'Role has been removed.')
      await fetchRoles()
      return true
    } catch (error: any) {
      toast.error('Deletion Failed', error.message)
      return false
    }
  }

  const deleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await roleService.deleteRole(id)
      }
      toast.success('Roles Deleted', ids.length + ' roles removed.')
      if (roles.value.length === ids.length && pagination.value.page > 1) {
        pagination.value.page -= 1
      }
      await fetchRoles()
      return true
    } catch (error: any) {
      toast.error('Bulk Deletion Failed', error.message)
      return false
    }
  }

  return {
    roles,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    deleteSelected
  }
}

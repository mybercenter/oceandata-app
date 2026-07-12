import { ref } from 'vue'
import type { User } from '../types/user.types'
import { userService } from '../services/user.service'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination, TableFilters } from '@/shared/components/table/table.types'

export interface UserFilters extends TableFilters {
  roleId?: string
  lastLogin?: string
}

export const useUser = () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  
  const filters = ref<UserFilters>({
    search: '',
    status: '',
    roleId: '',
    lastLogin: ''
  })

  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })
  
  const sort = ref({ key: 'createdAt', order: 'desc' })

  const toast = useToast()

  const fetchUsers = async () => {
    isLoading.value = true
    try {
      const allUsers = await userService.getUsers()
      
      let result = allUsers.filter(u => {
        const searchTerms = filters.value.search.toLowerCase()
        const matchSearch = u.username.toLowerCase().includes(searchTerms) || 
                            (u.employee?.fullName || '').toLowerCase().includes(searchTerms) ||
                            (u.employee?.employeeCode || '').toLowerCase().includes(searchTerms)
        
        const matchStatus = filters.value.status ? u.status === filters.value.status : true
        const matchRole = filters.value.roleId ? u.employee?.roleId === filters.value.roleId : true
        
        // Simple logic for lastLogin filter demo
        let matchLastLogin = true
        if (filters.value.lastLogin) {
          if (filters.value.lastLogin === 'never') matchLastLogin = !u.lastLogin
          else if (filters.value.lastLogin === 'has_logged_in') matchLastLogin = !!u.lastLogin
        }
        
        return matchSearch && matchStatus && matchRole && matchLastLogin
      })

      if (sort.value.key) {
        result.sort((a, b) => {
          let valA = (a as any)[sort.value.key]
          let valB = (b as any)[sort.value.key]
          
          if (sort.value.key === 'employeeName') {
            valA = a.employee?.fullName
            valB = b.employee?.fullName
          }
          if (sort.value.key === 'employeeCode') {
            valA = a.employee?.employeeCode
            valB = b.employee?.employeeCode
          }

          if (!valA && valB) return sort.value.order === 'asc' ? -1 : 1
          if (valA && !valB) return sort.value.order === 'asc' ? 1 : -1
          if (valA < valB) return sort.value.order === 'asc' ? -1 : 1
          if (valA > valB) return sort.value.order === 'asc' ? 1 : -1
          return 0
        })
      }

      pagination.value.total = result.length

      const start = (pagination.value.page - 1) * pagination.value.limit
      const end = start + pagination.value.limit
      
      users.value = result.slice(start, end)
      
    } catch (error: any) {
      toast.error('Failed to load users', error.message)
    } finally {
      isLoading.value = false
    }
  }

  const createUser = async (data: any, createAnother = false) => {
    isSubmitting.value = true
    try {
      const newUser = await userService.createUser(data)
      toast.success('User Created', 'Account for ' + newUser.username + ' has been created.')
      await fetchUsers()
      return true
    } catch (error: any) {
      toast.error('Creation Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateUser = async (id: string, data: any) => {
    isSubmitting.value = true
    try {
      const updatedUser = await userService.updateUser(id, data)
      toast.success('User Updated', 'Account for ' + updatedUser.username + ' has been updated.')
      await fetchUsers()
      return true
    } catch (error: any) {
      toast.error('Update Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id)
      toast.success('User Deleted', 'Account has been deleted.')
      await fetchUsers()
      return true
    } catch (error: any) {
      toast.error('Deletion Failed', error.message)
      return false
    }
  }

  const deleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await userService.deleteUser(id)
      }
      toast.success('Users Deleted', ids.length + ' accounts have been deleted.')
      
      if (users.value.length === ids.length && pagination.value.page > 1) {
        pagination.value.page -= 1
      }
      
      await fetchUsers()
      return true
    } catch (error: any) {
      toast.error('Bulk Deletion Failed', error.message)
      return false
    }
  }

  const resetPassword = async (id: string, newPassword: string) => {
    isSubmitting.value = true
    try {
      await userService.resetPassword(id, newPassword)
      toast.success('Password Reset', 'Password has been updated successfully.')
      return true
    } catch (error: any) {
      toast.error('Reset Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    users,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    deleteSelected,
    resetPassword
  }
}

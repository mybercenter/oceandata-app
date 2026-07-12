import { ref } from 'vue'
import type { Employee } from '../types/employee.types'
import { employeeService } from '../services/employee.service'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination, TableFilters } from '@/shared/components/table/table.types'

export interface EmployeeFilters extends TableFilters {
  roleId?: string
  areaId?: string
  storeId?: string
  dedicate?: string
}

export const useEmployee = () => {
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  
  const filters = ref<EmployeeFilters>({
    search: '',
    status: '',
    roleId: '',
    areaId: '',
    storeId: '',
    dedicate: ''
  })

  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })
  
  const sort = ref({ key: 'createdAt', order: 'desc' })

  const toast = useToast()

  const fetchEmployees = async () => {
    isLoading.value = true
    try {
      const allEmployees = await employeeService.getEmployees()
      
      let result = allEmployees.filter(emp => {
        const searchTerms = filters.value.search.toLowerCase()
        const matchSearch = emp.employeeCode.toLowerCase().includes(searchTerms) || 
                            emp.fullName.toLowerCase().includes(searchTerms)
        
        const matchStatus = filters.value.status ? emp.status === filters.value.status : true
        const matchRole = filters.value.roleId ? emp.roleId === filters.value.roleId : true
        const matchStore = filters.value.storeId ? emp.storeId === filters.value.storeId : true
        const matchDedicate = filters.value.dedicate ? emp.dedicate === filters.value.dedicate : true
        
        // Area is a Many-to-Many array
        const matchArea = filters.value.areaId ? emp.areaIds.includes(filters.value.areaId) : true
        
        return matchSearch && matchStatus && matchRole && matchStore && matchDedicate && matchArea
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
      
      employees.value = result.slice(start, end)
      
    } catch (error: any) {
      toast.error('Failed to load employees', error.message)
    } finally {
      isLoading.value = false
    }
  }

  const createEmployee = async (data: any, createAnother = false) => {
    isSubmitting.value = true
    try {
      const newEmp = await employeeService.createEmployee(data)
      toast.success('Employee Created', newEmp.fullName + ' has been successfully created.')
      await fetchEmployees()
      return true
    } catch (error: any) {
      toast.error('Creation Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateEmployee = async (id: string, data: any) => {
    isSubmitting.value = true
    try {
      const updatedEmp = await employeeService.updateEmployee(id, data)
      toast.success('Employee Updated', updatedEmp.fullName + ' has been successfully updated.')
      await fetchEmployees()
      return true
    } catch (error: any) {
      toast.error('Update Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      await employeeService.deleteEmployee(id)
      toast.success('Employee Deleted', 'Employee has been deleted.')
      await fetchEmployees()
      return true
    } catch (error: any) {
      toast.error('Deletion Failed', error.message)
      return false
    }
  }

  const deleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await employeeService.deleteEmployee(id)
      }
      toast.success('Employees Deleted', ids.length + ' employees have been deleted.')
      
      if (employees.value.length === ids.length && pagination.value.page > 1) {
        pagination.value.page -= 1
      }
      
      await fetchEmployees()
      return true
    } catch (error: any) {
      toast.error('Bulk Deletion Failed', error.message)
      return false
    }
  }

  return {
    employees,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    deleteSelected
  }
}

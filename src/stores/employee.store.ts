import { defineStore } from 'pinia'
import { employeeService } from '@/services/api/employee.service'
import { useToast } from '@/shared/composables/useToast'
import type { Employee } from '@/modules/employee/types/employee.types'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    items: [] as Employee[],
    loading: false,
    submitting: false,
    pagination: { page: 1, limit: 10, total: 0 },
    filters: { search: '', status: '', role_id: '', store_id: '' },
    sort: { key: 'created_at', order: 'desc' }
  }),
  actions: {
    async fetchItems() {
      this.loading = true
      try {
        const { data, meta } = await employeeService.index({
          page: this.pagination.page,
          per_page: this.pagination.limit,
          search: this.filters.search,
          is_active: this.filters.status === 'active' ? 1 : (this.filters.status === 'inactive' ? 0 : undefined),
          role_id: this.filters.role_id || undefined,
          store_id: this.filters.store_id || undefined,
          sort: this.sort.key,
          order: this.sort.order
        })
        this.items = data
        this.pagination.total = meta?.total || data.length
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to load employees')
      } finally {
        this.loading = false
      }
    },
    async create(payload: any) {
      this.submitting = true
      try {
        await employeeService.store(payload)
        useToast().success('Success', 'Employee created successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to create employee')
        return false
      } finally {
        this.submitting = false
      }
    },
    async update(id: string | number, payload: any) {
      this.submitting = true
      try {
        await employeeService.update(id, payload)
        useToast().success('Success', 'Employee updated successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update employee')
        return false
      } finally {
        this.submitting = false
      }
    },
    async delete(id: string | number) {
      try {
        await employeeService.destroy(id)
        useToast().success('Success', 'Employee deleted successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to delete employee')
        return false
      }
    }
  }
})

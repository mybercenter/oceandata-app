import { defineStore } from 'pinia'
import { customerService } from '@/modules/customer/services/customer.service'
import { useToast } from '@/shared/composables/useToast'
import type { Customer } from '@/modules/customer/types/customer.types'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [] as Customer[],
    customer: null as Customer | null,
    loading: false,
    submitting: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    filters: {
      search: '',
      status: '',
      area_id: '',
      store_id: '',
      employee_id: '',
      customer_status: '',
      current_conversion: '',
      customer_date_from: '',
      customer_date_to: ''
    },
    sort: {
      key: 'customer_date',
      order: 'desc'
    }
  }),
  actions: {
    async fetchCustomers() {
      this.loading = true
      try {
        const res = await customerService.index({
          page: this.pagination.page,
          per_page: this.pagination.limit,
          search: this.filters.search,
          is_active: this.filters.status === 'active' ? 1 : (this.filters.status === 'inactive' ? 0 : undefined),
          area_id: this.filters.area_id || undefined,
          store_id: this.filters.store_id || undefined,
          employee_id: this.filters.employee_id || undefined,
          customer_status: this.filters.customer_status || undefined,
          current_conversion: this.filters.current_conversion || undefined,
          customer_date_from: this.filters.customer_date_from || undefined,
          customer_date_to: this.filters.customer_date_to || undefined,
          sort_by: this.sort.key,
          sort_dir: this.sort.order
        })
        
        const payload = res.data || res
        this.customers = payload.data || payload || []
        this.pagination.total = payload.meta?.total || this.customers.length
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to load customers')
      } finally {
        this.loading = false
      }
    },
    async fetchCustomer(id: string | number) {
      this.loading = true
      try {
        this.customer = await customerService.show(id)
      } catch (error: any) {
        useToast().error('Error', 'Failed to fetch customer details')
      } finally {
        this.loading = false
      }
    },
    async createCustomer(payload: any) {
      this.submitting = true
      try {
        await customerService.store(payload)
        useToast().success('Success', 'Customer created successfully')
        await this.fetchCustomers()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to create customer')
        return false
      } finally {
        this.submitting = false
      }
    },
    async updateCustomer(id: string | number, payload: any) {
      this.submitting = true
      try {
        await customerService.update(id, payload)
        useToast().success('Success', 'Customer updated successfully')
        await this.fetchCustomers()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update customer')
        return false
      } finally {
        this.submitting = false
      }
    },
    async deleteCustomer(id: string | number) {
      try {
        await customerService.destroy(id)
        useToast().success('Success', 'Customer deleted successfully')
        await this.fetchCustomers()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to delete customer')
        return false
      }
    },
    async updateStatus(id: string | number) {
      try {
        await customerService.updateStatus(id)
        useToast().success('Success', 'Customer status toggled')
        await this.fetchCustomers()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update status')
        return false
      }
    },
    async updateConversion(id: string | number, conversion: string) {
      try {
        await customerService.updateConversion(id, conversion)
        useToast().success('Success', 'Customer conversion updated')
        await this.fetchCustomers()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update conversion')
        return false
      }
    },
    async exportCustomers() {
      try {
        await customerService.export({
          search: this.filters.search,
          is_active: this.filters.status === 'active' ? 1 : (this.filters.status === 'inactive' ? 0 : undefined),
          area_id: this.filters.area_id || undefined,
          store_id: this.filters.store_id || undefined,
          employee_id: this.filters.employee_id || undefined,
          customer_status: this.filters.customer_status || undefined,
          current_conversion: this.filters.current_conversion || undefined,
          customer_date_from: this.filters.customer_date_from || undefined,
          customer_date_to: this.filters.customer_date_to || undefined,
          sort_by: this.sort.key,
          sort_dir: this.sort.order
        })
      } catch (error: any) {
        useToast().error('Error', 'Failed to export customers')
      }
    },
    clearState() {
      this.customer = null
      this.customers = []
    }
  }
})

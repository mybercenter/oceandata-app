import { defineStore } from 'pinia'
import { roleService } from '@/services/api/role.service'
import { useToast } from '@/shared/composables/useToast'
import type { Role } from '@/modules/role/types/role.types'

export const useRoleStore = defineStore('role', {
  state: () => ({
    items: [] as Role[],
    loading: false,
    submitting: false,
    pagination: { page: 1, limit: 10, total: 0 },
    filters: { search: '' },
    sort: { key: 'created_at', order: 'desc' }
  }),
  actions: {
    async fetchItems() {
      this.loading = true
      try {
        const { data, meta } = await roleService.index({
          page: this.pagination.page,
          per_page: this.pagination.limit,
          search: this.filters.search,
          sort: this.sort.key,
          order: this.sort.order
        })
        this.items = data
        this.pagination.total = meta?.total || data.length
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to load roles')
      } finally {
        this.loading = false
      }
    },
    async create(payload: any) {
      this.submitting = true
      try {
        await roleService.store(payload)
        useToast().success('Success', 'Role created successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to create role')
        return false
      } finally {
        this.submitting = false
      }
    },
    async update(id: string | number, payload: any) {
      this.submitting = true
      try {
        await roleService.update(id, payload)
        useToast().success('Success', 'Role updated successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update role')
        return false
      } finally {
        this.submitting = false
      }
    },
    async delete(id: string | number) {
      try {
        await roleService.destroy(id)
        useToast().success('Success', 'Role deleted successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to delete role')
        return false
      }
    }
  }
})

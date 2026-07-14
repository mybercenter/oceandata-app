import { defineStore } from 'pinia'
import { permissionService } from '@/services/api/permission.service'
import { useToast } from '@/shared/composables/useToast'
export const usePermissionStore = defineStore('permission', {
  state: () => ({
    items: [] as any[],
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
        const { data, meta } = await permissionService.index({
          page: this.pagination.page,
          per_page: this.pagination.limit,
          search: this.filters.search,
          sort_by: this.sort.key,
          sort_dir: this.sort.order
        })
        this.items = data
        this.pagination.total = meta?.total || data.length
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to load permissions')
      } finally {
        this.loading = false
      }
    },
    async create(payload: any) {
      this.submitting = true
      try {
        await permissionService.store(payload)
        useToast().success('Success', 'Permission created successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to create permission')
        return false
      } finally {
        this.submitting = false
      }
    },
    async update(id: string | number, payload: any) {
      this.submitting = true
      try {
        await permissionService.update(id, payload)
        useToast().success('Success', 'Permission updated successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update permission')
        return false
      } finally {
        this.submitting = false
      }
    },
    async delete(id: string | number) {
      try {
        await permissionService.destroy(id)
        useToast().success('Success', 'Permission deleted successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to delete permission')
        return false
      }
    }
  }
})

import { defineStore } from 'pinia'
import { storeService } from '@/services/api/store.service'
import { useToast } from '@/shared/composables/useToast'
import type { Store } from '@/modules/store/types/store.types'

export const useStoreStore = defineStore('store', {
  state: () => ({
    items: [] as Store[],
    loading: false,
    submitting: false,
    pagination: { page: 1, limit: 10, total: 0 },
    filters: { search: '', status: '', area_id: '' },
    sort: { key: 'created_at', order: 'desc' }
  }),
  actions: {
    async fetchItems() {
      this.loading = true
      try {
        const { data, meta } = await storeService.index({
          page: this.pagination.page,
          per_page: this.pagination.limit,
          search: this.filters.search,
          is_active: this.filters.status === 'active' ? 1 : (this.filters.status === 'inactive' ? 0 : undefined),
          area_id: this.filters.area_id || undefined,
          sort: this.sort.key,
          order: this.sort.order
        })
        this.items = data
        this.pagination.total = meta?.total || data.length
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to load stores')
      } finally {
        this.loading = false
      }
    },
    async create(payload: any) {
      this.submitting = true
      try {
        await storeService.store(payload)
        useToast().success('Success', 'Store created successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to create store')
        return false
      } finally {
        this.submitting = false
      }
    },
    async update(id: string | number, payload: any) {
      this.submitting = true
      try {
        await storeService.update(id, payload)
        useToast().success('Success', 'Store updated successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update store')
        return false
      } finally {
        this.submitting = false
      }
    },
    async delete(id: string | number) {
      try {
        await storeService.destroy(id)
        useToast().success('Success', 'Store deleted successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to delete store')
        return false
      }
    }
  }
})

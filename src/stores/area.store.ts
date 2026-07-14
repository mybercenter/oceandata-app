import { defineStore } from 'pinia'
import { areaService } from '@/services/api/area.service'
import { useToast } from '@/shared/composables/useToast'
import type { Area } from '@/modules/area/types/area.types'

export const useAreaStore = defineStore('area', {
  state: () => ({
    items: [] as Area[],
    loading: false,
    submitting: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    filters: {
      search: '',
      status: ''
    },
    sort: {
      key: 'created_at',
      order: 'desc'
    }
  }),
  actions: {
    async fetchItems() {
      this.loading = true
      try {
        const { data, meta } = await areaService.index({
          page: this.pagination.page,
          per_page: this.pagination.limit,
          search: this.filters.search,
          is_active: this.filters.status === 'active' ? 1 : (this.filters.status === 'inactive' ? 0 : undefined),
          sort_by: this.sort.key,
          sort_dir: this.sort.order
        })
        this.items = data
        if (meta) {
          this.pagination.total = meta.total || data.length
        } else {
          this.pagination.total = data.length
        }
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to load areas')
      } finally {
        this.loading = false
      }
    },
    async create(payload: any) {
      this.submitting = true
      try {
        await areaService.store(payload)
        useToast().success('Success', 'Area created successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to create area')
        return false
      } finally {
        this.submitting = false
      }
    },
    async update(id: string | number, payload: any) {
      this.submitting = true
      try {
        await areaService.update(id, payload)
        useToast().success('Success', 'Area updated successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update area')
        return false
      } finally {
        this.submitting = false
      }
    },
    async delete(id: string | number) {
      try {
        await areaService.destroy(id)
        useToast().success('Success', 'Area deleted successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to delete area')
        return false
      }
    }
  }
})

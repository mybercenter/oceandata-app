import { defineStore } from 'pinia'
import { messageTemplateService } from '@/services/api/message-template.service'
import { useToast } from '@/shared/composables/useToast'
import type { MessageTemplate } from '@/modules/message-template/types/message-template.types'

export const useMessageTemplateStore = defineStore('messageTemplate', {
  state: () => ({
    items: [] as MessageTemplate[],
    loading: false,
    submitting: false,
    pagination: { page: 1, limit: 10, total: 0 },
    filters: { search: '', status: '', area_id: '', dedicate: '' },
    sort: { key: 'created_at', order: 'desc' }
  }),
  actions: {
    async fetchItems() {
      this.loading = true
      try {
        const { data, meta } = await messageTemplateService.index({
          page: this.pagination.page,
          per_page: this.pagination.limit,
          search: this.filters.search,
          is_active: this.filters.status === 'active' ? 1 : (this.filters.status === 'inactive' ? 0 : undefined),
          area_id: this.filters.area_id || undefined,
          dedicate: this.filters.dedicate || undefined,
          sort_by: this.sort.key,
          sort_dir: this.sort.order
        })
        this.items = data
        this.pagination.total = meta?.total || data.length
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to load templates')
      } finally {
        this.loading = false
      }
    },
    async create(payload: any) {
      this.submitting = true
      try {
        await messageTemplateService.store(payload)
        useToast().success('Success', 'Template created successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        let errorMsg = error.response?.data?.message || 'Failed to create template'
        if (error.response?.data?.errors) {
          const firstError = Object.values(error.response.data.errors).flat()[0]
          if (firstError) errorMsg += `: ${firstError}`
        }
        useToast().error('Error', errorMsg)
        return false
      } finally {
        this.submitting = false
      }
    },
    async update(id: string | number, payload: any) {
      this.submitting = true
      try {
        await messageTemplateService.update(id, payload)
        useToast().success('Success', 'Template updated successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        let errorMsg = error.response?.data?.message || 'Failed to update template'
        if (error.response?.data?.errors) {
          const firstError = Object.values(error.response.data.errors).flat()[0]
          if (firstError) errorMsg += `: ${firstError}`
        }
        useToast().error('Error', errorMsg)
        return false
      } finally {
        this.submitting = false
      }
    },
    async delete(id: string | number) {
      try {
        await messageTemplateService.destroy(id)
        useToast().success('Success', 'Template deleted successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to delete template')
        return false
      }
    }
  }
})

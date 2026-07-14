import { defineStore } from 'pinia'
import { userService } from '@/services/api/user.service'
import { useToast } from '@/shared/composables/useToast'
import type { User } from '@/modules/user/types/user.types'

export const useUserStore = defineStore('user', {
  state: () => ({
    items: [] as User[],
    loading: false,
    submitting: false,
    pagination: { page: 1, limit: 10, total: 0 },
    filters: { search: '', status: '' },
    sort: { key: 'created_at', order: 'desc' }
  }),
  actions: {
    async fetchItems() {
      this.loading = true
      try {
        const { data, meta } = await userService.index({
          page: this.pagination.page,
          per_page: this.pagination.limit,
          search: this.filters.search,
          is_active: this.filters.status === 'active' ? 1 : (this.filters.status === 'inactive' ? 0 : undefined),
          sort_by: this.sort.key,
          sort_dir: this.sort.order
        })
        this.items = data
        this.pagination.total = meta?.total || data.length
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to load users')
      } finally {
        this.loading = false
      }
    },
    async create(payload: any) {
      this.submitting = true
      try {
        await userService.store(payload)
        useToast().success('Success', 'User created successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to create user')
        return false
      } finally {
        this.submitting = false
      }
    },
    async update(id: string | number, payload: any) {
      this.submitting = true
      try {
        await userService.update(id, payload)
        useToast().success('Success', 'User updated successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to update user')
        return false
      } finally {
        this.submitting = false
      }
    },
    async delete(id: string | number) {
      try {
        await userService.destroy(id)
        useToast().success('Success', 'User deleted successfully')
        await this.fetchItems()
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to delete user')
        return false
      }
    },
    async resetPassword(id: string | number, payload: any) {
      this.submitting = true
      try {
        await userService.resetPassword(id, payload)
        useToast().success('Success', 'Password reset successfully')
        return true
      } catch (error: any) {
        useToast().error('Error', error.response?.data?.message || 'Failed to reset password')
        return false
      } finally {
        this.submitting = false
      }
    }
  }
})

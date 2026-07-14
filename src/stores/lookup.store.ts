import { defineStore } from 'pinia'
import { lookupService } from '@/services/api/lookup.service'

export const useLookupStore = defineStore('lookup', {
  state: () => ({
    areas: [] as any[],
    stores: [] as any[],
    roles: [] as any[],
    employees: [] as any[],
    permissions: [] as any[],
    dedicates: [] as string[],
    customer_statuses: [] as string[],
    conversion_statuses: [] as string[],
    template_types: [] as string[],
    loading: false,
    loaded: false
  }),
  actions: {
    async fetchLookups(force = false) {
      if (this.loaded && !force) return
      
      this.loading = true
      try {
        const data = await lookupService.fetchLookups()
        console.log('[DEBUG] lookups data:', JSON.stringify(data))
        this.areas = Array.isArray(data.areas) ? data.areas : (Object.values(data.areas || {}))
        this.stores = Array.isArray(data.stores) ? data.stores : (Object.values(data.stores || {}))
        this.roles = Array.isArray(data.roles) ? data.roles : (Object.values(data.roles || {}))
        this.employees = Array.isArray(data.employees) ? data.employees : (Object.values(data.employees || {}))
        this.permissions = Array.isArray(data.permissions) ? data.permissions : (Object.values(data.permissions || {}))
        this.dedicates = Array.isArray(data.dedicates) ? data.dedicates : (Object.values(data.dedicates || {}))
        this.customer_statuses = Array.isArray(data.customer_statuses) ? data.customer_statuses : (Object.values(data.customer_statuses || {}))
        this.conversion_statuses = Array.isArray(data.conversion_statuses) ? data.conversion_statuses : (Object.values(data.conversion_statuses || {}))
        this.template_types = Array.isArray(data.template_types) ? data.template_types : (Object.values(data.template_types || {}))
        this.loaded = true
      } catch (error) {
        console.error('Failed to fetch lookups:', error)
      } finally {
        this.loading = false
      }
    }
  }
})

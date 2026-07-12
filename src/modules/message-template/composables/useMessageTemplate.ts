import { ref } from 'vue'
import type { MessageTemplate } from '../types/message-template.types'
import { messageTemplateService } from '../services/message-template.service'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination, TableFilters } from '@/shared/components/table/table.types'

export interface MessageTemplateFilters extends TableFilters {
  status?: string
  areaId?: string
  dedicate?: string
}

export const useMessageTemplate = () => {
  const templates = ref<MessageTemplate[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  
  const filters = ref<MessageTemplateFilters>({
    search: '',
    areaId: '',
    dedicate: '',
    status: ''
  })

  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })
  
  const sort = ref({ key: 'updatedAt', order: 'desc' })
  const toast = useToast()

  const fetchTemplates = async () => {
    isLoading.value = true
    try {
      const all = await messageTemplateService.getTemplates()
      
      let result = all.filter(t => {
        const searchTerms = filters.value.search.toLowerCase()
        const areaName = (t.area?.name || '').toLowerCase()
        const tplPreview = (t.template1 || t.template2 || t.template3 || '').toLowerCase()
        
        const matchSearch = areaName.includes(searchTerms) || tplPreview.includes(searchTerms)
        const matchArea = filters.value.areaId ? t.areaId === filters.value.areaId : true
        const matchDedicate = filters.value.dedicate ? t.dedicate === filters.value.dedicate : true
        const matchStatus = filters.value.status ? t.status === filters.value.status : true
        
        return matchSearch && matchArea && matchDedicate && matchStatus
      })

      if (sort.value.key) {
        result.sort((a, b) => {
          let valA: any = (a as any)[sort.value.key]
          let valB: any = (b as any)[sort.value.key]
          
          if (sort.value.key === 'area') {
            valA = a.area?.name || ''
            valB = b.area?.name || ''
          }
          
          if (valA < valB) return sort.value.order === 'asc' ? -1 : 1
          if (valA > valB) return sort.value.order === 'asc' ? 1 : -1
          return 0
        })
      }

      pagination.value.total = result.length
      const start = (pagination.value.page - 1) * pagination.value.limit
      const end = start + pagination.value.limit
      templates.value = result.slice(start, end)
      
    } catch (error: any) {
      toast.error('Failed to load templates', error.message)
    } finally {
      isLoading.value = false
    }
  }

  const createTemplate = async (data: any, createAnother = false) => {
    isSubmitting.value = true
    try {
      await messageTemplateService.createTemplate(data)
      toast.success('Template Created', 'Message template has been saved.')
      await fetchTemplates()
      return true
    } catch (error: any) {
      toast.error('Creation Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateTemplate = async (id: string, data: any) => {
    isSubmitting.value = true
    try {
      await messageTemplateService.updateTemplate(id, data)
      toast.success('Template Updated', 'Message template has been successfully updated.')
      await fetchTemplates()
      return true
    } catch (error: any) {
      toast.error('Update Failed', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteTemplate = async (id: string) => {
    try {
      await messageTemplateService.deleteTemplate(id)
      toast.success('Template Deleted', 'Message template has been removed.')
      await fetchTemplates()
      return true
    } catch (error: any) {
      toast.error('Deletion Failed', error.message)
      return false
    }
  }

  const deleteSelected = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await messageTemplateService.deleteTemplate(id)
      }
      toast.success('Templates Deleted', ids.length + ' templates removed.')
      if (templates.value.length === ids.length && pagination.value.page > 1) {
        pagination.value.page -= 1
      }
      await fetchTemplates()
      return true
    } catch (error: any) {
      toast.error('Bulk Deletion Failed', error.message)
      return false
    }
  }

  return {
    templates,
    pagination,
    filters,
    sort,
    isLoading,
    isSubmitting,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    deleteSelected
  }
}

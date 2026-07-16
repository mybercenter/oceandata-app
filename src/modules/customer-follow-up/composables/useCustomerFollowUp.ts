import { ref } from 'vue'
import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { customerFollowUpService } from '../services/customer-follow-up.service'
import { messageTemplateService } from '@/services/api/message-template.service'
import type { MessageTemplate } from '../../message-template/types/message-template.types'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination } from '@/shared/components/table/table.types'

export const useCustomerFollowUp = () => {
  const followUps = ref<CustomerFollowUp[]>([])
  const templates = ref<MessageTemplate[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const isOpeningWhatsapp = ref(false)
  
  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })
  
  const toast = useToast()

  const fetchHistory = async (customerId?: string | number) => {
    isLoading.value = true
    try {
      const all = await customerFollowUpService.getFollowUps(customerId)
      pagination.value.total = all.length
      const start = (pagination.value.page - 1) * pagination.value.limit
      const end = start + pagination.value.limit
      followUps.value = all.slice(start, end)
    } catch (error: any) {
      toast.error('Failed to load follow up history', error.message)
    } finally {
      isLoading.value = false
    }
  }

  const fetchTemplates = async (areaId: string, dedicate: 'AV' | 'HA') => {
    try {
      const { data: all } = await messageTemplateService.index({
        area_id: areaId,
        dedicate: dedicate,
        is_active: 1
      })
      templates.value = all
    } catch (error: any) {
      toast.error('Failed to load templates', error.message)
    }
  }

  const createFollowUp = async (data: any) => {
    isSubmitting.value = true
    try {
      await customerFollowUpService.createFollowUp(data)
      toast.success('Follow Up Saved', 'Follow up activity has been successfully recorded.')
      return true
    } catch (error: any) {
      toast.error('Failed to save', error.message)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const openWhatsapp = async (phone: string, message: string) => {
    isOpeningWhatsapp.value = true
    try {
      await customerFollowUpService.openWhatsapp(phone, message)
      toast.success('Opening WhatsApp', 'Redirecting to WhatsApp with the pre-filled message...')
      return true
    } catch (error: any) {
      toast.error('Failed to open WhatsApp', error.message)
      return false
    } finally {
      isOpeningWhatsapp.value = false
    }
  }

  return {
    followUps,
    templates,
    pagination,
    isLoading,
    isSubmitting,
    isOpeningWhatsapp,
    fetchHistory,
    fetchTemplates,
    createFollowUp,
    openWhatsapp
  }
}

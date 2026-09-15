import { ref } from 'vue'
import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { customerFollowUpService } from '../services/customer-follow-up.service'
import { messageTemplateService } from '@/services/api/message-template.service'
import type { MessageTemplate } from '../../message-template/types/message-template.types'
import { useToast } from '@/shared/composables/useToast'
import type { TablePagination } from '@/shared/components/table/table.types'

export const useCustomerFollowUp = () => {
  const followUps = ref<CustomerFollowUp[]>([])
  const allFilteredFollowUps = ref<CustomerFollowUp[]>([])
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

  const fetchHistory = async (customerId?: string | number, currentFilters?: any) => {
    isLoading.value = true
    try {
      let all = await customerFollowUpService.getFollowUps(customerId)
      
      if (currentFilters) {
        if (currentFilters.dedicate) {
          all = all.filter(f => f.dedicate === currentFilters.dedicate)
        }
        if (currentFilters.areaId) {
          all = all.filter(f => (f.customer as any)?.employee?.store?.area_id === currentFilters.areaId || (f.customer as any)?.area_id === currentFilters.areaId)
        }
        if (currentFilters.storeId) {
          all = all.filter(f => (f.customer as any)?.employee?.store_id === currentFilters.storeId || (f.customer as any)?.store_id === currentFilters.storeId)
        }
        if (currentFilters.employeeId) {
          all = all.filter(f => (f.customer as any)?.employee_id === currentFilters.employeeId)
        }
        if (currentFilters.search) {
          const s = currentFilters.search.toLowerCase()
          all = all.filter(f => {
            const customerName = (f.customer as any)?.full_name?.toLowerCase() || ''
            const customerPhone = (f.customer as any)?.phone?.toLowerCase() || ''
            const employeeName = (f.customer as any)?.employee?.full_name?.toLowerCase() || ''
            return customerName.includes(s) || customerPhone.includes(s) || employeeName.includes(s)
          })
        }
      }

      allFilteredFollowUps.value = all
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

  const exportData = () => {
    const dataToExport = allFilteredFollowUps.value
    if (dataToExport.length === 0) {
      toast.error('Export Failed', 'No data to export')
      return
    }

    const headers = ['Date', 'Customer Name', 'Phone', 'Employee', 'Store', 'Dedicate', 'Template Used', 'Conversion']
    const csvRows = [headers.join(',')]

    dataToExport.forEach(row => {
      const date = row.followUpDate ? new Date(row.followUpDate).toLocaleDateString('id-ID') : '-'
      const customer = (row.customer as any)?.full_name || '-'
      const phone = (row.customer as any)?.phone || '-'
      const employee = (row.customer as any)?.employee?.full_name || '-'
      const store = (row.customer as any)?.employee?.store?.name || '-'
      const dedicate = row.dedicate || '-'
      const template = row.templateUsed || '-'
      const conversion = (row.customer as any)?.current_conversion || '-'
      
      const values = [
        `"${date}"`,
        `"${customer}"`,
        `"${phone}"`,
        `"${employee}"`,
        `"${store}"`,
        `"${dedicate}"`,
        `"${template}"`,
        `"${conversion}"`
      ]
      csvRows.push(values.join(','))
    })

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `follow_ups_export_${new Date().getTime()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
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
    openWhatsapp,
    exportData
  }
}

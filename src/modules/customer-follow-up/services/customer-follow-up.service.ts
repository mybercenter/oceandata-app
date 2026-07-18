import http from '@/shared/services/http'
import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { customerService } from '../../customer/services/customer.service'

class CustomerFollowUpService {
  async getFollowUps(customerId?: string | number): Promise<CustomerFollowUp[]> {
    const url = customerId ? `/customers/${customerId}/follow-ups` : `/follow-ups`
    try {
      const { data } = await http.get(url, { params: { per_page: 500 } })
      const items = data.data?.data || data.data || []
      return items.map((item: any) => this.mapToCamelCase(item))
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async createFollowUp(data: any): Promise<CustomerFollowUp> {
    if (!data.customerId) throw new Error('Customer ID is required')
    if (!data.dedicate) throw new Error('Dedicate is required')
    if (!data.templateUsed) throw new Error('Template is required')
    if (!data.followUpDate) throw new Error('Follow Up Date is required')

    const payload = {
      dedicate: data.dedicate,
      template_used: data.templateUsed,
      whatsapp_message: data.whatsappMessage,
      follow_up_date: data.followUpDate,
      notes: data.notes,
      conversion: data.conversion
    }

    const { data: responseData } = await http.post(`/customers/${data.customerId}/follow-ups`, payload)
    
    // Automatically trigger customer fetch refresh if necessary, but backend updates it
    return this.mapToCamelCase(responseData.data)
  }

  async updateFollowUp(id: string, data: Partial<CustomerFollowUp>): Promise<CustomerFollowUp> {
    const payload = {
      _method: 'PUT',
      notes: data.notes
    }
    const { data: responseData } = await http.post(`/follow-ups/${id}`, payload)
    return this.mapToCamelCase(responseData.data)
  }

  async openWhatsapp(phone: string, message: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '')
    let formattedPhone = cleanPhone
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1)
    }
    
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    return true
  }

  private mapToCamelCase(item: any): CustomerFollowUp {
    return {
      ...item,
      customerId: item.customer_id,
      followUpDate: item.follow_up_date,
      templateUsed: item.template_used,
      whatsappMessage: item.whatsapp_message,
      whatsappUrl: item.whatsapp_url,
      evidenceUrl: item.evidence_url,
      createdAt: item.created_at
    } as any
  }
}

export const customerFollowUpService = new CustomerFollowUpService()

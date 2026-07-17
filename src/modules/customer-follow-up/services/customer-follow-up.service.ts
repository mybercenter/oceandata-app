import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { mockCustomerFollowUps } from '../mock/customer-follow-up.mock'
import { customerService } from '../../customer/services/customer.service'

class CustomerFollowUpService {
  private followUps: CustomerFollowUp[] = [...mockCustomerFollowUps]

  private delay(ms = 600): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getFollowUps(customerId?: string | number): Promise<CustomerFollowUp[]> {
    await this.delay()
    if (customerId) {
      return this.followUps.filter(f => f.customerId === customerId)
    }
    return [...this.followUps]
  }

  async createFollowUp(data: Partial<CustomerFollowUp>): Promise<CustomerFollowUp> {
    await this.delay(1000)
    
    if (!data.customerId) throw new Error('Customer ID is required')
    if (!data.dedicate) throw new Error('Dedicate is required')
    if (!data.templateUsed) throw new Error('Template is required')
    if (!data.followUpDate) throw new Error('Follow Up Date is required')

    // Fetch customer to attach and also to update their current conversion
    const customer = await customerService.show(data.customerId)

    const newFollowUp: CustomerFollowUp = {
      ...data,
      id: 'fu' + Date.now(),
      customerId: data.customerId,
      customer,
      employeeId: customer.employee_id,
      employee: customer.employee,
      dedicate: data.dedicate as 'AV' | 'HA',
      templateUsed: data.templateUsed,
      whatsappMessage: data.whatsappMessage || '',
      followUpDate: data.followUpDate,
      conversion: (data as any).conversion,
      customerStatus: (data as any).customerStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any
    
    this.followUps.unshift(newFollowUp)

    // Automatically update the main customer record to reflect the new conversion/status
    const updateData: any = {
      latest_follow_up: { follow_up_date: data.followUpDate }
    }
    if ((data as any).conversion) {
      updateData.current_conversion = (data as any).conversion
    }
    if ((data as any).customerStatus) {
      updateData.customer_status = (data as any).customerStatus
    }
    await customerService.update(data.customerId, updateData)

    return { ...newFollowUp }
  }

  async updateFollowUp(id: string, data: Partial<CustomerFollowUp>): Promise<CustomerFollowUp> {
    await this.delay(400)
    const index = this.followUps.findIndex(f => f.id === id)
    if (index === -1) throw new Error('Follow up not found')
    this.followUps[index] = { ...this.followUps[index], ...data, updatedAt: new Date().toISOString() }
    return { ...this.followUps[index] }
  }

  async openWhatsapp(phone: string, message: string): Promise<boolean> {
    await this.delay(300)
    // Clean phone number (remove +, -, spaces, etc.)
    const cleanPhone = phone.replace(/\D/g, '')
    // Format to international format if starts with 0
    let formattedPhone = cleanPhone
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1)
    }
    
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    return true
  }
}

export const customerFollowUpService = new CustomerFollowUpService()

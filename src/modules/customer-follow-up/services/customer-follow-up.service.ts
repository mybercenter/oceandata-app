import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { mockCustomerFollowUps } from '../mock/customer-follow-up.mock'
import { customerService } from '../../customer/services/customer.service'

class CustomerFollowUpService {
  private followUps: CustomerFollowUp[] = [...mockCustomerFollowUps]

  private delay(ms = 600): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getFollowUps(customerId?: string): Promise<CustomerFollowUp[]> {
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
    if (!data.conversion) throw new Error('Conversion is required')
    if (!data.customerStatus) throw new Error('Customer Status is required')

    // Fetch customer to attach and also to update their current conversion
    const customer = await customerService.getCustomer(data.customerId)

    const newFollowUp: CustomerFollowUp = {
      ...data,
      id: 'fu' + Date.now(),
      customerId: data.customerId,
      customer,
      employeeId: customer.employeeId,
      employee: customer.employee,
      dedicate: data.dedicate as 'AV' | 'HA',
      templateUsed: data.templateUsed,
      whatsappMessage: data.whatsappMessage || '',
      followUpDate: data.followUpDate,
      conversion: data.conversion,
      customerStatus: data.customerStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.followUps.unshift(newFollowUp)

    // Automatically update the main customer record to reflect the new conversion/status
    await customerService.updateCustomer(data.customerId, {
      currentConversion: data.conversion,
      customerStatus: data.customerStatus,
      lastFollowUp: data.followUpDate
    })

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
    console.log('Opening WhatsApp for', phone, 'Message:', message)
    return true
  }
}

export const customerFollowUpService = new CustomerFollowUpService()

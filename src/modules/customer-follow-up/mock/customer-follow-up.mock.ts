import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { mockCustomers } from '../../customer/mock/customer.mock'
import { mockEmployees } from '../../employee/mock/employee.mock'
import type { Conversion, CustomerStatus } from '../../customer/types/customer.types'

export const mockCustomerFollowUps: CustomerFollowUp[] = []

let idCounter = 1

// We'll generate a few follow-up records for some customers
mockCustomers.slice(0, 50).forEach(customer => {
  const count = Math.floor(Math.random() * 3) + 1 // 1 to 3 follow ups
  
  let lastDate = new Date(customer.customerDate)
  
  for (let i = 0; i < count; i++) {
    lastDate = new Date(lastDate.getTime() + 86400000 * (i + 1))
    if (lastDate > new Date()) lastDate = new Date()
    
    const dedicate: 'AV' | 'HA' = Math.random() > 0.5 ? 'AV' : 'HA'
    const conversions: Conversion[] = ['Potential', 'Prospect', 'Hot Prospect']
    const statuses: CustomerStatus[] = ['Inquiry', 'Purchased']
    
    const conversion = conversions[Math.floor(Math.random() * conversions.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    mockCustomerFollowUps.push({
      id: 'fu' + idCounter++,
      customerId: customer.id,
      customer,
      employeeId: customer.employeeId,
      employee: customer.employee,
      followUpDate: lastDate.toISOString(),
      dedicate,
      templateUsed: 'Template ' + (Math.floor(Math.random() * 3) + 1),
      whatsappMessage: 'Halo ' + customer.fullName + ', kami dari OceanData...',
      conversion,
      customerStatus: status,
      evidence: Math.random() > 0.5 ? '/mock-evidence.jpg' : undefined,
      notes: 'Follow up ke-' + (i+1) + '. Pelanggan sangat antusias.',
      createdAt: lastDate.toISOString(),
      updatedAt: lastDate.toISOString()
    })
  }
})

mockCustomerFollowUps.sort((a, b) => new Date(b.followUpDate).getTime() - new Date(a.followUpDate).getTime())

import type { Customer, Conversion, CustomerStatus } from '../../customer/types/customer.types'
import type { Employee } from '../../employee/types/employee.types'

export interface CustomerFollowUp {
  id: string
  customerId: string
  customer?: Customer
  employeeId: string
  employee?: Employee
  followUpDate: string
  dedicate: 'AV' | 'HA'
  templateUsed: string // 'Template 1', 'Free Text', etc.
  whatsappMessage: string
  evidence?: string // mock url
  notes?: string
  createdAt: string
  updatedAt: string
}

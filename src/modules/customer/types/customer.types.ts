import type { Employee } from '../../employee/types/employee.types'

export type Gender = 'Male' | 'Female'
export type CustomerStatus = 'Inquiry' | 'Purchased'
export type Conversion = 'Potential' | 'Prospect' | 'Hot Prospect'

export interface Customer {
  id: string
  employeeId: string
  employee?: Employee
  customerDate: string
  fullName: string
  gender?: Gender
  phone?: string
  socialMedia?: string
  product?: string
  quantity?: number
  currentConversion: Conversion
  customerStatus: CustomerStatus
  isActive: boolean
  lastFollowUp?: string
  createdAt: string
  updatedAt: string
}

export interface FollowUpHistory {
  id: string
  customerId: string
  employeeId: string
  employee?: Employee
  date: string
  conversion: Conversion
  notes: string
  evidence?: string
}

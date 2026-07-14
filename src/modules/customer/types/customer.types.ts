import type { Employee } from '../../employee/types/employee.types'

export type Gender = 'Male' | 'Female'
export type CustomerStatus = 'Inquiry' | 'Purchased'
export type Conversion = 'Potential' | 'Prospect' | 'Hot Prospect'

export interface Customer {
  id: number | string
  employee_id?: number | string
  employee?: Employee
  customer_date: string
  full_name: string
  gender?: Gender
  phone?: string
  social_media?: string
  product?: string
  quantity?: number
  current_conversion: Conversion
  customer_status: CustomerStatus
  is_active: boolean
  follow_up_count?: number
  latest_follow_up?: {
    id: number
    follow_up_date: string
    is_contacted: boolean
  } | null
  created_at?: string
  updated_at?: string
}

export interface FollowUpHistory {
  id: number | string
  customer_id: number | string
  employee_id: number | string
  employee?: Employee
  follow_up_date: string
  conversion: Conversion
  is_contacted: boolean
  notes: string
  evidence?: string
}

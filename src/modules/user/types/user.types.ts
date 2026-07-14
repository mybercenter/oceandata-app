import type { Employee } from '../../employee/types/employee.types'

export interface User {
  id: string
  employee_id: string
  employee?: Employee // Hydrated for display
  username: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

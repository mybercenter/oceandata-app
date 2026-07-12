import type { Employee } from '../../employee/types/employee.types'

export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  employeeId: string
  employee?: Employee // Hydrated for display
  username: string
  status: UserStatus
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

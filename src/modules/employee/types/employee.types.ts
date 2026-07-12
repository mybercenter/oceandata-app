import type { Area } from '../../area/types/area.types'
import type { Store } from '../../store/types/store.types'
import type { Role } from '../../role/types/role.types'

export type DedicateType = 'AV' | 'HA' | 'Hybrid'
export type EmployeeStatus = 'active' | 'inactive'

export interface Employee {
  id: string
  employeeCode: string
  fullName: string
  roleId: string
  role?: Role
  areaIds: string[]
  areas?: Area[]
  storeId?: string
  store?: Store
  phone: string
  email: string
  dedicate?: DedicateType
  status: EmployeeStatus
  createdAt: string
  updatedAt: string
  stats: {
    totalCustomers: number
    followUps: number
    purchasedCustomers: number
  }
}

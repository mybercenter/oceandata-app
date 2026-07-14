import type { Area } from '../../area/types/area.types'
import type { Store } from '../../store/types/store.types'
import type { Role } from '../../role/types/role.types'

export type DedicateType = 'AV' | 'HA' | 'Hybrid'

export interface Employee {
  id: string
  employee_code: string
  full_name: string
  role_id: string
  role?: Role
  areas?: Area[]
  store_id?: string
  store?: Store
  phone: string
  email: string
  dedicate?: DedicateType
  is_active: boolean
  created_at: string
  updated_at: string
  stats?: {
    totalCustomers: number
    followUps: number
    purchasedCustomers: number
  }
}

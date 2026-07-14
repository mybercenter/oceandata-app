import type { Area } from '../../area/types/area.types'

export interface Store {
  id: string
  code: string
  name: string
  area_id: string
  area?: Area // Hydrated relation
  address: string
  is_active: boolean
  created_at: string
  updated_at: string
  stats?: {
    totalEmployees: number
    totalCustomers: number
  }
}

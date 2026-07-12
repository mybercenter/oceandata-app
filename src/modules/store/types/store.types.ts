import type { Area } from '../../area/types/area.types'

export type StoreStatus = 'active' | 'inactive' | 'maintenance'

export interface Store {
  id: string
  code: string
  name: string
  areaId: string
  area?: Area // Hydrated relation
  address: string
  status: StoreStatus
  createdAt: string
  updatedAt: string
  stats: {
    totalEmployees: number
    totalCustomers: number
  }
}

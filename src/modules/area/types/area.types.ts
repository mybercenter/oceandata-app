export type AreaStatus = 'active' | 'inactive'

export interface Area {
  id: string
  code: string
  name: string
  status: AreaStatus
  createdAt: string
  updatedAt: string
  stats: {
    totalStores: number
    totalEmployees: number
    totalCustomers: number
  }
}

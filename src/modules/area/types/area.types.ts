export interface Area {
  id: string
  code: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
  stats?: {
    totalStores: number
    totalEmployees: number
    totalCustomers: number
  }
}

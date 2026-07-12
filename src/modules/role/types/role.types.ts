export type RoleStatus = 'active' | 'inactive'

export interface Role {
  id: string
  name: string
  description?: string
  status: RoleStatus
  createdAt: string
  updatedAt: string
}

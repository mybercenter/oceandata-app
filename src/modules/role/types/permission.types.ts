export type ModuleName = 'Dashboard' | 'Area' | 'Store' | 'Employee' | 'Users' | 'Roles' | 'Message Template' | 'Customer' | 'Follow Up' | 'Report' | 'Settings'
export type ActionName = 'View' | 'Create' | 'Update' | 'Delete' | 'Export' | 'Approve'

export interface Permission {
  id: string
  name: string
  module: ModuleName
  action: ActionName
  createdAt: string
  updatedAt: string
}

export interface RolePermission {
  roleId: string
  permissionId: string
}

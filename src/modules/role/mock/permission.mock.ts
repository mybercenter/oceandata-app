import type { Permission, RolePermission, ModuleName, ActionName } from '../types/permission.types'
import { mockRoles } from './role.mock'

const modules: ModuleName[] = ['Dashboard', 'Area', 'Store', 'Employee', 'Users', 'Roles', 'Message Template', 'Customer', 'Follow Up', 'Report', 'Settings']
const actions: ActionName[] = ['View', 'Create', 'Update', 'Delete', 'Export', 'Approve']

export const mockPermissions: Permission[] = []

let pId = 1
modules.forEach(mod => {
  actions.forEach(act => {
    // Some modules don't need all actions, but we'll generate all for a comprehensive matrix
    // Except maybe Dashboard only needs View
    if (mod === 'Dashboard' && act !== 'View') return
    // Report only needs View and Export
    if (mod === 'Report' && !['View', 'Export'].includes(act)) return
    
    mockPermissions.push({
      id: 'p' + pId++,
      name: act + ' ' + mod,
      module: mod,
      action: act,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString()
    })
  })
})

export const mockRolePermissions: RolePermission[] = []

mockRoles.forEach(role => {
  mockPermissions.forEach(perm => {
    let grant = false
    
    switch (role.name) {
      case 'Administrator':
        grant = true // Admins get everything
        break
      case 'Manager':
        if (perm.module !== 'Settings' && perm.module !== 'Roles' && perm.module !== 'Users') {
          if (perm.action !== 'Approve') grant = true
        }
        break
      case 'Supervisor':
        if (['Dashboard', 'Store', 'Employee', 'Customer', 'Follow Up', 'Report'].includes(perm.module)) {
          if (['View', 'Create', 'Update'].includes(perm.action)) grant = true
        }
        break
      case 'Trainer':
        if (['Dashboard', 'Employee'].includes(perm.module)) grant = true
        break
      case 'Sales':
        if (['Dashboard', 'Customer', 'Follow Up'].includes(perm.module)) {
          if (['View', 'Create', 'Update'].includes(perm.action)) grant = true
        }
        break
      case 'Promotor':
        if (['Dashboard', 'Customer'].includes(perm.module)) {
          if (['View', 'Create'].includes(perm.action)) grant = true
        }
        break
    }

    if (grant) {
      mockRolePermissions.push({
        roleId: role.id,
        permissionId: perm.id
      })
    }
  })
})

import type { Permission, RolePermission } from '../types/permission.types'
import { mockPermissions, mockRolePermissions } from '../mock/permission.mock'

class PermissionService {
  private permissions: Permission[] = [...mockPermissions]
  private rolePermissions: RolePermission[] = [...mockRolePermissions]

  private delay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getPermissions(): Promise<Permission[]> {
    await this.delay()
    return [...this.permissions]
  }

  async createPermission(data: Partial<Permission>): Promise<Permission> {
    await this.delay(800)
    if (!data.name || !data.module || !data.action) throw new Error('All fields are required')
    
    const newPerm: Permission = {
      ...data,
      id: 'p' + Date.now(),
      name: data.name,
      module: data.module,
      action: data.action,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.permissions.push(newPerm)
    return { ...newPerm }
  }

  async updatePermission(id: string, data: Partial<Permission>): Promise<Permission> {
    await this.delay(800)
    const index = this.permissions.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Permission not found')

    this.permissions[index] = {
      ...this.permissions[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { ...this.permissions[index] }
  }

  async deletePermission(id: string): Promise<void> {
    await this.delay(600)
    const index = this.permissions.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Permission not found')
    this.permissions.splice(index, 1)
    
    // Cleanup matrix
    this.rolePermissions = this.rolePermissions.filter(rp => rp.permissionId !== id)
  }

  // MATRIX RELATED
  async getRolePermissions(roleId: string): Promise<string[]> {
    await this.delay(400)
    return this.rolePermissions.filter(rp => rp.roleId === roleId).map(rp => rp.permissionId)
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await this.delay(1000)
    // Remove old ones
    this.rolePermissions = this.rolePermissions.filter(rp => rp.roleId !== roleId)
    // Add new ones
    permissionIds.forEach(pid => {
      this.rolePermissions.push({ roleId, permissionId: pid })
    })
  }
}

export const permissionService = new PermissionService()

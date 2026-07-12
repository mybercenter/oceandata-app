import type { Role } from '../types/role.types'
import { mockRoles } from '../mock/role.mock'
import { mockRolePermissions } from '../mock/permission.mock'
import { mockEmployees } from '../../employee/mock/employee.mock'
import { mockUsers } from '../../user/mock/user.mock'

class RoleService {
  private roles: Role[] = [...mockRoles]

  private delay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getRoles(): Promise<(Role & { permissionsCount: number })[]> {
    await this.delay()
    return this.roles.map(r => {
      const count = mockRolePermissions.filter(rp => rp.roleId === r.id).length
      return { ...r, permissionsCount: count }
    })
  }

  async getRole(id: string): Promise<Role> {
    await this.delay(400)
    const role = this.roles.find(r => r.id === id)
    if (!role) throw new Error('Role not found')
    return { ...role }
  }

  async getRoleStats(id: string): Promise<{ employees: number, users: number, permissions: number }> {
    await this.delay(300)
    const employees = mockEmployees.filter(e => e.roleId === id).length
    const users = mockUsers.filter(u => u.employee?.roleId === id).length
    const permissions = mockRolePermissions.filter(rp => rp.roleId === id).length
    return { employees, users, permissions }
  }

  async createRole(data: Partial<Role>): Promise<Role> {
    await this.delay(1000)
    if (!data.name) throw new Error('Role name is required')
    
    const newRole: Role = {
      ...data,
      id: 'r' + Date.now(),
      name: data.name,
      description: data.description || '',
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.roles.unshift(newRole)
    return { ...newRole }
  }

  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    await this.delay(1000)
    const index = this.roles.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Role not found')

    this.roles[index] = {
      ...this.roles[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { ...this.roles[index] }
  }

  async deleteRole(id: string): Promise<void> {
    await this.delay(800)
    const index = this.roles.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Role not found')
    this.roles.splice(index, 1)
  }
}

export const roleService = new RoleService()

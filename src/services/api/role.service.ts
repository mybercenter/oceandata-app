import { BaseApiService } from './base.service'
import http from '@/shared/services/http'

class RoleApiService extends BaseApiService {
  async getPermissions(id: string | number) {
    const response = await http.get(`${this.endpoint}/${id}/permissions`)
    return response.data.data
  }

  async syncPermissions(id: string | number, permissionIds: (string | number)[]) {
    const response = await http.put(`${this.endpoint}/${id}/permissions`, { permissions: permissionIds })
    return response.data.data
  }

  async getRoleStats(id: string | number) {
    // For now return dummy stats as API may not have it
    // TODO: Connect to real API when ready
    return { employees: 0, users: 0, permissions: 0 }
  }
}

export const roleService = new RoleApiService('/roles')

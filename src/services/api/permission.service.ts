import { BaseApiService } from './base.service'
import http from '@/shared/services/http'

class PermissionApiService extends BaseApiService {
  async getRolePermissions(roleId: string | number) {
    const response = await http.get(`/roles/${roleId}/permissions`)
    return response.data.data
  }
  
  async updateRolePermissions(roleId: string | number, permissionIds: string[]) {
    const response = await http.post(`/roles/${roleId}/permissions`, { permissions: permissionIds })
    return response.data.data
  }
}

export const permissionService = new PermissionApiService('/permissions')

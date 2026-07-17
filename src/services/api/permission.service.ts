import { BaseApiService } from './base.service'
import http from '@/shared/services/http'

class PermissionApiService extends BaseApiService {
  async getRolePermissions(roleId: string | number) {
    const response = await http.get(`/roles/${roleId}/permissions`)
    let data = response.data.data !== undefined ? response.data.data : response.data
    
    // Sometimes Laravel wraps it again in `data` (e.g. paginated or resource collection)
    if (data && Array.isArray(data.data)) {
      data = data.data
    } else if (data && data.permissions) {
      data = data.permissions
    }
    
    const arr = Array.isArray(data) ? data : (data ? Object.values(data) : [])
    // Ensure we return an array of strings (permission IDs) to avoid Set type mismatches
    return arr.map((item: any) => {
      const id = typeof item === 'object' ? (item.permissionId || item.permission_id || item.id) : item
      return id !== undefined && id !== null ? String(id) : id
    })
  }
  
  async updateRolePermissions(roleId: string | number, permissionIds: string[]) {
    const response = await http.post(`/roles/${roleId}/permissions`, { permissions: permissionIds })
    return response.data.data
  }
}

export const permissionService = new PermissionApiService('/permissions')

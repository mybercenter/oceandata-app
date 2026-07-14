import { BaseApiService } from './base.service'
import http from '@/shared/services/http'

class UserApiService extends BaseApiService {
  async resetPassword(id: string | number, payload: any) {
    const response = await http.patch(`${this.endpoint}/${id}/reset-password`, payload)
    return response.data.data
  }
}

export const userService = new UserApiService('/users')

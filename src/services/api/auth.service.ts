import http from '@/shared/services/http'

class AuthApiService {
  async forgotPassword(email: string) {
    // const response = await http.post('/auth/forgot-password', { email })
    // return response.data
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async resetPassword(data: any = {}) {
    // const response = await http.post('/auth/reset-password', data)
    // return response.data
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

export const authService = new AuthApiService()

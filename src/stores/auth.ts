import { defineStore } from 'pinia'
import http from '@/shared/services/http'

interface AuthState {
  user: any | null
  employee: any | null
  permissions: string[]
  areas: any[]
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    employee: null,
    permissions: [],
    areas: [],
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false
  }),
  
  actions: {
    async login(credentials: any) {
      this.loading = true
      try {
        const response = await http.post('/auth/login', credentials)
        const { data } = response.data
        
        this.setAuthData(data)
        return data
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      try {
        await http.post('/auth/logout')
      } catch (error) {
        console.error('Logout failed on backend:', error)
      } finally {
        this.clearAuth()
      }
    },
    
    async fetchProfile() {
      this.loading = true
      try {
        const response = await http.get('/auth/me')
        const { data } = response.data
        
        this.setAuthData(data)
        return data
      } catch (error) {
        this.clearAuth()
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async checkAuth() {
      if (!this.token) {
        this.clearAuth()
        return false
      }
      
      // If we already have the user, no need to fetch again
      if (this.user) {
        return true
      }
      
      try {
        await this.fetchProfile()
        return true
      } catch (error) {
        return false
      }
    },
    
    setAuthData(data: any) {
      this.user = data.user
      this.employee = data.employee
      this.permissions = data.permissions || []
      this.areas = data.areas || []
      
      if (data.token) {
        this.token = data.token
        localStorage.setItem('token', data.token)
      }
      
      this.isAuthenticated = true
    },
    
    clearAuth() {
      this.user = null
      this.employee = null
      this.permissions = []
      this.areas = []
      this.token = null
      this.isAuthenticated = false
      
      localStorage.removeItem('token')
    }
  }
})

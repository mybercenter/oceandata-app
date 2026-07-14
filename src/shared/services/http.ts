import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { useToast } from '../composables/useToast'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
})

// Request Interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const toast = useToast()
    
    // Network or Timeout errors
    if (!error.response) {
      toast.error('Network Error', 'Please check your connection and try again.')
      return Promise.reject(error)
    }

    const status = error.response.status
    const data: any = error.response.data

    switch (status) {
      case 401:
        // Unauthorized
        const authStore = useAuthStore()
        authStore.clearAuth()
        router.push({ name: 'login' })
        toast.error('Session Expired', 'Please log in again.')
        break
      case 403:
        // Forbidden
        router.push({ name: 'error-403' })
        break
      case 500:
        // Server Error
        toast.error('Server Error', data.message || 'An unexpected error occurred. Please try again later.')
        break
      default:
        // Other errors can be handled locally by the caller
        break
    }

    return Promise.reject(error)
  }
)

export default http

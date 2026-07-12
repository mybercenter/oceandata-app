import type { AuthResponse, User } from '../types/auth.types'
import { mockUsers } from '../mock/auth.mock'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const authService = {
  async login(username: string): Promise<AuthResponse> {
    await delay(1000)
    
    const user = mockUsers.find(u => u.username === username.toLowerCase())
    
    if (!user) {
      throw new Error('Invalid username or password')
    }
    
    return {
      user,
      token: `mock-jwt-token-${Date.now()}`
    }
  },
  
  async forgotPassword(email: string): Promise<void> {
    await delay(1000)
    if (!email) throw new Error('Email is required')
  },
  
  async resetPassword(): Promise<void> {
    await delay(1500)
  }
}

import type { User } from '../types/user.types'
import { mockUsers } from '../mock/user.mock'
import { mockEmployees } from '../../employee/mock/employee.mock'
import type { Employee } from '../../employee/types/employee.types'

class UserService {
  private users: User[] = [...mockUsers]

  private delay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getUsers(): Promise<User[]> {
    await this.delay()
    return [...this.users]
  }

  async getUser(id: string): Promise<User> {
    await this.delay(400)
    const user = this.users.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    return { ...user }
  }

  // Returns employees who do not have an associated user account
  async getUnregisteredEmployees(): Promise<Employee[]> {
    await this.delay(500)
    const registeredIds = new Set(this.users.map(u => u.employeeId))
    return mockEmployees.filter(emp => !registeredIds.has(emp.id))
  }

  async createUser(data: Partial<User>): Promise<User> {
    await this.delay(1000)
    
    // Validations
    if (!data.employeeId) throw new Error('Employee is required')
    if (!data.username) throw new Error('Username is required')
    
    const existingUsername = this.users.find(u => u.username.toLowerCase() === data.username?.toLowerCase())
    if (existingUsername) {
      throw new Error('Username already exists')
    }
    
    const existingAccount = this.users.find(u => u.employeeId === data.employeeId)
    if (existingAccount) {
      throw new Error('This employee already has a user account')
    }

    const emp = mockEmployees.find(e => e.id === data.employeeId)

    const newUser: User = {
      ...data,
      id: 'usr' + Date.now(),
      employeeId: data.employeeId,
      employee: emp,
      username: data.username,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.users.unshift(newUser)
    return { ...newUser }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await this.delay(1000)
    
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')

    if (data.username) {
      const existingUsername = this.users.find(u => u.username.toLowerCase() === data.username?.toLowerCase() && u.id !== id)
      if (existingUsername) {
        throw new Error('Username already exists')
      }
    }

    this.users[index] = {
      ...this.users[index],
      ...data,
      updatedAt: new Date().toISOString()
    }

    return { ...this.users[index] }
  }

  async deleteUser(id: string): Promise<void> {
    await this.delay(800)
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    this.users.splice(index, 1)
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await this.delay(1200)
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    // In a real app, this would hash and save the password.
    // Since this is mock frontend, we just return success.
  }
}

export const userService = new UserService()

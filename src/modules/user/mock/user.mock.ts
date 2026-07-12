import type { User, UserStatus } from '../types/user.types'
import { mockEmployees } from '../../employee/mock/employee.mock'

const generateDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const generateUsers = (count: number): User[] => {
  const users: User[] = []
  
  // We want to create accounts for only the first count employees
  // so there are some employees left without accounts
  const selectedEmployees = mockEmployees.slice(0, count)
  
  for (let i = 0; i < selectedEmployees.length; i++) {
    const emp = selectedEmployees[i]
    
    // Generate username from email or full name
    const username = emp.email ? emp.email.split('@')[0] : emp.fullName.toLowerCase().replace(/\s+/g, '.')
    
    // Random last login
    let lastLogin: string | undefined
    const rand = Math.random()
    if (rand > 0.8) {
      lastLogin = undefined // Never logged in
    } else if (rand > 0.6) {
      lastLogin = generateDate(0) // Today
    } else if (rand > 0.4) {
      lastLogin = generateDate(1) // Yesterday
    } else {
      lastLogin = generateDate(Math.floor(Math.random() * 10) + 2) // > 2 days ago
    }
    
    users.push({
      id: 'usr' + (i + 1),
      employeeId: emp.id,
      employee: { ...emp }, // Hydrated
      username: username,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      lastLogin: lastLogin,
      createdAt: generateDate(Math.floor(Math.random() * 100) + 10),
      updatedAt: generateDate(Math.floor(Math.random() * 10))
    })
  }
  
  return users
}

export const mockUsers: User[] = generateUsers(30)

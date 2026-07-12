export type Role = 'Administrator' | 'Manager' | 'Supervisor' | 'Trainer' | 'Sales' | 'Promotor'

export interface User {
  id: string
  name: string
  email: string
  username: string
  role: Role
  avatar?: string
}

export interface AuthResponse {
  user: User
  token: string
}

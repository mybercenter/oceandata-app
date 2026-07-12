import type { User } from '../types/auth.types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@oceandata.com',
    username: 'admin',
    role: 'Administrator',
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@oceandata.com',
    username: 'manager',
    role: 'Manager',
  },
  {
    id: '3',
    name: 'Supervisor User',
    email: 'supervisor@oceandata.com',
    username: 'supervisor',
    role: 'Supervisor',
  },
  {
    id: '4',
    name: 'Trainer User',
    email: 'trainer@oceandata.com',
    username: 'trainer',
    role: 'Trainer',
  },
  {
    id: '5',
    name: 'Sales User',
    email: 'sales@oceandata.com',
    username: 'sales',
    role: 'Sales',
  },
  {
    id: '6',
    name: 'Promotor User',
    email: 'promotor@oceandata.com',
    username: 'promotor',
    role: 'Promotor',
  }
]

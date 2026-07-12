import type { Role } from '../types/role.types'

export const mockRoles: Role[] = [
  { 
    id: 'r1', 
    name: 'Administrator', 
    description: 'Full system access including user and role management.',
    status: 'active',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  { 
    id: 'r2', 
    name: 'Manager', 
    description: 'Can view and manage all operations within assigned areas.',
    status: 'active',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString()
  },
  { 
    id: 'r3', 
    name: 'Supervisor', 
    description: 'Can manage store operations and view specific reports.',
    status: 'active',
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString()
  },
  { 
    id: 'r4', 
    name: 'Trainer', 
    description: 'Manages employee training materials and schedules.',
    status: 'active',
    createdAt: new Date('2024-01-04').toISOString(),
    updatedAt: new Date('2024-01-04').toISOString()
  },
  { 
    id: 'r5', 
    name: 'Sales', 
    description: 'Focuses on customer acquisition and follow-ups.',
    status: 'active',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString()
  },
  { 
    id: 'r6', 
    name: 'Promotor', 
    description: 'Dedicated store promotor with limited system access.',
    status: 'active',
    createdAt: new Date('2024-01-06').toISOString(),
    updatedAt: new Date('2024-01-06').toISOString()
  }
]

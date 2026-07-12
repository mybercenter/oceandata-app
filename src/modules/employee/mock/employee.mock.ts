import type { Employee, DedicateType, EmployeeStatus } from '../types/employee.types'
import { mockRoles } from '../../role/mock/role.mock'
import { mockAreas } from '../../area/mock/area.mock'
import { mockStores } from '../../store/mock/store.mock'

const generateDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const firstNames = ['Budi', 'Siti', 'Agus', 'Sri', 'Ahmad', 'Rina', 'Joko', 'Dewi', 'Arief', 'Lestari', 'Eko', 'Wahyu', 'Tri', 'Indra', 'Fitri', 'Bambang', 'Nur', 'Hendro', 'Yanti', 'Hadi']
const lastNames = ['Santoso', 'Wijaya', 'Kusuma', 'Pratama', 'Putra', 'Setiawan', 'Nugroho', 'Hidayat', 'Saputra', 'Wahyudi', 'Gunawan', 'Sari', 'Wibowo', 'Prabowo', 'Susanto', 'Purnama']

const generateEmployees = (count: number): Employee[] => {
  const employees: Employee[] = []
  
  for (let i = 1; i <= count; i++) {
    const role = mockRoles[Math.floor(Math.random() * mockRoles.length)]
    
    // Logic for Areas and Stores based on Role
    let assignedAreaIds: string[] = []
    let assignedStoreId: string | undefined = undefined
    let assignedDedicate: DedicateType | undefined = undefined
    
    if (role.name === 'Promotor') {
      const area = mockAreas[Math.floor(Math.random() * mockAreas.length)]
      assignedAreaIds = [area.id]
      const areaStores = mockStores.filter(s => s.areaId === area.id)
      if (areaStores.length > 0) {
        assignedStoreId = areaStores[Math.floor(Math.random() * areaStores.length)].id
      } else {
        assignedStoreId = mockStores[Math.floor(Math.random() * mockStores.length)].id
      }
      const dedicates: DedicateType[] = ['AV', 'HA', 'Hybrid']
      assignedDedicate = dedicates[Math.floor(Math.random() * dedicates.length)]
    } else if (role.name === 'Administrator') {
      // Maybe one area or empty
      if (Math.random() > 0.5) {
        assignedAreaIds = [mockAreas[Math.floor(Math.random() * mockAreas.length)].id]
      }
    } else {
      // Manager, Supervisor, Trainer, Sales can have multiple areas
      const numAreas = Math.floor(Math.random() * 3) + 1
      const shuffledAreas = [...mockAreas].sort(() => 0.5 - Math.random())
      assignedAreaIds = shuffledAreas.slice(0, numAreas).map(a => a.id)
      
      // Store optional
      if (Math.random() > 0.7) {
        const areaStores = mockStores.filter(s => assignedAreaIds.includes(s.areaId))
        if (areaStores.length > 0) {
          assignedStoreId = areaStores[Math.floor(Math.random() * areaStores.length)].id
        }
      }
    }
    
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const fullName = fName + ' ' + lName
    
    employees.push({
      id: 'emp' + i,
      employeeCode: 'EMP' + String(i).padStart(4, '0'),
      fullName: fullName,
      roleId: role.id,
      role: { ...role },
      areaIds: assignedAreaIds,
      areas: mockAreas.filter(a => assignedAreaIds.includes(a.id)),
      storeId: assignedStoreId,
      store: assignedStoreId ? mockStores.find(s => s.id === assignedStoreId) : undefined,
      phone: '08' + Math.floor(Math.random() * 900000000 + 100000000),
      email: fName.toLowerCase() + '.' + lName.toLowerCase() + '@oceandata.com',
      dedicate: assignedDedicate,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      createdAt: generateDate(Math.floor(Math.random() * 365)),
      updatedAt: generateDate(Math.floor(Math.random() * 30)),
      stats: {
        totalCustomers: Math.floor(Math.random() * 500),
        followUps: Math.floor(Math.random() * 100),
        purchasedCustomers: Math.floor(Math.random() * 50)
      }
    })
  }
  
  return employees
}

export const mockEmployees: Employee[] = generateEmployees(50)


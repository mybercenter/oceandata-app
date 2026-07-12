import type { Employee } from '../types/employee.types'
import { mockRoles } from '../../role/mock/role.mock'
import { mockEmployees } from '../mock/employee.mock'
import { mockAreas } from '../../area/mock/area.mock'
import { mockStores } from '../../store/mock/store.mock'

class EmployeeService {
  private employees: Employee[] = [...mockEmployees]

  private delay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getEmployees(): Promise<Employee[]> {
    await this.delay()
    return [...this.employees]
  }

  async getEmployee(id: string): Promise<Employee> {
    await this.delay(400)
    const emp = this.employees.find(e => e.id === id)
    if (!emp) throw new Error('Employee not found')
    return { ...emp }
  }

  async createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): Promise<Employee> {
    await this.delay(1000)
    
    const existingCode = this.employees.find(e => e.employeeCode.toLowerCase() === data.employeeCode.toLowerCase())
    if (existingCode) {
      throw new Error('Employee code already exists')
    }

    const newEmp: Employee = {
      ...data,
      id: 'emp' + Date.now(),
      role: mockRoles.find(r => r.id === data.roleId),
      areas: data.areaIds ? mockAreas.filter(a => data.areaIds.includes(a.id)) : [],
      store: data.storeId ? mockStores.find(s => s.id === data.storeId) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalCustomers: 0,
        followUps: 0,
        purchasedCustomers: 0
      }
    }
    
    this.employees.unshift(newEmp)
    return { ...newEmp }
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    await this.delay(1000)
    
    const index = this.employees.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Employee not found')

    if (data.employeeCode) {
      const existingCode = this.employees.find(e => e.employeeCode.toLowerCase() === data.employeeCode?.toLowerCase() && e.id !== id)
      if (existingCode) {
        throw new Error('Employee code already exists')
      }
    }

    const updatedData = { ...data }
    if (data.roleId) updatedData.role = mockRoles.find(r => r.id === data.roleId)
    if (data.areaIds) updatedData.areas = mockAreas.filter(a => data.areaIds?.includes(a.id))
    if (data.storeId) updatedData.store = mockStores.find(s => s.id === data.storeId)

    this.employees[index] = {
      ...this.employees[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    }

    return { ...this.employees[index] }
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.delay(800)
    const index = this.employees.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Employee not found')
    this.employees.splice(index, 1)
  }
}

export const employeeService = new EmployeeService()

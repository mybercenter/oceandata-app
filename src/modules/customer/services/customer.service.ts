import type { Customer, FollowUpHistory } from '../types/customer.types'
import { mockCustomers, mockFollowUpHistory } from '../mock/customer.mock'
import { mockEmployees } from '../../employee/mock/employee.mock'

class CustomerService {
  private customers: Customer[] = [...mockCustomers]
  private history: FollowUpHistory[] = [...mockFollowUpHistory]

  private delay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getCustomers(): Promise<Customer[]> {
    await this.delay()
    return [...this.customers]
  }

  async getCustomer(id: string): Promise<Customer> {
    await this.delay(400)
    const cust = this.customers.find(c => c.id === id)
    if (!cust) throw new Error('Customer not found')
    return { ...cust }
  }

  async getCustomerHistory(customerId: string): Promise<FollowUpHistory[]> {
    await this.delay(400)
    return this.history.filter(h => h.customerId === customerId)
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    await this.delay(1000)
    
    if (!data.fullName) throw new Error('Customer Name is required')
    if (!data.customerDate) throw new Error('Customer Date is required')
    if (!data.employeeId) throw new Error('Assigned Employee is required')

    const employee = mockEmployees.find(e => e.id === data.employeeId)

    const newCust: Customer = {
      ...data,
      id: 'c' + Date.now(),
      employeeId: data.employeeId,
      employee,
      customerDate: data.customerDate,
      fullName: data.fullName,
      currentConversion: data.currentConversion || 'Potential',
      customerStatus: data.customerStatus || 'Inquiry',
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Customer
    
    this.customers.unshift(newCust)
    return { ...newCust }
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    await this.delay(1000)
    const index = this.customers.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Customer not found')

    if (data.fullName === '') throw new Error('Customer Name is required')
    if (data.customerDate === '') throw new Error('Customer Date is required')

    const employee = data.employeeId ? mockEmployees.find(e => e.id === data.employeeId) : this.customers[index].employee
    
    this.customers[index] = {
      ...this.customers[index],
      ...data,
      employee,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.customers[index] }
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.delay(800)
    const index = this.customers.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Customer not found')
    this.customers.splice(index, 1)
  }
}

export const customerService = new CustomerService()

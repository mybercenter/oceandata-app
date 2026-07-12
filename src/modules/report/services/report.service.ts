import type { ReportFilter, EmployeePerformance, AreaPerformance, DashboardMetrics } from '../types/report.types'
import { mockCustomers } from '../../customer/mock/customer.mock'
import { mockCustomerFollowUps } from '../../customer-follow-up/mock/customer-follow-up.mock'
import { mockEmployees } from '../../employee/mock/employee.mock'
import { mockAreas } from '../../area/mock/area.mock'
import { mockStores } from '../../store/mock/store.mock'
import type { Customer } from '../../customer/types/customer.types'
import type { CustomerFollowUp } from '../../customer-follow-up/types/customer-follow-up.types'

class ReportService {
  private delay(ms = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Helper to filter data based on UI filter panel
  private applyFilters<T extends { employeeId?: string, customerDate?: string, followUpDate?: string }>(data: T[], filters: ReportFilter): T[] {
    return data.filter(item => {
      // 1. Employee Filter
      if (filters.employeeId && item.employeeId !== filters.employeeId) return false
      
      // 2. Date Range Filter
      const dateStr = item.customerDate || item.followUpDate
      if (dateStr && filters.startDate && filters.endDate) {
        const d = new Date(dateStr)
        const start = new Date(filters.startDate)
        const end = new Date(filters.endDate)
        end.setHours(23, 59, 59, 999)
        if (d < start || d > end) return false
      }
      return true
    })
  }

  async getDashboardMetrics(filters: ReportFilter = {}): Promise<DashboardMetrics> {
    await this.delay()
    const customers = this.applyFilters(mockCustomers, filters)
    
    // Detailed Status filter
    const filteredCustomers = customers.filter(c => {
      if (filters.customerStatus && c.customerStatus !== filters.customerStatus) return false
      if (filters.conversion && c.currentConversion !== filters.conversion) return false
      return true
    })

    const inquiry = filteredCustomers.filter(c => c.customerStatus === 'Inquiry').length
    const purchased = filteredCustomers.filter(c => c.customerStatus === 'Purchased').length
    const totalCustomers = filteredCustomers.length

    return {
      totalCustomers,
      inquiry,
      purchased,
      potential: filteredCustomers.filter(c => c.currentConversion === 'Potential').length,
      prospect: filteredCustomers.filter(c => c.currentConversion === 'Prospect').length,
      hotProspect: filteredCustomers.filter(c => c.currentConversion === 'Hot Prospect').length,
      totalFollowUps: this.applyFilters(mockCustomerFollowUps, filters).length,
      conversionRate: totalCustomers === 0 ? 0 : Math.round((purchased / totalCustomers) * 100)
    }
  }

  async getCustomerReport(filters: ReportFilter = {}): Promise<Customer[]> {
    await this.delay(300)
    return this.applyFilters(mockCustomers, filters).filter(c => {
      if (filters.customerStatus && c.customerStatus !== filters.customerStatus) return false
      if (filters.conversion && c.currentConversion !== filters.conversion) return false
      if (filters.storeId && c.employee?.storeId !== filters.storeId) return false
      return true
    })
  }

  async getFollowUpReport(filters: ReportFilter = {}): Promise<CustomerFollowUp[]> {
    await this.delay(300)
    return this.applyFilters(mockCustomerFollowUps, filters).filter(f => {
      if (filters.customerStatus && f.customerStatus !== filters.customerStatus) return false
      if (filters.conversion && f.conversion !== filters.conversion) return false
      if (filters.dedicate && f.dedicate !== filters.dedicate) return false
      if (filters.storeId && f.employee?.storeId !== filters.storeId) return false
      return true
    })
  }

  async getEmployeePerformance(filters: ReportFilter = {}): Promise<EmployeePerformance[]> {
    await this.delay(600)
    const result: EmployeePerformance[] = []
    
    // Filter employees by area/store if needed
    let employees = mockEmployees
    if (filters.storeId) employees = employees.filter(e => e.storeId === filters.storeId)

    for (const emp of employees) {
      const empCustomers = mockCustomers.filter(c => c.employeeId === emp.id)
      const empFollowUps = mockCustomerFollowUps.filter(f => f.employeeId === emp.id)
      
      const purchased = empCustomers.filter(c => c.customerStatus === 'Purchased').length
      const total = empCustomers.length

      result.push({
        employee: emp,
        totalCustomers: total,
        inquiry: empCustomers.filter(c => c.customerStatus === 'Inquiry').length,
        purchased,
        totalFollowUps: empFollowUps.length,
        conversionRate: total === 0 ? 0 : Math.round((purchased / total) * 100)
      })
    }
    return result.sort((a, b) => b.totalCustomers - a.totalCustomers)
  }

  async getAreaPerformance(filters: ReportFilter = {}): Promise<AreaPerformance[]> {
    await this.delay(600)
    const result: AreaPerformance[] = []
    
    for (const area of mockAreas) {
      const stores = mockStores.filter(s => s.areaId === area.id)
      const storeIds = stores.map(s => s.id)
      const employees = mockEmployees.filter(e => e.storeId && storeIds.includes(e.storeId))
      const empIds = employees.map(e => e.id)
      
      const areaCustomers = mockCustomers.filter(c => empIds.includes(c.employeeId))
      const areaFollowUps = mockCustomerFollowUps.filter(f => empIds.includes(f.employeeId))
      
      const purchased = areaCustomers.filter(c => c.customerStatus === 'Purchased').length
      const total = areaCustomers.length

      result.push({
        area,
        totalStores: stores.length,
        totalEmployees: employees.length,
        totalCustomers: total,
        inquiry: areaCustomers.filter(c => c.customerStatus === 'Inquiry').length,
        purchased,
        totalFollowUps: areaFollowUps.length,
        conversionRate: total === 0 ? 0 : Math.round((purchased / total) * 100)
      })
    }
    return result.sort((a, b) => b.totalCustomers - a.totalCustomers)
  }
}

export const reportService = new ReportService()

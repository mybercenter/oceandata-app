import type { ReportFilter, EmployeePerformance, AreaPerformance, DashboardMetrics } from '../types/report.types'
import { mockCustomerFollowUps } from '../../customer-follow-up/mock/customer-follow-up.mock'
import { mockEmployees } from '../../employee/mock/employee.mock'
import { mockAreas } from '../../area/mock/area.mock'
import { mockStores } from '../../store/mock/store.mock'
import type { Customer } from '../../customer/types/customer.types'
import type { CustomerFollowUp } from '../../customer-follow-up/types/customer-follow-up.types'

const mockCustomers: Customer[] = []

class ReportService {
  private delay(ms = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Helper to filter data based on UI filter panel
  private applyFilters<T extends { employee_id?: string|number, customer_date?: string, follow_up_date?: string }>(data: T[], filters: ReportFilter): T[] {
    return data.filter(item => {
      // 1. Employee Filter
      if (filters.employeeId && item.employee_id !== filters.employeeId) return false
      
      // 2. Date Range Filter
      const dateStr = item.customer_date || item.follow_up_date
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
      if (filters.customerStatus && c.customer_status !== filters.customerStatus) return false
      if (filters.conversion && c.current_conversion !== filters.conversion) return false
      return true
    })

    const inquiry = filteredCustomers.filter(c => c.customer_status === 'Inquiry').length
    const purchased = filteredCustomers.filter(c => c.customer_status === 'Purchased').length
    const totalCustomers = filteredCustomers.length

    return {
      totalCustomers,
      inquiry,
      purchased,
      potential: filteredCustomers.filter(c => c.current_conversion === 'Potential').length,
      prospect: filteredCustomers.filter(c => c.current_conversion === 'Prospect').length,
      hotProspect: filteredCustomers.filter(c => c.current_conversion === 'Hot Prospect').length,
      totalFollowUps: this.applyFilters(mockCustomerFollowUps as any[], filters).length,
      conversionRate: totalCustomers === 0 ? 0 : Math.round((purchased / totalCustomers) * 100)
    }
  }

  async getCustomerReport(filters: ReportFilter = {}): Promise<Customer[]> {
    await this.delay(300)
    return this.applyFilters(mockCustomers, filters).filter(c => {
      if (filters.customerStatus && c.customer_status !== filters.customerStatus) return false
      if (filters.conversion && c.current_conversion !== filters.conversion) return false
      if (filters.storeId && (c.employee as any)?.store_id !== filters.storeId) return false
      return true
    })
  }

  async getFollowUpReport(filters: ReportFilter = {}): Promise<CustomerFollowUp[]> {
    await this.delay(300)
    return this.applyFilters(mockCustomerFollowUps as any[], filters).filter(f => {
      if (filters.customerStatus && (f as any).customer_status !== filters.customerStatus) return false
      if (filters.conversion && (f as any).conversion !== filters.conversion) return false
      if (filters.dedicate && f.dedicate !== filters.dedicate) return false
      if (filters.storeId && (f.employee as any)?.store_id !== filters.storeId) return false
      return true
    })
  }

  async getEmployeePerformance(filters: ReportFilter = {}): Promise<EmployeePerformance[]> {
    await this.delay(600)
    const result: EmployeePerformance[] = []
    
    // Filter employees by area/store if needed
    let employees = mockEmployees
    if (filters.storeId) employees = employees.filter(e => e.store_id === filters.storeId)

    for (const emp of employees) {
      const empCustomers = mockCustomers.filter(c => c.employee_id === emp.id)
      const empFollowUps = mockCustomerFollowUps.filter(f => f.employeeId === emp.id)
      
      const purchased = empCustomers.filter(c => c.customer_status === 'Purchased').length
      const total = empCustomers.length

      result.push({
        employee: emp as any,
        totalCustomers: total,
        inquiry: empCustomers.filter(c => c.customer_status === 'Inquiry').length,
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
      const stores = mockStores.filter(s => s.area_id === area.id)
      const storeIds = stores.map(s => s.id)
      const employees = mockEmployees.filter(e => e.store_id && storeIds.includes(e.store_id as any))
      const empIds = employees.map(e => e.id)
      
      const areaCustomers = mockCustomers.filter(c => empIds.includes(c.employee_id as string))
      const areaFollowUps = mockCustomerFollowUps.filter(f => empIds.includes(f.employeeId))
      
      const purchased = areaCustomers.filter(c => c.customer_status === 'Purchased').length
      const total = areaCustomers.length

      result.push({
        area: area as any,
        totalStores: stores.length,
        totalEmployees: employees.length,
        totalCustomers: total,
        inquiry: areaCustomers.filter(c => c.customer_status === 'Inquiry').length,
        purchased,
        totalFollowUps: areaFollowUps.length,
        conversionRate: total === 0 ? 0 : Math.round((purchased / total) * 100)
      })
    }
    return result.sort((a, b) => b.totalCustomers - a.totalCustomers)
  }
}

export const reportService = new ReportService()

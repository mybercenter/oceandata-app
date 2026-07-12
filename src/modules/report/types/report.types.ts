import type { Customer, CustomerStatus, Conversion } from '../../customer/types/customer.types'
import type { CustomerFollowUp } from '../../customer-follow-up/types/customer-follow-up.types'
import type { Employee } from '../../employee/types/employee.types'
import type { Area } from '../../area/types/area.types'

export interface ReportFilter {
  startDate?: string
  endDate?: string
  areaId?: string
  storeId?: string
  employeeId?: string
  roleId?: string
  dedicate?: string
  customerStatus?: string
  conversion?: string
}

export interface EmployeePerformance {
  employee: Employee
  totalCustomers: number
  inquiry: number
  purchased: number
  totalFollowUps: number
  conversionRate: number
}

export interface AreaPerformance {
  area: Area
  totalStores: number
  totalEmployees: number
  totalCustomers: number
  inquiry: number
  purchased: number
  totalFollowUps: number
  conversionRate: number
}

export interface DashboardMetrics {
  totalCustomers: number
  inquiry: number
  purchased: number
  potential: number
  prospect: number
  hotProspect: number
  totalFollowUps: number
  conversionRate: number
}

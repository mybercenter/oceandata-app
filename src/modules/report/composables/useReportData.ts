import { ref } from 'vue'
import { reportService } from '../services/report.service'
import type { ReportFilter, DashboardMetrics, EmployeePerformance, AreaPerformance } from '../types/report.types'
import type { Customer } from '../../customer/types/customer.types'
import type { CustomerFollowUp } from '../../customer-follow-up/types/customer-follow-up.types'
import type { TablePagination } from '@/shared/components/table/table.types'
import { useToast } from '@/shared/composables/useToast'

export const useReportData = () => {
  const isLoading = ref(false)
  const toast = useToast()

  const dashboardMetrics = ref<DashboardMetrics>({
    totalCustomers: 0,
    inquiry: 0,
    purchased: 0,
    potential: 0,
    prospect: 0,
    hotProspect: 0,
    totalFollowUps: 0,
    conversionRate: 0
  })

  const customersData = ref<Customer[]>([])
  const followUpsData = ref<CustomerFollowUp[]>([])
  const employeeData = ref<EmployeePerformance[]>([])
  const areaData = ref<AreaPerformance[]>([])

  const pagination = ref<TablePagination>({
    page: 1,
    limit: 10,
    total: 0
  })

  // To simulate pagination since this is frontend only
  const getPaginated = (data: any[]) => {
    pagination.value.total = data.length
    const start = (pagination.value.page - 1) * pagination.value.limit
    const end = start + pagination.value.limit
    return data.slice(start, end)
  }

  const loadDashboard = async (filters: ReportFilter = {}) => {
    isLoading.value = true
    try {
      dashboardMetrics.value = await reportService.getDashboardMetrics(filters)
    } catch (e: any) {
      toast.error('Error', e.message)
    } finally {
      isLoading.value = false
    }
  }

  const loadCustomerReport = async (filters: ReportFilter = {}) => {
    isLoading.value = true
    try {
      const all = await reportService.getCustomerReport(filters)
      customersData.value = getPaginated(all)
    } catch (e: any) {
      toast.error('Error', e.message)
    } finally {
      isLoading.value = false
    }
  }

  const loadFollowUpReport = async (filters: ReportFilter = {}) => {
    isLoading.value = true
    try {
      const all = await reportService.getFollowUpReport(filters)
      followUpsData.value = getPaginated(all)
    } catch (e: any) {
      toast.error('Error', e.message)
    } finally {
      isLoading.value = false
    }
  }

  const loadEmployeeReport = async (filters: ReportFilter = {}) => {
    isLoading.value = true
    try {
      const all = await reportService.getEmployeePerformance(filters)
      employeeData.value = getPaginated(all)
    } catch (e: any) {
      toast.error('Error', e.message)
    } finally {
      isLoading.value = false
    }
  }

  const loadAreaReport = async (filters: ReportFilter = {}) => {
    isLoading.value = true
    try {
      const all = await reportService.getAreaPerformance(filters)
      areaData.value = getPaginated(all)
    } catch (e: any) {
      toast.error('Error', e.message)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    pagination,
    dashboardMetrics,
    customersData,
    followUpsData,
    employeeData,
    areaData,
    loadDashboard,
    loadCustomerReport,
    loadFollowUpReport,
    loadEmployeeReport,
    loadAreaReport
  }
}

import http from '@/shared/services/http'

export interface DashboardSummary {
  total_customers: number
  today_customers: number
  purchased_customers: number
  inquiry_customers: number
  conversion: {
    potential: number
    prospect: number
    hot_prospect: number
  }
  today_follow_ups: number
}

export interface CustomerStatusAnalytics {
  total: number
  inquiry: number
  inquiry_percentage: number
  purchased: number
  purchased_percentage: number
}

export interface ConversionAnalytics {
  total: number
  potential: number
  potential_percentage: number
  prospect: number
  prospect_percentage: number
  hot_prospect: number
  hot_prospect_percentage: number
}

export interface FollowUpAnalytics {
  today: number
  this_week: number
  this_month: number
  total: number
}

export interface AreaPerformance {
  area_id: number
  area_name: string
  total_customers: number
  potential: number
  prospect: number
  hot_prospect: number
  purchased: number
  total_follow_ups: number
}

export interface StorePerformance {
  store_id: number
  store_name: string
  total_customers: number
  purchased: number
  inquiry: number
}

export interface PromotorPerformance {
  employee_id: number
  employee_name: string
  store_name: string
  total_customers: number
  purchased: number
  total_follow_ups: number
  conversion_rate: number
}

export interface MonthlyTrend {
  month: string
  customers: number
  purchased: number
  follow_ups: number
}

class DashboardService {
  async getSummary(filters: Record<string, any> = {}): Promise<DashboardSummary> {
    const response = await http.get('/dashboard/summary', { params: filters })
    return response.data.data
  }

  async getCustomerStatus(filters: Record<string, any> = {}): Promise<CustomerStatusAnalytics> {
    const response = await http.get('/dashboard/customer-status', { params: filters })
    return response.data.data
  }

  async getConversion(filters: Record<string, any> = {}): Promise<ConversionAnalytics> {
    const response = await http.get('/dashboard/conversion', { params: filters })
    return response.data.data
  }

  async getFollowUp(filters: Record<string, any> = {}): Promise<FollowUpAnalytics> {
    const response = await http.get('/dashboard/follow-up', { params: filters })
    return response.data.data
  }

  async getAreaPerformance(filters: Record<string, any> = {}): Promise<AreaPerformance[]> {
    const response = await http.get('/dashboard/area-performance', { params: filters })
    return response.data.data
  }

  async getStorePerformance(filters: Record<string, any> = {}): Promise<StorePerformance[]> {
    const response = await http.get('/dashboard/store-performance', { params: filters })
    return response.data.data
  }

  async getPromotorPerformance(filters: Record<string, any> = {}): Promise<PromotorPerformance[]> {
    const response = await http.get('/dashboard/promotor-performance', { params: filters })
    return response.data.data
  }

  async getMonthlyTrend(filters: Record<string, any> = {}): Promise<MonthlyTrend[]> {
    const response = await http.get('/dashboard/monthly-trend', { params: filters })
    return response.data.data
  }
}

export const dashboardService = new DashboardService()

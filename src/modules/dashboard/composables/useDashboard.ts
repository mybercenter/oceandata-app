import { ref, computed, reactive, toRefs } from 'vue'
import { dashboardService } from '../services/dashboard.service'
import type {
  DashboardSummary,
  CustomerStatusAnalytics,
  ConversionAnalytics,
  FollowUpAnalytics,
  AreaPerformance,
  StorePerformance,
  PromotorPerformance,
  MonthlyTrend
} from '../services/dashboard.service'
import type { KpiMetric, DashboardRole } from '../types/dashboard.types'

export const useDashboard = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Data stores
  const summary = ref<DashboardSummary | null>(null)
  const customerStatus = ref<CustomerStatusAnalytics | null>(null)
  const conversion = ref<ConversionAnalytics | null>(null)
  const followUp = ref<FollowUpAnalytics | null>(null)
  const areaPerformance = ref<AreaPerformance[]>([])
  const storePerformance = ref<StorePerformance[]>([])
  const promotorPerformance = ref<PromotorPerformance[]>([])
  const monthlyTrend = ref<MonthlyTrend[]>([])

  const currentRole = ref<DashboardRole>('admin')

  // Function to update KPI refs
  const updateKPIs = () => {
    // Update Admin KPIs
    const updatedAdminKpis = [
      {
        title: 'Total Areas',
        value: (areaPerformance.value?.length || 0).toString(),
        trend: 'neutral',
        percentage: 0,
        icon: 'MapIcon',
        color: 'primary'
      },
      {
        title: 'Total Stores',
        value: (storePerformance.value?.length || 0).toString(),
        trend: 'neutral',
        percentage: 0,
        icon: 'BuildingStorefrontIcon',
        color: 'info'
      },
      {
        title: 'Total Employees',
        value: (promotorPerformance.value?.length || 0).toString(),
        trend: 'neutral',
        percentage: 0,
        icon: 'UsersIcon',
        color: 'warning'
      },
      {
        title: 'Total Customers',
        value: (summary.value?.total_customers || 0).toLocaleString(),
        trend: 'neutral',
        percentage: 0,
        icon: 'UserGroupIcon',
        color: 'success'
      }
    ]

    adminKpis.value = updatedAdminKpis

    // Update Status KPIs
    const customerStatusData = customerStatus.value
    const conversionData = conversion.value

    const updatedStatusKpis = [
      {
        title: 'Inquiry',
        value: (customerStatusData?.inquiry || 0).toLocaleString(),
        trend: 'neutral',
        percentage: customerStatusData?.inquiry_percentage || 0,
        icon: 'QuestionMarkCircleIcon',
        color: 'info'
      },
      {
        title: 'Potential',
        value: (conversionData?.potential || 0).toLocaleString(),
        trend: 'neutral',
        percentage: conversionData?.potential_percentage || 0,
        icon: 'LightBulbIcon',
        color: 'warning'
      },
      {
        title: 'Prospect',
        value: (conversionData?.prospect || 0).toLocaleString(),
        trend: 'neutral',
        percentage: conversionData?.prospect_percentage || 0,
        icon: 'ChartBarIcon',
        color: 'primary'
      },
      {
        title: 'Hot Prospect',
        value: (conversionData?.hot_prospect || 0).toLocaleString(),
        trend: 'neutral',
        percentage: conversionData?.hot_prospect_percentage || 0,
        icon: 'FireIcon',
        color: 'danger'
      },
      {
        title: 'Purchased',
        value: (customerStatusData?.purchased || 0).toLocaleString(),
        trend: 'neutral',
        percentage: customerStatusData?.purchased_percentage || 0,
        icon: 'CheckBadgeIcon',
        color: 'success'
      }
    ]

    statusKpis.value = updatedStatusKpis

    // Update Promotor KPIs
    const summaryData = summary.value
    const updatedPromotorKpis = [
      {
        title: "Today's Customer",
        value: (summaryData?.today_customers || 0).toString(),
        trend: 'neutral',
        percentage: 0,
        icon: 'UserPlusIcon',
        color: 'primary'
      },
      {
        title: "Today's Follow Up",
        value: (summaryData?.today_follow_ups || 0).toString(),
        trend: 'neutral',
        percentage: 0,
        icon: 'ChatBubbleLeftRightIcon',
        color: 'info'
      },
      {
        title: 'Purchased',
        value: (summaryData?.purchased_customers || 0).toString(),
        trend: 'neutral',
        percentage: 0,
        icon: 'CheckBadgeIcon',
        color: 'success'
      },
      {
        title: 'Hot Prospect',
        value: (summaryData?.conversion?.hot_prospect || 0).toString(),
        trend: 'neutral',
        percentage: 0,
        icon: 'FireIcon',
        color: 'danger'
      }
    ]

    promotorKpis.value = updatedPromotorKpis

    // Update Chart Data
    const trendData = monthlyTrend.value || []
    const months = trendData.map(t => {
      const date = new Date(t.month + '-01')
      return date.toLocaleDateString('en-US', { month: 'short' })
    })

    const areaData = areaPerformance.value || []

    const updatedChartData = {
      customerTrend: {
        categories: months.length ? months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        series: [
          { name: 'New Customers', data: trendData.map(t => t.customers) },
          { name: 'Purchased', data: trendData.map(t => t.purchased) }
        ]
      },
      conversionDistribution: {
        labels: ['Inquiry', 'Potential', 'Prospect', 'Hot Prospect', 'Purchased'],
        series: [
          customerStatusData?.inquiry || 0,
          conversionData?.potential || 0,
          conversionData?.prospect || 0,
          conversionData?.hot_prospect || 0,
          customerStatusData?.purchased || 0
        ]
      },
      performanceByArea: {
        categories: areaData.length ? areaData.map(a => a.area_name) : ['No Data'],
        series: [
          { name: 'Customers', data: areaData.length ? areaData.map(a => a.total_customers) : [0] }
        ]
      }
    }

    chartData.value = updatedChartData

    console.log('Updated chart data:', updatedChartData)

    // Update Top Promotors
    const promotorData = promotorPerformance.value || []
    const updatedTopPromotors = promotorData.slice(0, 10).map(p => ({
      id: `P${p.employee_id}`,
      name: p.employee_name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.employee_name}`,
      store: p.store_name || 'N/A',
      area: 'Unknown',
      conversionRate: p.conversion_rate,
      progress: p.conversion_rate
    }))

    topPromotors.value = updatedTopPromotors
  }

  const fetchAllData = async (filters: Record<string, any> = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const [
        summaryData,
        customerStatusData,
        conversionData,
        followUpData,
        areaData,
        storeData,
        promotorData,
        trendData
      ] = await Promise.all([
        dashboardService.getSummary(filters),
        dashboardService.getCustomerStatus(filters),
        dashboardService.getConversion(filters),
        dashboardService.getFollowUp(filters),
        dashboardService.getAreaPerformance(filters),
        dashboardService.getStorePerformance(filters),
        dashboardService.getPromotorPerformance(filters),
        dashboardService.getMonthlyTrend(filters)
      ])

      summary.value = summaryData
      customerStatus.value = customerStatusData
      conversion.value = conversionData
      followUp.value = followUpData
      areaPerformance.value = areaData
      storePerformance.value = storeData
      promotorPerformance.value = promotorData
      monthlyTrend.value = trendData

      console.log('Dashboard data loaded:', {
        summary: summaryData,
        customerStatus: customerStatusData,
        conversion: conversionData,
        areaCount: areaData?.length,
        storeCount: storeData?.length
      })

      // Update KPI refs with the new data
      updateKPIs()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load dashboard data'
      console.error('Dashboard fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties for Admin KPIs
  const adminKpis = ref<KpiMetric[]>([
    { title: 'Total Areas', value: '0', trend: 'neutral', percentage: 0, icon: 'MapIcon', color: 'primary' },
    { title: 'Total Stores', value: '0', trend: 'neutral', percentage: 0, icon: 'BuildingStorefrontIcon', color: 'info' },
    { title: 'Total Employees', value: '0', trend: 'neutral', percentage: 0, icon: 'UsersIcon', color: 'warning' },
    { title: 'Total Customers', value: '0', trend: 'neutral', percentage: 0, icon: 'UserGroupIcon', color: 'success' }
  ])

  // Computed properties for Status KPIs
  const statusKpis = ref<KpiMetric[]>([
    { title: 'Inquiry', value: '0', trend: 'neutral', percentage: 0, icon: 'QuestionMarkCircleIcon', color: 'info' },
    { title: 'Potential', value: '0', trend: 'neutral', percentage: 0, icon: 'LightBulbIcon', color: 'warning' },
    { title: 'Prospect', value: '0', trend: 'neutral', percentage: 0, icon: 'ChartBarIcon', color: 'primary' },
    { title: 'Hot Prospect', value: '0', trend: 'neutral', percentage: 0, icon: 'FireIcon', color: 'danger' },
    { title: 'Purchased', value: '0', trend: 'neutral', percentage: 0, icon: 'CheckBadgeIcon', color: 'success' }
  ])

  // Computed properties for Promotor KPIs
  const promotorKpis = ref<KpiMetric[]>([
    { title: "Today's Customer", value: '0', trend: 'neutral', percentage: 0, icon: 'UserPlusIcon', color: 'primary' },
    { title: "Today's Follow Up", value: '0', trend: 'neutral', percentage: 0, icon: 'ChatBubbleLeftRightIcon', color: 'info' },
    { title: 'Purchased', value: '0', trend: 'neutral', percentage: 0, icon: 'CheckBadgeIcon', color: 'success' },
    { title: 'Hot Prospect', value: '0', trend: 'neutral', percentage: 0, icon: 'FireIcon', color: 'danger' }
  ])

  // Chart data
  const chartData = ref({
    customerTrend: {
      categories: [] as string[],
      series: [
        { name: 'New Customers', data: [] as number[] },
        { name: 'Purchased', data: [] as number[] }
      ]
    },
    conversionDistribution: {
      labels: ['Inquiry', 'Potential', 'Prospect', 'Hot Prospect', 'Purchased'],
      series: [0, 0, 0, 0, 0]
    },
    performanceByArea: {
      categories: [] as string[],
      series: [
        { name: 'Customers', data: [] as number[] }
      ]
    }
  })

  // Top promotors for ranking
  const topPromotors = ref<any[]>([])

  // Return data directly - Vue will unwrap refs automatically
  return {
    isLoading,
    error,
    currentRole,
    fetchAllData,
    adminKpis,
    statusKpis,
    promotorKpis,
    chartData,
    topPromotors,
    recentCustomers: [] as any[], // Backend doesn't provide this yet
    recentFollowUps: [] as any[], // Backend doesn't provide this yet
    activityTimeline: [] as any[], // Backend doesn't provide this yet
    summary,
    customerStatus,
    conversion,
    followUp,
    areaPerformance,
    storePerformance,
    promotorPerformance,
    monthlyTrend
  }
}

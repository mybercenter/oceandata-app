import { ref } from 'vue'
import { 
  adminKpis, 
  statusKpis, 
  promotorKpis, 
  recentCustomers, 
  recentFollowUps, 
  topPromotors, 
  activityTimeline,
  chartData
} from '../mock/dashboard.mock'
import type { DashboardRole } from '../types/dashboard.types'

export const useDashboardMock = () => {
  const isLoading = ref(false)
  const currentRole = ref<DashboardRole>('admin')

  // In a real application, these would be separate API calls.
  // Here we just simulate a network delay.
  const fetchDashboardData = async () => {
    isLoading.value = true
    return new Promise(resolve => {
      setTimeout(() => {
        isLoading.value = false
        resolve(true)
      }, 800) // 800ms mock network delay
    })
  }

  return {
    isLoading,
    currentRole,
    fetchDashboardData,
    data: {
      adminKpis,
      statusKpis,
      promotorKpis,
      recentCustomers,
      recentFollowUps,
      topPromotors,
      activityTimeline,
      chartData
    }
  }
}

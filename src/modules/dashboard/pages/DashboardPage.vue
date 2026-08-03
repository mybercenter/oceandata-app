<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import { useDashboard } from '../composables/useDashboard'
import AdminDashboard from '../components/views/AdminDashboard.vue'
import PromotorDashboard from '../components/views/PromotorDashboard.vue'
import ManagerDashboard from '../components/views/ManagerDashboard.vue'
import DashboardSkeleton from '../components/states/ChartSkeleton.vue'
import ErrorState from '../components/states/ErrorState.vue'
import { useAuth } from '@/shared/composables/useAuth'

const { employee, user } = useAuth()
const { isLoading, error, fetchAllData, adminKpis, statusKpis, promotorKpis, chartData, topPromotors, recentCustomers, recentFollowUps, activityTimeline } = useDashboard()

const userRoleName = computed(() => employee.value?.role?.name || user.value?.role?.name || 'Administrator')

const normalizedRole = computed(() => {
  const name = userRoleName.value.toLowerCase()
  if (name.includes('promotor')) return 'promotor'
  if (name.includes('manager')) return 'manager'
  return 'admin' // fallback for admin, supervisor, trainer, etc.
})

onMounted(() => {
  console.log('Dashboard mounted, fetching data...')
  fetchAllData()
})

// Watch for data changes
watch(() => ({ adminKpis, statusKpis, promotorKpis, chartData, topPromotors }), (newData) => {
  console.log('Dashboard data updated:', newData)
}, { deep: true })

const currentDashboardComponent = computed(() => {
  if (normalizedRole.value === 'admin') return AdminDashboard
  if (normalizedRole.value === 'promotor') return PromotorDashboard
  return ManagerDashboard // fallback for manager
})
</script>

<template>
  <AppPage title="Dashboard" subtitle="Overview of your business performance and activities.">
    <template #actions>
      <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</span>
        <div class="w-px h-4 bg-gray-300"></div>
        <span class="text-sm font-bold text-gray-900">{{ userRoleName }}</span>
      </div>
    </template>

    <div v-if="error" class="mt-4">
      <ErrorState @retry="fetchAllData" />
    </div>
    
    <div v-else-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
      <DashboardSkeleton v-for="i in 4" :key="i" class="min-h-[150px]" />
    </div>

    <div v-else class="mt-4">
      <component :is="currentDashboardComponent" :admin-kpis="adminKpis" :status-kpis="statusKpis" :promotor-kpis="promotorKpis" :chart-data="chartData" :top-promotors="topPromotors" :recent-customers="recentCustomers" :recent-follow-ups="recentFollowUps" :activity-timeline="activityTimeline" />
    </div>
  </AppPage>
</template>

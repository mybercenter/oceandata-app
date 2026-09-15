<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import { useDashboard } from '../composables/useDashboard'
import AdminDashboard from '../components/views/AdminDashboard.vue'
import PromotorDashboard from '../components/views/PromotorDashboard.vue'
import ManagerDashboard from '../components/views/ManagerDashboard.vue'
import DashboardFilters from '../components/filters/DashboardFilters.vue'
import ErrorState from '../components/states/ErrorState.vue'
import { useAuth } from '@/shared/composables/useAuth'

const { employee, user } = useAuth()
const { 
  isLoading, 
  error, 
  fetchAllData, 
  adminKpis, 
  statusKpis, 
  promotorKpis, 
  chartData, 
  topPromotors, 
  storePerformance,
  storePerformanceMeta,
  isStoreLoading,
  fetchStorePerformance,
  isExportingStores,
  exportStores,
  recentFollowUps, 
  activityTimeline 
} = useDashboard()

const userRoleName = computed(() => employee.value?.role?.name || user.value?.role?.name || 'Administrator')

const normalizedRole = computed(() => {
  const name = userRoleName.value.toLowerCase()
  if (name.includes('promotor')) return 'promotor'
  if (name.includes('manager')) return 'manager'
  return 'admin'
})

const currentDashboardComponent = computed(() => {
  if (normalizedRole.value === 'admin') return AdminDashboard
  if (normalizedRole.value === 'promotor') return PromotorDashboard
  return ManagerDashboard
})

// Build default initial filters: this month
const getDefaultFilters = () => {
  const today = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  return {
    date_from: fmt(startOfMonth),
    date_to: fmt(today),
  }
}

onMounted(() => {
  fetchAllData(getDefaultFilters())
})

const handleFilterChange = (filters: Record<string, any>) => {
  fetchAllData(filters)
}

const handleFetchStores = (page: number) => {
  fetchStorePerformance(page)
}
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

    <!-- Filters always rendered at top — never unmounted -->
    <div class="mt-4">
      <DashboardFilters @update:filters="handleFilterChange" />
    </div>

    <!-- Content area -->
    <div v-if="error" class="mt-4">
      <ErrorState @retry="fetchAllData" />
    </div>

    <div v-else class="mt-4">
      <component 
        :is="currentDashboardComponent" 
        @fetch-stores="handleFetchStores"
        @export-stores="exportStores"
        :admin-kpis="adminKpis" 
        :status-kpis="statusKpis" 
        :promotor-kpis="promotorKpis" 
        :chart-data="chartData" 
        :top-promotors="topPromotors" 
        :store-performance="storePerformance"
        :store-meta="storePerformanceMeta"
        :is-loading="isLoading"
        :is-store-loading="isStoreLoading"
        :is-exporting-stores="isExportingStores"
        :recent-follow-ups="recentFollowUps" 
        :activity-timeline="activityTimeline" 
      />
    </div>
  </AppPage>
</template>

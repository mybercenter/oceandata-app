<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import { useDashboardMock } from '../composables/useDashboardMock'
import AdminDashboard from '../components/views/AdminDashboard.vue'
import PromotorDashboard from '../components/views/PromotorDashboard.vue'
import ManagerDashboard from '../components/views/ManagerDashboard.vue'
import DashboardSkeleton from '../components/states/ChartSkeleton.vue'
import ErrorState from '../components/states/ErrorState.vue'
import type { DashboardRole } from '../types/dashboard.types'

const { isLoading, currentRole, fetchDashboardData } = useDashboardMock()

const hasError = false // Mock error state

onMounted(() => {
  fetchDashboardData()
})

const switchRole = (role: DashboardRole) => {
  currentRole.value = role
  fetchDashboardData()
}

const currentDashboardComponent = computed(() => {
  if (currentRole.value === 'admin') return AdminDashboard
  if (currentRole.value === 'promotor') return PromotorDashboard
  return ManagerDashboard // fallback for manager, supervisor, trainer, sales
})
</script>

<template>
  <AppPage title="Dashboard" subtitle="Overview of your business performance and activities.">
    <!-- Mock Role Switcher (Dev Only) -->
    <template #actions>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-500">View as:</span>
        <select 
          :value="currentRole"
          @change="switchRole($event.target.value as DashboardRole)"
          class="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none cursor-pointer"
        >
          <option value="admin">Administrator</option>
          <option value="manager">Manager</option>
          <option value="supervisor">Supervisor</option>
          <option value="trainer">Trainer</option>
          <option value="sales">Sales</option>
          <option value="promotor">Promotor</option>
        </select>
      </div>
    </template>

    <div v-if="hasError" class="mt-4">
      <ErrorState @retry="fetchDashboardData" />
    </div>
    
    <div v-else-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
      <!-- We just show some generic skeletons -->
      <DashboardSkeleton v-for="i in 4" :key="i" class="min-h-[150px]" />
    </div>

    <div v-else class="mt-4">
      <component :is="currentDashboardComponent" />
    </div>
  </AppPage>
</template>

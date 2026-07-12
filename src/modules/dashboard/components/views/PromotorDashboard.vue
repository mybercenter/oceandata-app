<script setup lang="ts">
import StatisticCard from '../widgets/StatisticCard.vue'
import QuickActionCard from '../widgets/QuickActionCard.vue'
import ActivityTimeline from '../widgets/ActivityTimeline.vue'
import AppCard from '@/shared/components/AppCard.vue'
import { useDashboardMock } from '../../composables/useDashboardMock'

const { data } = useDashboardMock()

const quickActions = [
  { title: 'Add Customer', icon: 'UserPlusIcon', route: '/customer', color: 'text-primary-600 bg-primary-50' },
  { title: 'Customer List', icon: 'UsersIcon', route: '/customer', color: 'text-blue-600 bg-blue-50' },
  { title: 'Today Follow Up', icon: 'ChatBubbleLeftRightIcon', route: '/follow-up', color: 'text-warning-600 bg-warning-50' },
  { title: 'My Performance', icon: 'ChartBarIcon', route: '/report/dashboard', color: 'text-success-600 bg-success-50' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Promotor KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatisticCard
        v-for="(kpi, index) in data.promotorKpis"
        :key="index"
        :title="kpi.title"
        :value="kpi.value"
        :trend="kpi.trend"
        :percentage="kpi.percentage"
        :icon="kpi.icon"
        :color="kpi.color"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Quick Actions -->
      <div class="lg:col-span-1">
        <QuickActionCard title="Quick Actions" :actions="quickActions" />
      </div>

      <!-- Today's Follow Up Table -->
      <div class="lg:col-span-2">
        <AppCard class="p-6 h-full">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-xl font-bold text-gray-900">Today's Follow Up</h4>
            <RouterLink to="/follow-up" class="text-sm font-medium text-primary-600 hover:text-primary-700">View All</RouterLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full whitespace-nowrap">
              <thead>
                <tr class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th class="px-4 py-3 rounded-tl-lg">Customer</th>
                  <th class="px-4 py-3">Template</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="fu in data.recentFollowUps" :key="fu.id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ fu.customerName }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ fu.templateUsed }}</td>
                  <td class="px-4 py-3">
                    <span :class="['px-2.5 py-1 text-xs font-medium rounded-full', fu.conversionStatus === 'Positive' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700']">
                      {{ fu.conversionStatus }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <button class="text-sm font-medium text-primary-600 hover:text-primary-700">Follow Up</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </AppCard>
      </div>
    </div>
    
    <!-- Timeline -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div class="lg:col-span-1">
        <ActivityTimeline title="My Recent Activities" :activities="data.activityTimeline.filter(a => a.user !== 'System')" />
      </div>
    </div>
  </div>
</template>

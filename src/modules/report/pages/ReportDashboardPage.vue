<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import ReportFilterPanel from '../components/ReportFilterPanel.vue'
import { useReportData } from '../composables/useReportData'
import type { ReportFilter } from '../types/report.types'
import {
  UsersIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  FireIcon
} from '@heroicons/vue/24/outline'

const { isLoading, dashboardMetrics, loadDashboard } = useReportData()
const currentFilters = ref<ReportFilter>({})

onMounted(() => {
  loadDashboard(currentFilters.value)
})

const handleApplyFilter = () => {
  loadDashboard(currentFilters.value)
}

// Chart Options Mock
const growthOptions = computed(() => ({
  chart: { type: 'area', height: 300, toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#0ea5e9'],
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  dataLabels: { enabled: false }
}))

const growthSeries = computed(() => ([{
  name: 'Customers',
  data: [30, 40, 45, 50, 49, 60, 70].map(v => v + Math.floor(dashboardMetrics.value.totalCustomers / 10))
}]))

const statusOptions = computed(() => ({
  chart: { type: 'donut', height: 300, fontFamily: 'inherit' },
  labels: ['Inquiry', 'Purchased'],
  colors: ['#3b82f6', '#10b981'],
  plotOptions: { pie: { donut: { size: '70%' } } },
  dataLabels: { enabled: false },
  legend: { position: 'bottom' }
}))

const statusSeries = computed(() => ([dashboardMetrics.value.inquiry, dashboardMetrics.value.purchased]))

const conversionOptions = computed(() => ({
  chart: { type: 'donut', height: 300, fontFamily: 'inherit' },
  labels: ['Potential', 'Prospect', 'Hot Prospect'],
  colors: ['#f59e0b', '#f97316', '#ef4444'],
  plotOptions: { pie: { donut: { size: '70%' } } },
  dataLabels: { enabled: false },
  legend: { position: 'bottom' }
}))

const conversionSeries = computed(() => ([
  dashboardMetrics.value.potential, 
  dashboardMetrics.value.prospect, 
  dashboardMetrics.value.hotProspect
]))
</script>

<template>
  <AppPage 
    title="Report Dashboard" 
    subtitle="Overview of company performance, customer acquisition, and conversion."
  >
    <ReportFilterPanel v-model="currentFilters" @apply="handleApplyFilter" />

    <div v-if="isLoading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else>
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center gap-2 text-gray-500 mb-1">
            <UsersIcon class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">Total Customers</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ dashboardMetrics.totalCustomers }}</p>
        </div>
        <div class="bg-blue-50/50 p-4 rounded-xl shadow-sm border border-blue-100">
          <div class="flex items-center gap-2 text-blue-600 mb-1">
            <ChatBubbleLeftRightIcon class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">Inquiry</span>
          </div>
          <p class="text-2xl font-bold text-blue-900">{{ dashboardMetrics.inquiry }}</p>
        </div>
        <div class="bg-emerald-50/50 p-4 rounded-xl shadow-sm border border-emerald-100">
          <div class="flex items-center gap-2 text-emerald-600 mb-1">
            <ShoppingBagIcon class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">Purchased</span>
          </div>
          <p class="text-2xl font-bold text-emerald-900">{{ dashboardMetrics.purchased }}</p>
        </div>
        <div class="bg-purple-50/50 p-4 rounded-xl shadow-sm border border-purple-100">
          <div class="flex items-center gap-2 text-purple-600 mb-1">
            <ArrowTrendingUpIcon class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
          </div>
          <p class="text-2xl font-bold text-purple-900">{{ dashboardMetrics.conversionRate }}%</p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-amber-50/30 p-4 rounded-xl shadow-sm border border-amber-100">
          <div class="flex items-center gap-2 text-amber-600 mb-1">
            <StarIcon class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">Potential</span>
          </div>
          <p class="text-xl font-bold text-amber-900">{{ dashboardMetrics.potential }}</p>
        </div>
        <div class="bg-orange-50/30 p-4 rounded-xl shadow-sm border border-orange-100">
          <div class="flex items-center gap-2 text-orange-600 mb-1">
            <StarIcon class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">Prospect</span>
          </div>
          <p class="text-xl font-bold text-orange-900">{{ dashboardMetrics.prospect }}</p>
        </div>
        <div class="bg-red-50/30 p-4 rounded-xl shadow-sm border border-red-100">
          <div class="flex items-center gap-2 text-red-600 mb-1">
            <FireIcon class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">Hot Prospect</span>
          </div>
          <p class="text-xl font-bold text-red-900">{{ dashboardMetrics.hotProspect }}</p>
        </div>
        <div class="bg-gray-50/50 p-4 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center gap-2 text-gray-600 mb-1">
            <ChatBubbleLeftRightIcon class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">Total Follow Ups</span>
          </div>
          <p class="text-xl font-bold text-gray-900">{{ dashboardMetrics.totalFollowUps }}</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-sm font-bold text-gray-900 mb-4">Customer Growth (YTD)</h3>
          <ClientOnly>
            <apexchart type="area" height="300" :options="growthOptions" :series="growthSeries" />
          </ClientOnly>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-sm font-bold text-gray-900 mb-4 text-center">Status Distribution</h3>
            <ClientOnly>
              <apexchart type="donut" height="250" :options="statusOptions" :series="statusSeries" />
            </ClientOnly>
          </div>
          
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-sm font-bold text-gray-900 mb-4 text-center">Conversion Distribution</h3>
            <ClientOnly>
              <apexchart type="donut" height="250" :options="conversionOptions" :series="conversionSeries" />
            </ClientOnly>
          </div>
        </div>

      </div>
    </div>

  </AppPage>
</template>

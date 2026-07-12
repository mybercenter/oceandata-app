<script setup lang="ts">
import StatisticCard from '../widgets/StatisticCard.vue'
import MiniStatisticCard from '../widgets/MiniStatisticCard.vue'
import AppChartCard from '../charts/AppChartCard.vue'
import RankingCard from '../widgets/RankingCard.vue'
import ActivityTimeline from '../widgets/ActivityTimeline.vue'
import DashboardFilters from '../filters/DashboardFilters.vue'
import AppCard from '@/shared/components/AppCard.vue'
import { useDashboardMock } from '../../composables/useDashboardMock'

const { data } = useDashboardMock()
</script>

<template>
  <div class="space-y-6">
    <DashboardFilters />

    <!-- Top KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatisticCard
        v-for="(kpi, index) in data.adminKpis"
        :key="index"
        :title="kpi.title"
        :value="kpi.value"
        :trend="kpi.trend"
        :percentage="kpi.percentage"
        :icon="kpi.icon"
        :color="kpi.color"
      />
    </div>

    <!-- Secondary KPIs -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      <MiniStatisticCard
        v-for="(kpi, index) in data.statusKpis"
        :key="index"
        :title="kpi.title"
        :value="kpi.value"
        :trend="kpi.trend"
        :color="kpi.color"
      />
    </div>

    <!-- Main Charts Area -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
      <div class="xl:col-span-2">
        <AppChartCard 
          title="Customer Trend" 
          subtitle="Growth over the last 7 months"
          type="area" 
          :series="data.chartData.customerTrend.series"
          :options="{ xaxis: { categories: data.chartData.customerTrend.categories } }"
        />
      </div>
      <div class="xl:col-span-1">
        <AppChartCard 
          title="Conversion Distribution" 
          type="donut" 
          :series="data.chartData.conversionDistribution.series"
          :options="{ labels: data.chartData.conversionDistribution.labels }"
        />
      </div>
    </div>

    <!-- Bottom Area: Area Chart, Ranking, Timeline -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div class="lg:col-span-1">
        <RankingCard title="Top Performing Promotors" :promotors="data.topPromotors" />
      </div>
      
      <div class="lg:col-span-1">
        <AppChartCard 
          title="Performance by Area" 
          type="bar" 
          :series="data.chartData.performanceByArea.series"
          :options="{ 
            xaxis: { categories: data.chartData.performanceByArea.categories },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } }
          }"
        />
      </div>

      <div class="lg:col-span-1">
        <ActivityTimeline title="Recent Activities" :activities="data.activityTimeline" />
      </div>
    </div>

    <!-- Recent Customers Table -->
    <AppCard class="p-6 overflow-hidden">
      <h4 class="text-xl font-bold text-gray-900 mb-4">Recent Customers</h4>
      <div class="overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead>
            <tr class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
              <th class="px-4 py-3 rounded-tl-lg">Customer</th>
              <th class="px-4 py-3">Product</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Promotor</th>
              <th class="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="customer in data.recentCustomers" :key="customer.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img :src="customer.avatar" alt="" class="w-8 h-8 rounded-full bg-gray-100" />
                  <span class="text-sm font-medium text-gray-900">{{ customer.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ customer.product }}</td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700">
                  {{ customer.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ customer.promotor }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ customer.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>

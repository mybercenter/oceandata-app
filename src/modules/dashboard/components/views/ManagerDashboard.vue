<script setup lang="ts">
import StatisticCard from '../widgets/StatisticCard.vue'
import MiniStatisticCard from '../widgets/MiniStatisticCard.vue'
import AppChartCard from '../charts/AppChartCard.vue'
import RankingCard from '../widgets/RankingCard.vue'
import ActivityTimeline from '../widgets/ActivityTimeline.vue'
import AppCard from '@/shared/components/AppCard.vue'
import StoreMetricsCell from '../widgets/StoreMetricsCell.vue'
import { BuildingStorefrontIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  adminKpis: any[]
  statusKpis: any[]
  promotorKpis: any[]
  chartData: any
  topPromotors: any[]
  storePerformance: any[]
  storeMeta?: any
  isLoading?: boolean
  isStoreLoading?: boolean
  isExportingStores?: boolean
  recentFollowUps: any[]
  activityTimeline: any[]
}>()

const emit = defineEmits<{
  (e: 'fetch-stores', page: number): void
  (e: 'export-stores'): void
}>()
</script>

<template>
  <!-- Content wrapper with optional loading overlay -->
  <div class="space-y-6 relative">
    <!-- Loading overlay over content (filter stays visible above) -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-start justify-center pt-24 rounded-2xl"
      >
        <div class="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-lg px-8 py-6 border border-gray-100">
          <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span class="text-sm font-semibold text-gray-600">Memuat data...</span>
        </div>
      </div>
    </Transition>

    <!-- Top KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatisticCard
        v-for="(kpi, index) in adminKpis"
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
        v-for="(kpi, index) in statusKpis"
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
          :series="chartData.customerTrend.series"
          :options="{ xaxis: { categories: chartData.customerTrend.categories } }"
        />
      </div>
      <div class="xl:col-span-1">
        <AppChartCard
          title="Conversion Distribution"
          type="donut"
          :series="chartData.conversionDistribution.series"
          :options="{ labels: chartData.conversionDistribution.labels }"
        />
      </div>
    </div>

    <!-- Bottom Area: Area Chart, Ranking, Timeline -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div class="lg:col-span-1">
        <RankingCard title="Top Performing Promotors" :promotors="topPromotors" />
      </div>

      <div class="lg:col-span-1">
        <AppChartCard
          title="Performance by Area"
          type="bar"
          :series="chartData.performanceByArea.series"
          :options="{
            xaxis: { categories: chartData.performanceByArea.categories },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } }
          }"
        />
      </div>

      <div class="lg:col-span-1">
        <ActivityTimeline title="Recent Activities" :activities="activityTimeline" />
      </div>
    </div>

    <!-- Store Statistics Table -->
    <AppCard class="p-6 flex flex-col h-full shadow-sm border border-gray-100 relative">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="text-xl font-bold text-gray-900">Store Statistics</h4>
          <p class="text-sm text-gray-500">Comprehensive customer and follow-up metrics by store and dedicate category</p>
        </div>
        <div>
          <button 
            @click="emit('export-stores')" 
            :disabled="isExportingStores || isStoreLoading"
            class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowDownTrayIcon class="w-4 h-4" :class="{ 'animate-bounce': isExportingStores }" />
            <span>{{ isExportingStores ? 'Exporting...' : 'Export Excel' }}</span>
          </button>
        </div>
      </div>
      
      <!-- Loading Overlay -->
      <div v-if="isStoreLoading" class="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-2"></div>
          <span class="text-sm font-medium text-gray-600">Loading stores...</span>
        </div>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="w-full text-left text-sm text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold w-10 text-center border-b border-gray-200">No</th>
              <th scope="col" class="px-4 py-3 font-semibold border-b border-gray-200 min-w-[120px]">TOKO</th>
              <th scope="col" class="px-4 py-3 font-semibold border-b border-gray-200 bg-amber-50/30">AV</th>
              <th scope="col" class="px-4 py-3 font-semibold border-b border-gray-200 bg-indigo-50/30">HA</th>
              <th scope="col" class="px-4 py-3 font-semibold border-b border-gray-200 bg-emerald-50/30">HYBRID</th>
              <th scope="col" class="px-4 py-3 font-semibold border-b border-gray-200 bg-gray-50">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!storePerformance || storePerformance.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <BuildingStorefrontIcon class="w-8 h-8 text-gray-300 mb-2" />
                  <p>No store performance data available</p>
                </div>
              </td>
            </tr>
            <tr 
              v-else
              v-for="(store, index) in storePerformance" 
              :key="store.store_id"
              class="bg-white border-b hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-gray-900 text-center">
                {{ ((storeMeta?.current_page || 1) - 1) * (storeMeta?.per_page || 10) + index + 1 }}
              </td>
              <td class="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{{ store.store_name }}</td>
              <td class="px-4 py-3 border-l border-gray-100 bg-amber-50/10">
                <StoreMetricsCell :metrics="store.metrics.AV" />
              </td>
              <td class="px-4 py-3 border-l border-gray-100 bg-indigo-50/10">
                <StoreMetricsCell :metrics="store.metrics.HA" />
              </td>
              <td class="px-4 py-3 border-l border-gray-100 bg-emerald-50/10">
                <StoreMetricsCell :metrics="store.metrics.Hybrid" />
              </td>
              <td class="px-4 py-3 border-l border-gray-100 bg-gray-50/30 rounded-r">
                <StoreMetricsCell :metrics="store.metrics.Total" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="storeMeta && storeMeta.last_page > 1" class="flex items-center justify-between mt-4 px-2">
        <div class="text-sm text-gray-500">
          Showing <span class="font-medium text-gray-900">{{ ((storeMeta.current_page - 1) * storeMeta.per_page) + 1 }}</span> to <span class="font-medium text-gray-900">{{ Math.min(storeMeta.current_page * storeMeta.per_page, storeMeta.total) }}</span> of <span class="font-medium text-gray-900">{{ storeMeta.total }}</span> stores
        </div>
        <div class="flex space-x-2">
          <button 
            @click="emit('fetch-stores', storeMeta.current_page - 1)" 
            :disabled="storeMeta.current_page === 1 || isStoreLoading"
            class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button 
            @click="emit('fetch-stores', storeMeta.current_page + 1)" 
            :disabled="storeMeta.current_page === storeMeta.last_page || isStoreLoading"
            class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </AppCard>
  </div>
</template>

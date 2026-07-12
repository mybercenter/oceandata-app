<script setup lang="ts">
import StatisticCard from '../widgets/StatisticCard.vue'
import AppChartCard from '../charts/AppChartCard.vue'
import DashboardFilters from '../filters/DashboardFilters.vue'
import { useDashboardMock } from '../../composables/useDashboardMock'

const { data } = useDashboardMock()
</script>

<template>
  <div class="space-y-6">
    <DashboardFilters />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatisticCard
        v-for="(kpi, index) in data.statusKpis.slice(0, 4)"
        :key="index"
        :title="kpi.title"
        :value="kpi.value"
        :trend="kpi.trend"
        :percentage="kpi.percentage"
        :icon="kpi.icon"
        :color="kpi.color"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <AppChartCard 
        title="Performance by Area" 
        type="bar" 
        :series="data.chartData.performanceByArea.series"
        :options="{ xaxis: { categories: data.chartData.performanceByArea.categories } }"
      />
      <AppChartCard 
        title="Conversion Trend" 
        type="area" 
        :series="data.chartData.customerTrend.series"
        :options="{ xaxis: { categories: data.chartData.customerTrend.categories } }"
      />
    </div>
  </div>
</template>

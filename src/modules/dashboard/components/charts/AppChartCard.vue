<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '@/shared/components/AppCard.vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps<{
  title: string
  subtitle?: string
  type: 'line' | 'area' | 'bar' | 'donut'
  series: any[]
  options?: any
  height?: number | string
}>()

const defaultOptions = computed(() => {
  const isDonut = props.type === 'donut'
  
  return {
    chart: {
      type: props.type,
      fontFamily: 'Satoshi, sans-serif',
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#465FFF', '#10B981', '#F59E0B', '#EF4444', '#6366F1'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: isDonut ? 0 : 2
    },
    grid: {
      show: !isDonut,
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '12px' },
        formatter: (value: number) => Math.round(value)
      }
    },
    legend: {
      show: true,
      position: isDonut ? 'bottom' : 'top',
      horizontalAlign: isDonut ? 'center' : 'right',
      labels: { colors: '#64748b' }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => val
      }
    },
    ...props.options
  }
})
</script>

<template>
  <AppCard class="p-6">
    <div class="mb-4">
      <h4 class="text-xl font-bold text-gray-900">{{ title }}</h4>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
    </div>
    <div class="w-full">
      <VueApexCharts
        :type="type"
        :height="height || 300"
        :options="defaultOptions"
        :series="series"
      />
    </div>
  </AppCard>
</template>

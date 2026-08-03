<script setup lang="ts">
import { computed, ref } from 'vue'
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

const hasError = ref(false)
const chartKey = ref(0)

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

// Validate series data
const isValidSeries = computed(() => {
  if (!props.series || !Array.isArray(props.series) || props.series.length === 0) {
    return false
  }
  return props.series.every(s => s && s.data && Array.isArray(s.data))
})

const canRender = computed(() => {
  return isValidSeries.value && !hasError.value
})

function handleError() {
  console.error('Chart rendering error:', props.title)
  hasError.value = true
}

function incrementKey() {
  chartKey.value++
}
</script>

<template>
  <AppCard class="p-6">
    <div class="mb-4">
      <h4 class="text-xl font-bold text-gray-900">{{ title }}</h4>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
    </div>
    <div class="w-full" v-if="canRender">
      <VueApexCharts
        :key="`chart-${chartKey}`"
        :type="type"
        :height="height || 300"
        :options="defaultOptions"
        :series="series"
        @error="handleError"
      />
    </div>
    <div v-else class="w-full h-64 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <p v-if="hasError">Error loading chart</p>
        <p v-else>No data available</p>
        <p v-if="!isValidSeries" class="text-xs mt-2">Invalid series format</p>
      </div>
    </div>
  </AppCard>
</template>

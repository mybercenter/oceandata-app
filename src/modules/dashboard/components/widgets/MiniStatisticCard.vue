<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '@/shared/components/AppCard.vue'

const props = defineProps<{
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}>()

const trendColor = computed(() => {
  if (props.trend === 'up') return 'text-green-500'
  if (props.trend === 'down') return 'text-red-500'
  return 'text-gray-500'
})

const bgClass = computed(() => {
  const map: Record<string, string> = {
    primary: 'bg-primary-600 border-primary-600',
    success: 'bg-green-600 border-green-600',
    warning: 'bg-amber-500 border-amber-500',
    danger: 'bg-red-500 border-red-500',
    info: 'bg-blue-500 border-blue-500'
  }
  return props.color ? map[props.color] : 'bg-white text-gray-900'
})

const textClass = computed(() => {
  return props.color ? 'text-white' : 'text-gray-900'
})

const subtitleClass = computed(() => {
  return props.color ? 'text-white/80' : 'text-gray-500'
})
</script>

<template>
  <div :class="['rounded-xl shadow-sm px-5 py-4 transition-all duration-300 hover:shadow-md cursor-pointer border', bgClass]">
    <div class="flex items-center gap-4">
      <div class="flex-1">
        <h4 :class="['text-lg font-bold leading-none mb-1', textClass]">{{ value }}</h4>
        <span :class="['text-xs font-semibold uppercase tracking-wider', subtitleClass]">{{ title }}</span>
      </div>
      <div v-if="trend" :class="['w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm', trendColor]">
        <svg v-if="trend === 'up'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <svg v-else-if="trend === 'down'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
        </svg>
      </div>
    </div>
  </div>
</template>

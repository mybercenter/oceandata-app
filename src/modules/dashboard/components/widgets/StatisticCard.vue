<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '@/shared/components/AppCard.vue'
import { 
  MapIcon, 
  BuildingStorefrontIcon, 
  UsersIcon, 
  UserGroupIcon, 
  QuestionMarkCircleIcon, 
  LightBulbIcon, 
  ChartBarIcon, 
  FireIcon, 
  CheckBadgeIcon, 
  UserPlusIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  percentage?: number
  icon: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}>()

const iconMap: Record<string, any> = {
  MapIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
  FireIcon,
  CheckBadgeIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon
}

const iconComponent = computed(() => iconMap[props.icon])

const colorClasses = computed(() => {
  const map: Record<string, string> = {
    primary: 'text-primary-600 bg-primary-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-amber-600 bg-amber-50',
    danger: 'text-red-600 bg-red-50',
    info: 'text-blue-600 bg-blue-50'
  }
  return map[props.color || 'primary']
})

const trendColor = computed(() => {
  if (props.trend === 'up') return 'text-green-500'
  if (props.trend === 'down') return 'text-red-500'
  return 'text-gray-500'
})
</script>

<template>
  <AppCard class="p-6 transition-all duration-300 hover:shadow-md">
    <div class="flex items-center justify-between mb-4">
      <div :class="['flex h-11 w-11 items-center justify-center rounded-full', colorClasses]">
        <component :is="iconComponent" class="h-6 w-6" v-if="iconComponent" />
      </div>
    </div>
    
    <div class="mt-4 flex items-end justify-between">
      <div>
        <h4 class="text-2xl font-bold text-gray-900">{{ value }}</h4>
        <span class="text-sm font-medium text-gray-500">{{ title }}</span>
      </div>
      
      <span v-if="percentage !== undefined" :class="['flex items-center gap-1 text-sm font-medium', trendColor]">
        {{ percentage }}%
        <svg v-if="trend === 'up'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <svg v-else-if="trend === 'down'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </span>
    </div>
  </AppCard>
</template>

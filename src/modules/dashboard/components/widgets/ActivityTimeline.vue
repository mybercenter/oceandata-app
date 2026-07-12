<script setup lang="ts">
import AppCard from '@/shared/components/AppCard.vue'
import type { ActivityTimelineItem } from '../../types/dashboard.types'

defineProps<{
  title: string
  activities: ActivityTimelineItem[]
}>()

const getIconColor = (type: string) => {
  switch(type) {
    case 'purchased': return 'text-green-600 bg-green-50 ring-green-100'
    case 'follow_up': return 'text-blue-600 bg-blue-50 ring-blue-100'
    case 'customer_added': return 'text-primary-600 bg-primary-50 ring-primary-100'
    case 'reminder': return 'text-amber-600 bg-amber-50 ring-amber-100'
    default: return 'text-gray-600 bg-gray-50 ring-gray-100'
  }
}
</script>

<template>
  <AppCard class="p-6">
    <h4 class="text-xl font-bold text-gray-900 mb-6">{{ title }}</h4>
    <div class="relative border-l border-gray-200 ml-3">
      <div v-for="activity in activities" :key="activity.id" class="mb-8 ml-6 last:mb-0">
        <!-- Dot -->
        <span :class="['absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white', getIconColor(activity.type)]">
          <svg v-if="activity.type === 'purchased'" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
          <svg v-else-if="activity.type === 'follow_up'" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /></svg>
          <svg v-else-if="activity.type === 'customer_added'" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>
          <svg v-else class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
        </span>
        
        <h5 class="flex items-center text-sm font-semibold text-gray-900 mb-0.5">
          {{ activity.title }}
        </h5>
        <p class="text-sm text-gray-500 mb-1">{{ activity.description }}</p>
        <div class="flex items-center gap-2 text-xs text-gray-400">
          <span>{{ activity.timestamp }}</span>
          <span>&bull;</span>
          <span>By {{ activity.user }}</span>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title?: string
  message?: string
}>()

defineEmits(['retry'])
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-red-100 bg-red-50/30">
    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
      <ExclamationTriangleIcon class="w-6 h-6 text-red-600" />
    </div>
    <h3 class="text-sm font-semibold text-red-900">{{ title || 'Failed to load data' }}</h3>
    <p class="mt-1 text-sm text-red-700">{{ message || 'An error occurred while fetching dashboard data.' }}</p>
    <button 
      @click="$emit('retry')"
      class="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
    >
      Try Again
    </button>
  </div>
</template>

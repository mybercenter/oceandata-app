<script setup lang="ts">
import { ArchiveBoxIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title?: string
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-gray-100 border-dashed">
    <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
      <ArchiveBoxIcon class="w-6 h-6 text-gray-400" />
    </div>
    <h3 class="text-sm font-semibold text-gray-900">{{ title || 'No data available' }}</h3>
    <p class="mt-1 text-sm text-gray-500">{{ message || 'There is no data to show for the selected period.' }}</p>
  </div>
</template>

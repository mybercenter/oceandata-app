<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  page: number
  limit: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:limit', value: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.limit))

const limits = [10, 25, 50, 100]

const startRecord = computed(() => {
  if (props.total === 0) return 0
  return (props.page - 1) * props.limit + 1
})

const endRecord = computed(() => {
  return Math.min(props.page * props.limit, props.total)
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-200">
    <!-- Rows Per Page & Info -->
    <div class="flex items-center gap-4 text-sm text-gray-500 w-full sm:w-auto justify-between sm:justify-start">
      <div class="flex items-center gap-2">
        <label for="rowsPerPage">Rows per page:</label>
        <select 
          id="rowsPerPage"
          :value="limit"
          @change="emit('update:limit', Number(($event.target as HTMLSelectElement).value))"
          class="block w-full py-1 pl-3 pr-8 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option v-for="l in limits" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>
      <div class="hidden sm:block">
        Showing <span class="font-medium text-gray-900">{{ startRecord }}</span> to <span class="font-medium text-gray-900">{{ endRecord }}</span> of <span class="font-medium text-gray-900">{{ total }}</span> entries
      </div>
    </div>

    <!-- Mobile Info -->
    <div class="block sm:hidden text-sm text-gray-500 w-full text-center">
      Showing {{ startRecord }} - {{ endRecord }} of {{ total }}
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          @click="emit('update:page', page - 1)"
          :disabled="page <= 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          Page {{ page }} of {{ totalPages || 1 }}
        </span>
        
        <button
          @click="emit('update:page', page + 1)"
          :disabled="page >= totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </div>
</template>

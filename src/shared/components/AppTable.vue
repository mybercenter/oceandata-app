<script setup lang="ts">
import { computed } from 'vue'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

interface Props {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  emptyText?: string
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: 'No data available',
  sortOrder: 'asc'
})

const emit = defineEmits<{
  (e: 'sort', key: string): void
}>()

const alignmentClass = (align?: 'left' | 'center' | 'right') => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}
</script>

<template>
  <div class="overflow-x-auto w-full">
    <table class="w-full text-sm text-left text-gray-600">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-4 font-semibold tracking-wider whitespace-nowrap"
            :class="[
              alignmentClass(col.align),
              col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
            ]"
            @click="col.sortable && emit('sort', col.key)"
          >
            <div class="flex items-center" :class="[
              col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'
            ]">
              {{ col.label }}
              <svg v-if="col.sortable && sortKey === col.key" class="w-4 h-4 ml-1" :class="{'rotate-180': sortOrder === 'desc'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading" class="bg-white">
          <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
            <svg class="animate-spin h-8 w-8 mx-auto text-primary-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading data...
          </td>
        </tr>
        <tr v-else-if="data.length === 0" class="bg-white">
          <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
            {{ emptyText }}
          </td>
        </tr>
        <tr
          v-else
          v-for="(row, index) in data"
          :key="row.id || index"
          class="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-4 whitespace-nowrap"
            :class="alignmentClass(col.align)"
          >
            <slot :name="col.key" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

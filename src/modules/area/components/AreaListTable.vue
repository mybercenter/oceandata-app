<script setup lang="ts">
import { ref } from 'vue'
import AppTable, { type TableColumn } from '@/shared/components/AppTable.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppDropdown from '@/shared/components/ui/AppDropdown.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { EllipsisVerticalIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { Area } from '../../types/area.types'

const props = defineProps<{
  areas: Area[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'view', area: Area): void
  (e: 'edit', area: Area): void
  (e: 'delete', area: Area): void
}>()

const columns: TableColumn[] = [
  { key: 'code', label: 'Area Code', sortable: true },
  { key: 'name', label: 'Area Name', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created At', sortable: true },
  { key: 'actions', label: 'Actions', align: 'right' }
]

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <AppTable 
      :columns="columns" 
      :data="areas"
      :loading="loading"
      emptyText="No areas found. Try adjusting your filters or create a new one."
    >
      <template #status="{ value }">
        <AppStatusBadge :status="value" />
      </template>

      <template #createdAt="{ value }">
        <span class="text-gray-500">{{ formatDate(value) }}</span>
      </template>

      <template #actions="{ row }">
        <AppDropdown width="w-48">
          <template #trigger>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <EllipsisVerticalIcon class="w-5 h-5" />
            </button>
          </template>

          <template #default="{ close }">
            <button 
              @click="emit('view', row); close()" 
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <EyeIcon class="w-4 h-4 mr-3 text-gray-400" />
              View Details
            </button>
            <button 
              @click="emit('edit', row); close()" 
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <PencilSquareIcon class="w-4 h-4 mr-3 text-gray-400" />
              Edit Area
            </button>
            <div class="border-t border-gray-100 my-1"></div>
            <button 
              @click="emit('delete', row); close()" 
              class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <TrashIcon class="w-4 h-4 mr-3 text-red-500" />
              Delete Area
            </button>
          </template>
        </AppDropdown>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableColumn, TablePagination, TableFilters } from './table.types'
import DataTableToolbar from './DataTableToolbar.vue'
import DataTableBulkActions from './DataTableBulkActions.vue'
import DataTablePagination from './DataTablePagination.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppDropdown from '@/shared/components/ui/AppDropdown.vue'
import { EllipsisVerticalIcon, EyeIcon, PencilSquareIcon, TrashIcon, ArrowsUpDownIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  total?: number
  filters?: TableFilters
  statusOptions?: { label: string; value: string }[]
  emptyTitle?: string
  emptyMessage?: string
  showAdd?: boolean
  showExport?: boolean
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: TableFilters): void
  (e: 'update:pagination', pagination: TablePagination): void
  (e: 'sort', key: string, order: 'asc'|'desc'): void
  (e: 'refresh'): void
  (e: 'add'): void
  (e: 'export'): void
  (e: 'export-selected', ids: string[]): void
  (e: 'delete-selected', ids: string[]): void
  (e: 'view', row: any): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
}>()

// Pagination State
const pagination = ref<TablePagination>({
  page: 1,
  limit: 10,
  total: props.total || 0
})

watch(() => props.total, (newTotal) => {
  if (newTotal !== undefined) {
    pagination.value.total = newTotal
  }
})

const handleUpdatePage = (page: number) => {
  pagination.value.page = page
  emit('update:pagination', pagination.value)
}

const handleUpdateLimit = (limit: number) => {
  pagination.value.limit = limit
  pagination.value.page = 1
  emit('update:pagination', pagination.value)
}

// Sorting State
const sortKey = ref('')
const sortOrder = ref<'asc'|'desc'>('asc')

const handleSort = (key: string) => {
  const col = props.columns.find(c => c.key === key)
  if (!col?.sortable) return

  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort', key, sortOrder.value)
}

// Selection State
const selectedIds = ref<string[]>([])

const isAllSelected = computed(() => {
  if (props.data.length === 0) return false
  return selectedIds.value.length === props.data.length
})

const isSomeSelected = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < props.data.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = props.data.map(row => row.id)
  }
}

const toggleSelect = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

// Formatting
const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const formatNumber = (num?: number) => {
  if (num === undefined) return '-'
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
    
    <!-- Toolbar -->
    <DataTableToolbar 
      v-if="filters"
      :search="filters.search"
      :status="filters.status"
      :statusOptions="statusOptions"
      :loading="loading"
      :showAdd="showAdd"
      :showExport="showExport"
      @update:search="(v) => emit('update:filters', { ...filters!, search: v })"
      @update:status="(v) => emit('update:filters', { ...filters!, status: String(v) })"
      @clear="emit('update:filters', { search: '', status: '' })"
      @refresh="emit('refresh')"
      @add="emit('add')"
      @export="emit('export')"
    >
      <template #filters>
        <slot name="filters"></slot>
      </template>
    </DataTableToolbar>

    <!-- Bulk Actions Overlay -->
    <DataTableBulkActions 
      :selectedCount="selectedIds.length"
      @clear="selectedIds = []"
      @delete="emit('delete-selected', selectedIds); selectedIds = []"
      @export="emit('export-selected', selectedIds); selectedIds = []"
    />

    <!-- Table Container (Desktop/Tablet) -->
    <div class="hidden sm:block overflow-x-auto w-full relative min-h-[300px]">
      <table class="w-full text-sm text-left text-gray-600">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            <th class="px-6 py-4 w-12 text-center">
              <input 
                type="checkbox" 
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                :checked="isAllSelected"
                :indeterminate="isSomeSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-for="col in columns.filter(c => c.visible !== false)"
              :key="col.key"
              class="px-6 py-4 font-semibold tracking-wider whitespace-nowrap"
              :class="[
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
                col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors select-none' : ''
              ]"
              @click="col.sortable && handleSort(col.key)"
            >
              <div class="flex items-center gap-1.5" :class="[
                col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'
              ]">
                {{ col.label }}
                <span v-if="col.sortable" class="text-gray-400 flex flex-col -space-y-1">
                  <ArrowUpIcon v-if="sortKey === col.key && sortOrder === 'asc'" class="w-3 h-3 text-primary-600" />
                  <ArrowDownIcon v-else-if="sortKey === col.key && sortOrder === 'desc'" class="w-3 h-3 text-primary-600" />
                  <ArrowsUpDownIcon v-else class="w-3 h-3" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <template v-if="loading && data.length === 0">
            <tr v-for="i in 5" :key="i" class="bg-white border-b border-gray-50 animate-pulse">
              <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-4"></div></td>
              <td v-for="col in columns.filter(c => c.visible !== false)" :key="col.key" class="px-6 py-4">
                <div class="h-4 bg-gray-100 rounded" :class="col.type === 'actions' ? 'w-8' : 'w-24'"></div>
              </td>
            </tr>
          </template>

          <!-- Empty State -->
          <tr v-else-if="data.length === 0">
            <td :colspan="columns.filter(c => c.visible !== false).length + 1" class="px-6 py-24 text-center">
              <div class="flex flex-col items-center justify-center text-gray-500">
                <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-1">{{ emptyTitle || 'No data available' }}</h3>
                <p class="text-sm">{{ emptyMessage || 'Try adjusting your filters or create a new record.' }}</p>
                <AppButton v-if="showAdd" variant="primary" size="sm" class="mt-4" @click="emit('add')">
                  Add New Record
                </AppButton>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-else
            v-for="row in data"
            :key="row.id"
            class="bg-white border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
            :class="selectedIds.includes(row.id) ? 'bg-blue-50/50' : ''"
          >
            <td class="px-6 py-4 text-center">
              <input 
                type="checkbox" 
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                :checked="selectedIds.includes(row.id)"
                @change="toggleSelect(row.id)"
              />
            </td>
            
            <td
              v-for="col in columns.filter(c => c.visible !== false)"
              :key="col.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="[
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
              ]"
            >
              <!-- Slots Override -->
              <slot :name="col.key" :row="row" :value="row[col.key]">
                
                <!-- Status -->
                <AppStatusBadge v-if="col.type === 'status'" :status="row[col.key]" />
                
                <!-- Date -->
                <span v-else-if="col.type === 'date'" class="text-gray-500">{{ formatDate(row[col.key]) }}</span>
                
                <!-- Number -->
                <span v-else-if="col.type === 'number'" class="font-mono">{{ formatNumber(row[col.key]) }}</span>
                
                <!-- Actions -->
                <div v-else-if="col.type === 'actions'" class="flex items-center justify-end">
                  <AppDropdown width="w-48">
                    <template #trigger>
                      <button class="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <EllipsisVerticalIcon class="w-5 h-5" />
                      </button>
                    </template>
                    <template #default="{ close }">
                      <slot name="actions-prepend" :row="row" :close="close"></slot>
                      <button v-if="showView" @click="emit('view', row); close()" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <EyeIcon class="w-4 h-4 mr-3 text-gray-400" /> View
                      </button>
                      <button v-if="showEdit" @click="emit('edit', row); close()" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <PencilSquareIcon class="w-4 h-4 mr-3 text-gray-400" /> Edit
                      </button>
                      <div v-if="showDelete" class="border-t border-gray-100 my-1"></div>
                      <button v-if="showDelete" @click="emit('delete', row); close()" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <TrashIcon class="w-4 h-4 mr-3 text-red-500" /> Delete
                      </button>
                      <slot name="actions-append" :row="row" :close="close"></slot>
                    </template>
                  </AppDropdown>
                </div>
                
                <!-- Text Default -->
                <span v-else class="font-medium text-gray-900">{{ row[col.key] || '-' }}</span>
                
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="block sm:hidden flex-1 bg-gray-50/50">
      <div v-if="loading && data.length === 0" class="p-4 space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="h-3 bg-gray-100 rounded w-full mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>
      
      <div v-else-if="data.length === 0" class="p-8 text-center text-gray-500">
        {{ emptyTitle || 'No data available' }}
      </div>
      
      <div v-else class="p-4 flex flex-col gap-4">
        <div 
          v-for="row in data" 
          :key="row.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative"
        >
          <!-- Mobile Actions Header -->
          <div class="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
            <input 
              type="checkbox" 
              class="w-4 h-4 text-primary-600 border-gray-300 rounded"
              :checked="selectedIds.includes(row.id)"
              @change="toggleSelect(row.id)"
            />
            <div class="flex items-center gap-2">
              <button @click="emit('view', row)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                <EyeIcon class="w-4 h-4" />
              </button>
              <button @click="emit('edit', row)" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md">
                <PencilSquareIcon class="w-4 h-4" />
              </button>
              <button @click="emit('delete', row)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Mobile Data Grid -->
          <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <template v-for="col in columns.filter(c => c.visible !== false && c.type !== 'actions')" :key="col.key">
              <div class="text-gray-500 font-medium">{{ col.label }}</div>
              <div class="text-right flex justify-end">
                <slot :name="col.key" :row="row" :value="row[col.key]">
                  <AppStatusBadge v-if="col.type === 'status'" :status="row[col.key]" />
                  <span v-else-if="col.type === 'date'" class="text-gray-600">{{ formatDate(row[col.key]) }}</span>
                  <span v-else-if="col.type === 'number'" class="font-mono text-gray-900">{{ formatNumber(row[col.key]) }}</span>
                  <span v-else class="text-gray-900 font-semibold">{{ row[col.key] || '-' }}</span>
                </slot>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <DataTablePagination 
      v-if="pagination.total > 0"
      :page="pagination.page"
      :limit="pagination.limit"
      :total="pagination.total"
      @update:page="handleUpdatePage"
      @update:limit="handleUpdateLimit"
    />
  </div>
</template>

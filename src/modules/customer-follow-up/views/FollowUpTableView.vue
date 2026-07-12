<script setup lang="ts">
import { computed } from 'vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import { EyeIcon, PhoneArrowUpRightIcon, IdentificationIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  data: any[]
  loading: boolean
  total: number
  filters: any
  areas: any[]
  stores: any[]
  employees: any[]
}>()

const emit = defineEmits<{
  (e: 'update:filters', val: any): void
  (e: 'pagination'): void
  (e: 'sort', key: string, order: 'asc'|'desc'): void
  (e: 'refresh'): void
  (e: 'add'): void
  (e: 'view', row: any): void
  (e: 'delete', row: any): void
  (e: 'delete-selected', ids: string[]): void
  (e: 'open-whatsapp', row: any): void
  (e: 'view-customer', row: any): void
}>()

const areaOptions = computed(() => [{ label: 'All Areas', value: '' }, ...props.areas.map(a => ({ label: a.name, value: a.id }))])
const storeOptions = computed(() => [{ label: 'All Stores', value: '' }, ...props.stores.map(s => ({ label: s.name, value: s.id }))])
const employeeOptions = computed(() => [{ label: 'All Employees', value: '' }, ...props.employees.map(e => ({ label: e.fullName, value: e.id }))])

const dedicateOptions = [
  { label: 'All Dedicate', value: '' },
  { label: 'AV', value: 'AV' },
  { label: 'HA', value: 'HA' }
]

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Inquiry', value: 'Inquiry' },
  { label: 'Purchased', value: 'Purchased' }
]

const conversionOptions = [
  { label: 'All Conversion', value: '' },
  { label: 'Potential', value: 'Potential' },
  { label: 'Prospect', value: 'Prospect' },
  { label: 'Hot Prospect', value: 'Hot Prospect' }
]

const columns: TableColumn[] = [
  { key: 'followUpDate', label: 'Date', type: 'date', sortable: true },
  { key: 'customer', label: 'Customer', type: 'text', sortable: true },
  { key: 'employee', label: 'Employee', type: 'text', sortable: true },
  { key: 'dedicate', label: 'Dedicate', type: 'text', sortable: true },
  { key: 'templateUsed', label: 'Template', type: 'text', sortable: true },
  { key: 'conversion', label: 'Conversion', type: 'status', align: 'center', sortable: true },
  { key: 'customerStatus', label: 'Status', type: 'status', align: 'center', sortable: true },
  { key: 'evidence', label: 'Evidence', type: 'text', align: 'center' },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const formatConversionColor = (conversion: string) => {
  switch (conversion) {
    case 'Hot Prospect': return 'text-red-700 bg-red-100 border-red-200'
    case 'Prospect': return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'Potential': return 'text-amber-700 bg-amber-100 border-amber-200'
    default: return 'text-gray-700 bg-gray-100 border-gray-200'
  }
}
</script>

<template>
  <AppDataTable 
    :columns="columns"
    :data="data"
    :loading="loading"
    :total="total"
    :filters="filters"
    showAdd
    showExport
    enableSelection
    emptyTitle="No Follow Ups Found"
    @update:filters="emit('update:filters', $event)"
    @update:pagination="emit('pagination')"
    @sort="(key, order) => emit('sort', key, order)"
    @refresh="emit('refresh')"
    @add="emit('add')"
    @delete-selected="ids => emit('delete-selected', ids)"
  >
    <template #filters>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
        <AppSelect :model-value="filters.areaId" @update:model-value="v => emit('update:filters', { ...filters, areaId: v })" :options="areaOptions" />
        <AppSelect :model-value="filters.storeId" @update:model-value="v => emit('update:filters', { ...filters, storeId: v })" :options="storeOptions" />
        <AppSelect :model-value="filters.employeeId" @update:model-value="v => emit('update:filters', { ...filters, employeeId: v })" :options="employeeOptions" />
        <AppSelect :model-value="filters.dedicate" @update:model-value="v => emit('update:filters', { ...filters, dedicate: v })" :options="dedicateOptions" />
        <AppSelect :model-value="filters.customerStatus" @update:model-value="v => emit('update:filters', { ...filters, customerStatus: v })" :options="statusOptions" />
        <AppSelect :model-value="filters.conversion" @update:model-value="v => emit('update:filters', { ...filters, conversion: v })" :options="conversionOptions" />
      </div>
    </template>

    <template #followUpDate="{ row }">
      <span class="text-gray-600 font-medium whitespace-nowrap">{{ formatDate(row.followUpDate) }}</span>
    </template>

    <template #customer="{ row }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-900">{{ row.customer?.fullName }}</span>
        <span class="text-xs text-gray-500">{{ row.customer?.phone }}</span>
      </div>
    </template>

    <template #employee="{ row }">
      <div class="flex flex-col">
        <span class="font-medium text-gray-800">{{ row.employee?.fullName || '-' }}</span>
        <span class="text-[10px] text-gray-500">{{ row.employee?.store?.name || '-' }}</span>
      </div>
    </template>

    <template #dedicate="{ row }">
      <span class="font-bold text-gray-700">{{ row.dedicate }}</span>
    </template>

    <template #templateUsed="{ row }">
      <span class="text-sm text-gray-700">{{ row.templateUsed }}</span>
    </template>

    <template #customerStatus="{ row }">
      <AppStatusBadge :status="row.customerStatus === 'Inquiry' ? 'active' : 'purchased'" :label="row.customerStatus" />
    </template>

    <template #conversion="{ row }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="formatConversionColor(row.conversion)">
        {{ row.conversion }}
      </span>
    </template>

    <template #evidence="{ row }">
      <div v-if="row.evidence" class="w-8 h-8 rounded border overflow-hidden mx-auto cursor-pointer hover:ring-2 hover:ring-primary-500">
        <img src="https://via.placeholder.com/40" class="w-full h-full object-cover" />
      </div>
      <span v-else class="text-[10px] text-gray-400 italic">No Evidence</span>
    </template>

    <template #actions-prepend="{ row }">
      <button 
        @click="emit('view', row)"
        class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <EyeIcon class="mr-3 h-4 w-4 text-gray-400" />
        View Details
      </button>
      <button 
        @click="emit('open-whatsapp', row)"
        class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <PhoneArrowUpRightIcon class="mr-3 h-4 w-4 text-emerald-500" />
        WhatsApp
      </button>
      <button 
        @click="emit('view-customer', row)"
        class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <IdentificationIcon class="mr-3 h-4 w-4 text-blue-500" />
        View Customer
      </button>
    </template>

    <template #actions-append="{ row }">
      <button 
        @click="emit('delete', row)"
        class="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        <TrashIcon class="mr-3 h-4 w-4 text-red-500" />
        Delete
      </button>
    </template>

  </AppDataTable>
</template>

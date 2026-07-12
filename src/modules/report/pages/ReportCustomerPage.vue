<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import ReportFilterPanel from '../components/ReportFilterPanel.vue'
import ReportDetailModal from '../components/ReportDetailModal.vue'
import { useReportData } from '../composables/useReportData'
import type { ReportFilter } from '../types/report.types'
import type { TableColumn } from '@/shared/components/table/table.types'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import { EyeIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const { isLoading, pagination, customersData, loadCustomerReport } = useReportData()
const currentFilters = ref<ReportFilter>({})

onMounted(() => loadCustomerReport(currentFilters.value))
const handleApplyFilter = () => loadCustomerReport(currentFilters.value)

const columns: TableColumn[] = [
  { key: 'customerDate', label: 'Date', type: 'date' },
  { key: 'customer', label: 'Customer', type: 'text' },
  { key: 'area', label: 'Area / Store', type: 'text' },
  { key: 'employee', label: 'Employee', type: 'text' },
  { key: 'product', label: 'Product', type: 'text' },
  { key: 'status', label: 'Status', type: 'status', align: 'center' },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

const detailModalOpen = ref(false)
const selectedData = ref(null)
const handleView = (row: any) => {
  selectedData.value = row
  detailModalOpen.value = true
}

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString() : '-'
</script>

<template>
  <AppPage title="Customer Report" subtitle="Detailed listing of acquired customers.">
    <template #actions>
      <button class="btn btn-outline border px-3 py-1.5 rounded flex items-center gap-2 hover:bg-gray-50">
        <ArrowDownTrayIcon class="w-4 h-4" /> Export CSV
      </button>
    </template>

    <ReportFilterPanel v-model="currentFilters" @apply="handleApplyFilter" />
    
    <AppDataTable :columns="columns" :data="customersData" :loading="isLoading" :total="pagination.total">
      <template #customerDate="{ row }">{{ formatDate(row.customerDate) }}</template>
      <template #customer="{ row }">
        <div class="font-bold">{{ row.fullName }}</div><div class="text-xs text-gray-500">{{ row.phone }}</div>
      </template>
      <template #area="{ row }">
        <div class="font-medium">{{ row.employee?.areas?.[0]?.name || '-' }}</div>
        <div class="text-xs text-gray-500">{{ row.employee?.store?.name || '-' }}</div>
      </template>
      <template #employee="{ row }">{{ row.employee?.fullName || '-' }}</template>
      <template #product="{ row }">{{ row.product || '-' }} <span class="text-xs text-gray-400">x{{ row.quantity || 1 }}</span></template>
      <template #status="{ row }"><AppStatusBadge :status="row.customerStatus==='Purchased'?'purchased':'active'" :label="row.customerStatus" /></template>
      <template #actions-prepend="{ row }">
        <button @click="handleView(row)" class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <EyeIcon class="mr-3 h-4 w-4" /> View Details
        </button>
      </template>
    </AppDataTable>

    <ReportDetailModal :is-open="detailModalOpen" title="Customer Detail" :data="selectedData" @close="detailModalOpen = false" />
  </AppPage>
</template>

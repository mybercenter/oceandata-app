<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import ReportFilterPanel from '../components/ReportFilterPanel.vue'
import ReportDetailModal from '../components/ReportDetailModal.vue'
import { useReportData } from '../composables/useReportData'
import type { ReportFilter } from '../types/report.types'
import type { TableColumn } from '@/shared/components/table/table.types'
import { EyeIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const { isLoading, pagination, followUpsData, loadFollowUpReport } = useReportData()
const currentFilters = ref<ReportFilter>({})

onMounted(() => loadFollowUpReport(currentFilters.value))
const handleApplyFilter = () => loadFollowUpReport(currentFilters.value)

const columns: TableColumn[] = [
  { key: 'followUpDate', label: 'Date', type: 'date' },
  { key: 'customer', label: 'Customer', type: 'text' },
  { key: 'employee', label: 'Employee', type: 'text' },
  { key: 'dedicate', label: 'Dedicate', type: 'text' },
  { key: 'templateUsed', label: 'Template', type: 'text' },
  { key: 'conversion', label: 'Conversion', type: 'text', align: 'center' },
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
  <AppPage title="Follow Up Report" subtitle="Monitoring of customer interaction activities.">
    <template #actions>
      <button class="btn btn-outline border px-3 py-1.5 rounded flex items-center gap-2 hover:bg-gray-50">
        <ArrowDownTrayIcon class="w-4 h-4" /> Export CSV
      </button>
    </template>
    <ReportFilterPanel v-model="currentFilters" @apply="handleApplyFilter" />
    <AppDataTable :columns="columns" :data="followUpsData" :loading="isLoading" :total="pagination.total">
      <template #followUpDate="{ row }">{{ formatDate(row.followUpDate) }}</template>
      <template #customer="{ row }">
        <div class="font-bold">{{ row.customer?.fullName }}</div>
      </template>
      <template #employee="{ row }">{{ row.employee?.fullName || '-' }}</template>
      <template #dedicate="{ row }"><span class="font-bold">{{ row.dedicate }}</span></template>
      <template #conversion="{ row }">
        <span class="px-2 py-0.5 border rounded text-xs">{{ row.conversion }}</span>
      </template>
      <template #actions-prepend="{ row }">
        <button @click="handleView(row)" class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <EyeIcon class="mr-3 h-4 w-4" /> View Details
        </button>
      </template>
    </AppDataTable>
    <ReportDetailModal :is-open="detailModalOpen" title="Follow Up Detail" :data="selectedData" @close="detailModalOpen = false" />
  </AppPage>
</template>

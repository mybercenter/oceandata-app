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

const { isLoading, pagination, areaData, loadAreaReport } = useReportData()
const currentFilters = ref<ReportFilter>({})

onMounted(() => loadAreaReport(currentFilters.value))
const handleApplyFilter = () => loadAreaReport(currentFilters.value)

const columns: TableColumn[] = [
  { key: 'area', label: 'Area', type: 'text' },
  { key: 'totalStores', label: 'Stores', type: 'text', align: 'center' },
  { key: 'totalEmployees', label: 'Employees', type: 'text', align: 'center' },
  { key: 'totalCustomers', label: 'Customers', type: 'text', align: 'center' },
  { key: 'inquiry', label: 'Inquiry', type: 'text', align: 'center' },
  { key: 'purchased', label: 'Purchased', type: 'text', align: 'center' },
  { key: 'totalFollowUps', label: 'Follow Ups', type: 'text', align: 'center' },
  { key: 'conversionRate', label: 'Conversion', type: 'text', align: 'center' },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

const detailModalOpen = ref(false)
const selectedData = ref(null)
const handleView = (row: any) => {
  selectedData.value = row
  detailModalOpen.value = true
}
</script>

<template>
  <AppPage title="Area Performance" subtitle="Aggregated metrics by operational Area.">
    <template #actions>
      <button class="btn btn-outline border px-3 py-1.5 rounded flex items-center gap-2 hover:bg-gray-50">
        <ArrowDownTrayIcon class="w-4 h-4" /> Export CSV
      </button>
    </template>
    
    <ReportFilterPanel v-model="currentFilters" @apply="handleApplyFilter" hideArea />
    
    <AppDataTable :columns="columns" :data="areaData" :loading="isLoading" :total="pagination.total">
      <template #area="{ row }"><div class="font-bold text-lg">{{ row.area.name }}</div></template>
      <template #totalStores="{ row }">{{ row.totalStores }}</template>
      <template #totalEmployees="{ row }">{{ row.totalEmployees }}</template>
      <template #totalCustomers="{ row }"><span class="font-bold">{{ row.totalCustomers }}</span></template>
      <template #inquiry="{ row }">{{ row.inquiry }}</template>
      <template #purchased="{ row }"><span class="text-emerald-600 font-bold">{{ row.purchased }}</span></template>
      <template #totalFollowUps="{ row }">{{ row.totalFollowUps }}</template>
      <template #conversionRate="{ row }"><span class="font-bold text-purple-600">{{ row.conversionRate }}%</span></template>
      
      <template #actions-prepend="{ row }">
        <button @click="handleView(row)" class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <EyeIcon class="mr-3 h-4 w-4" /> View Details
        </button>
      </template>
    </AppDataTable>

    <ReportDetailModal :is-open="detailModalOpen" title="Area Detail" :data="selectedData" @close="detailModalOpen = false" />
  </AppPage>
</template>

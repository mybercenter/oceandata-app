<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import type { TableColumn } from '@/shared/components/table/table.types'

import CustomerSummaryCards from '../components/CustomerSummaryCards.vue'
import CustomerFormModal from '../components/CustomerFormModal.vue'
import CustomerDetailModal from '../components/CustomerDetailModal.vue'
import FollowUpWorkflowModal from '../../customer-follow-up/components/FollowUpWorkflowModal.vue'

import { useCustomer } from '../composables/useCustomer'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import { useToast } from '@/shared/composables/useToast'
import type { Customer } from '../types/customer.types'

import { areaService } from '../../area/services/area.service'
import { storeService } from '../../store/services/store.service'
import { employeeService } from '../../employee/services/employee.service'
import type { Area } from '../../area/types/area.types'
import type { Store } from '../../store/types/store.types'
import type { Employee } from '../../employee/types/employee.types'

import { PhoneArrowUpRightIcon } from '@heroicons/vue/24/outline'

const {
  customers,
  metrics,
  pagination,
  filters,
  sort,
  isLoading,
  isSubmitting,
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  deleteSelected
} = useCustomer()

const confirm = useConfirmDialog()

const areas = ref<Area[]>([])
const stores = ref<Store[]>([])
const employees = ref<Employee[]>([])

onMounted(async () => {
  areas.value = await areaService.getAreas()
  stores.value = await storeService.getStores()
  employees.value = await employeeService.getEmployees()
  fetchCustomers()
})

const areaOptions = computed(() => [{ label: 'All Areas', value: '' }, ...areas.value.map(a => ({ label: a.name, value: a.id }))])
const storeOptions = computed(() => [{ label: 'All Stores', value: '' }, ...stores.value.map(s => ({ label: s.name, value: s.id }))])
const employeeOptions = computed(() => [{ label: 'All Employees', value: '' }, ...employees.value.map(e => ({ label: e.fullName, value: e.id }))])

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
  { key: 'customerDate', label: 'Date', type: 'date', sortable: true },
  { key: 'fullName', label: 'Customer Name', type: 'text', sortable: true },
  { key: 'phone', label: 'Phone', type: 'text', sortable: false },
  { key: 'product', label: 'Product', type: 'text', sortable: true },
  { key: 'customerStatus', label: 'Status', type: 'status', align: 'center', sortable: true },
  { key: 'currentConversion', label: 'Conversion', type: 'status', align: 'center', sortable: true },
  { key: 'employee', label: 'Employee', type: 'text', sortable: true },
  { key: 'lastFollowUp', label: 'Last Follow Up', type: 'date', sortable: true },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isFollowUpModalOpen = ref(false)
const selectedCustomer = ref<Customer | null>(null)

const handleSort = (key: string, order: 'asc'|'desc') => {
  sort.value = { key, order }
  fetchCustomers()
}

const handleCreateNew = () => {
  selectedCustomer.value = null
  isFormModalOpen.value = true
}

const handleView = (customer: Customer) => {
  selectedCustomer.value = customer
  isDetailModalOpen.value = true
}

const handleEdit = (customer: Customer) => {
  selectedCustomer.value = customer
  isDetailModalOpen.value = false
  isFormModalOpen.value = true
}

const handleFollowUp = (customer: Customer) => {
  selectedCustomer.value = customer
  isFollowUpModalOpen.value = true
}

const handleDelete = (customer: Customer) => {
  confirm.confirm({
    title: 'Delete Customer',
    message: 'Are you sure you want to delete customer ' + customer.fullName + '?',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      await deleteCustomer(customer.id)
      if (selectedCustomer.value?.id === customer.id) {
        isDetailModalOpen.value = false
      }
    }
  })
}

const handleDeleteSelected = (ids: string[]) => {
  confirm.confirm({
    title: 'Delete Selected Customers',
    message: 'Are you sure you want to delete ' + ids.length + ' selected customers?',
    confirmText: 'Delete All',
    type: 'danger',
    onConfirm: async () => {
      await deleteSelected(ids)
    }
  })
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  if (selectedCustomer.value) {
    success = await updateCustomer(selectedCustomer.value.id, data)
  } else {
    success = await createCustomer(data)
  }

  if (success) {
    if (!createAnother) {
      isFormModalOpen.value = false
    } else {
      selectedCustomer.value = null
    }
  }
}

watch(filters, () => {
  pagination.value.page = 1
  fetchCustomers()
}, { deep: true })

const formatConversionColor = (conversion: string) => {
  switch (conversion) {
    case 'Hot Prospect': return 'text-red-700 bg-red-100 border-red-200'
    case 'Prospect': return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'Potential': return 'text-amber-700 bg-amber-100 border-amber-200'
    default: return 'text-gray-700 bg-gray-100 border-gray-200'
  }
}

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}
</script>

<template>
  <AppPage 
    title="Customer Management" 
    subtitle="Manage customer information and prepare follow-up activities."
  >
    <!-- CRM Summary Cards -->
    <CustomerSummaryCards :metrics="metrics" />

    <AppDataTable 
      :columns="columns"
      :data="customers"
      :loading="isLoading"
      :total="pagination.total"
      :filters="filters"
      showAdd
      showExport
      enableSelection
      emptyTitle="No Customers Found"
      @update:filters="filters = $event"
      @update:pagination="fetchCustomers"
      @sort="handleSort"
      @refresh="fetchCustomers"
      @add="handleCreateNew"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
    >
      <template #filters>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          <AppSelect v-model="filters.areaId" :options="areaOptions" />
          <AppSelect v-model="filters.storeId" :options="storeOptions" />
          <AppSelect v-model="filters.employeeId" :options="employeeOptions" />
          <AppSelect v-model="filters.customerStatus" :options="statusOptions" />
          <AppSelect v-model="filters.currentConversion" :options="conversionOptions" />
        </div>
      </template>

      <!-- Custom Column Renderers -->
      <template #customerDate="{ row }">
        <span class="text-gray-600 font-medium whitespace-nowrap">{{ formatDate(row.customerDate) }}</span>
      </template>

      <template #fullName="{ row }">
        <div class="flex flex-col">
          <span class="font-bold text-gray-900">{{ row.fullName }}</span>
          <span v-if="row.gender" class="text-xs text-gray-400">{{ row.gender }}</span>
        </div>
      </template>

      <template #product="{ row }">
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">{{ row.product || '-' }}</span>
          <span v-if="row.quantity" class="text-xs text-gray-500">Qty: {{ row.quantity }}</span>
        </div>
      </template>

      <template #customerStatus="{ row }">
        <AppStatusBadge :status="row.customerStatus === 'Inquiry' ? 'active' : 'purchased'" :label="row.customerStatus" />
      </template>

      <template #currentConversion="{ row }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="formatConversionColor(row.currentConversion)">
          {{ row.currentConversion }}
        </span>
      </template>

      <template #employee="{ row }">
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">{{ row.employee?.fullName || '-' }}</span>
          <span class="text-xs text-gray-500">{{ row.employee?.store?.name || '-' }}</span>
        </div>
      </template>

      <template #lastFollowUp="{ row }">
        <span v-if="row.lastFollowUp" class="text-gray-600 whitespace-nowrap">{{ formatDate(row.lastFollowUp) }}</span>
        <span v-else class="text-gray-400 text-xs italic">Never</span>
      </template>

      <!-- Custom Actions -->
      <template #actions-prepend="{ row }">
        <button 
          @click="handleFollowUp(row)"
          class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          <PhoneArrowUpRightIcon class="mr-3 h-4 w-4 text-emerald-500" aria-hidden="true" />
          Follow Up Now
        </button>
      </template>

    </AppDataTable>

    <!-- Modals -->
    <CustomerFormModal 
      :is-open="isFormModalOpen"
      :initial-data="selectedCustomer"
      :loading="isSubmitting"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <CustomerDetailModal 
      :is-open="isDetailModalOpen"
      :customer="selectedCustomer"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />

    <!-- Follow Up Workflow Modal -->
    <FollowUpWorkflowModal 
      :is-open="isFollowUpModalOpen"
      :customer="selectedCustomer"
      @close="isFollowUpModalOpen = false"
      @success="fetchCustomers"
    />

  </AppPage>
</template>

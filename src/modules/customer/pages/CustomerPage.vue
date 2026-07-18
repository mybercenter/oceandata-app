<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import type { TableColumn } from '@/shared/components/table/table.types'

import CustomerSummaryCards from '../components/CustomerSummaryCards.vue'
import CustomerFormModal from '../components/CustomerFormModal.vue'
import CustomerDetailModal from '../components/CustomerDetailModal.vue'
import FollowUpWorkflowModal from '../../customer-follow-up/components/FollowUpWorkflowModal.vue'

import { useCustomer } from '../composables/useCustomer'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import type { Customer } from '../types/customer.types'

import { useLookupStore } from '@/stores/lookup.store'
import { storeToRefs } from 'pinia'

import { PhoneArrowUpRightIcon } from '@heroicons/vue/24/outline'

import { useAuth } from '@/shared/composables/useAuth'

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
  deleteSelected,
  exportCustomers
} = useCustomer()

const { hasPermission } = useAuth()

const confirm = useConfirmDialog()

const lookupStore = useLookupStore()
const { areas, stores, employees } = storeToRefs(lookupStore)

onMounted(async () => {
  await lookupStore.fetchLookups()
  fetchCustomers()
})

const areaOptions = computed(() => [{ label: 'All Areas', value: '' }, ...areas.value.map((a: any) => ({ label: a.name || a.area_name || (a as any).areaName, value: a.id }))])
const storeOptions = computed(() => [{ label: 'All Stores', value: '' }, ...stores.value.map((s: any) => ({ label: s.name, value: s.id }))])
const employeeOptions = computed(() => [{ label: 'All Employees', value: '' }, ...employees.value.map((e: any) => ({ label: e.full_name || e.name || (e as any).fullName, value: e.id }))])

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
  { key: 'customer_date', label: 'Date', type: 'date', sortable: true },
  { key: 'full_name', label: 'Customer Name', type: 'text', sortable: true },
  { key: 'phone', label: 'Phone', type: 'text', sortable: false },
  { key: 'product', label: 'Product', type: 'text', sortable: true },
  { key: 'customer_status', label: 'Status', type: 'status', align: 'center', sortable: true },
  { key: 'current_conversion', label: 'Conversion', type: 'status', align: 'center', sortable: true },
  { key: 'employee', label: 'Employee', type: 'text', sortable: true },
  { key: 'latest_follow_up', label: 'Last Follow Up', type: 'date', sortable: true },
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
    message: 'Are you sure you want to delete customer ' + customer.full_name + '?',
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

const handleDeleteSelected = (ids: (string|number)[]) => {
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

const formErrors = ref<Record<string, string[]>>({})

const handleExport = async () => {
  await exportCustomers()
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  formErrors.value = {}
  
  try {
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
  } catch (error: any) {
    if (error.response?.status === 422) {
      formErrors.value = error.response.data.errors || {}
    }
  }
}

watch(filters, () => {
  pagination.value.page = 1
  fetchCustomers()
}, { deep: true })

const formatConversionColor = (conversion: string | null) => {
  if (!conversion) return 'text-gray-500 bg-gray-50 border-gray-200'
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
      :showAdd="hasPermission('customer.create')"
      :showEdit="hasPermission('customer.update')"
      :showDelete="hasPermission('customer.delete')"
      :showExport="hasPermission('customer.export') || hasPermission('customer.view')"
      enableSelection
      emptyTitle="No Customers Found"
      @update:filters="filters = { ...filters, ...$event }"
      @update:pagination="fetchCustomers"
      @sort="handleSort"
      @refresh="fetchCustomers"
      @add="handleCreateNew"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
      @export="handleExport"
    >
      <template #filters>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 w-full">
          <AppSelect v-model="filters.area_id" :options="areaOptions" />
          <AppSelect v-model="filters.store_id" :options="storeOptions" />
          <AppSelect v-model="filters.employee_id" :options="employeeOptions" />
          <AppSelect v-model="filters.customer_status" :options="statusOptions" />
          <AppSelect v-model="filters.current_conversion" :options="conversionOptions" />
          <AppInput type="date" v-model="filters.customer_date_from" title="From Date" />
          <AppInput type="date" v-model="filters.customer_date_to" title="To Date" />
        </div>
      </template>

      <!-- Custom Column Renderers -->
      <template #customer_date="{ row }">
        <span class="text-gray-600 font-medium whitespace-nowrap">{{ formatDate(row.customer_date) }}</span>
      </template>

      <template #full_name="{ row }">
        <div class="flex flex-col">
          <span class="font-bold text-gray-900">{{ row.full_name }}</span>
          <span v-if="row.gender" class="text-xs text-gray-400">{{ row.gender }}</span>
        </div>
      </template>

      <template #product="{ row }">
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">{{ row.product || '-' }}</span>
          <span v-if="row.quantity" class="text-xs text-gray-500">Qty: {{ row.quantity }}</span>
        </div>
      </template>

      <template #customer_status="{ row }">
        <AppStatusBadge :status="row.customer_status === 'Inquiry' ? 'active' : 'purchased'" :label="row.customer_status" />
      </template>

      <template #current_conversion="{ row }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="formatConversionColor(row.current_conversion)">
          {{ row.current_conversion || 'Belum Ada' }}
        </span>
      </template>

      <template #employee="{ row }">
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">{{ row.employee?.full_name || '-' }}</span>
          <span class="text-xs text-gray-500">{{ row.employee?.store?.name || '-' }}</span>
        </div>
      </template>

      <template #latest_follow_up="{ row }">
        <span v-if="row.latest_follow_up" class="text-gray-600 whitespace-nowrap">{{ formatDate(row.latest_follow_up.follow_up_date) }}</span>
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
      :errors="formErrors"
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

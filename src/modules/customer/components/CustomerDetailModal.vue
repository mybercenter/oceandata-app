<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppTabs from '@/shared/components/ui/AppTabs.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import { PencilSquareIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/vue/24/outline'

import type { Customer } from '../types/customer.types'
import CustomerTimeline from './CustomerTimeline.vue'
import { useCustomerFollowUp } from '../../customer-follow-up/composables/useCustomerFollowUp'
import type { TableColumn } from '@/shared/components/table/table.types'

const props = defineProps<{
  isOpen: boolean
  customer: Customer | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', customer: Customer): void
}>()

const activeTab = ref(0)
const tabs = ['Overview', 'Follow Up History', 'Timeline']

const { followUps, isLoading, fetchHistory, pagination } = useCustomerFollowUp()

watch(() => props.isOpen, (val) => {
  if (val && props.customer) {
    activeTab.value = 0
    fetchHistory(props.customer.id)
  }
})

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const formatDateTime = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
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

const historyColumns: TableColumn[] = [
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'dedicate', label: 'Dedicate', type: 'text' },
  { key: 'template', label: 'Template', type: 'text' },
  { key: 'conversion', label: 'Conversion', type: 'status' },
  { key: 'employee', label: 'By', type: 'text' },
  { key: 'notes', label: 'Notes', type: 'text' }
]

const handleHistoryPagination = () => {
  if (props.customer) fetchHistory(props.customer.id)
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="customer?.fullName ? 'Customer: ' + customer.fullName : 'Customer Details'"
    size="xl"
    @close="emit('close')"
  >
    <div v-if="customer" class="min-h-[400px]">
      
      <div class="mb-4 bg-gray-50 border border-gray-200 p-4 rounded-lg flex justify-between items-center">
        <div>
          <h2 class="font-bold text-lg text-gray-900">{{ customer.fullName }}</h2>
          <p class="text-sm text-gray-500">{{ customer.phone || 'No phone number' }}</p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <AppStatusBadge :status="customer.customerStatus === 'Inquiry' ? 'active' : 'purchased'" :label="customer.customerStatus" />
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="formatConversionColor(customer.currentConversion)">
            {{ customer.currentConversion }}
          </span>
        </div>
      </div>

      <AppTabs :tabs="tabs" v-model="activeTab">
        <!-- Overview Tab -->
        <div v-if="activeTab === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Customer Information</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-xs font-medium text-gray-500">Customer Date</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(customer.customerDate) }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500">Gender</dt>
                <dd class="text-sm text-gray-900">{{ customer.gender || '-' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500">Social Media</dt>
                <dd class="text-sm text-gray-900">{{ customer.socialMedia || '-' }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Product Interested</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-xs font-medium text-gray-500">Product Name</dt>
                <dd class="text-sm text-gray-900 font-medium">{{ customer.product || '-' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500">Quantity</dt>
                <dd class="text-sm text-gray-900">{{ customer.quantity || '-' }}</dd>
              </div>
            </dl>
          </div>

          <div class="md:col-span-2">
            <h3 class="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Assignment Information</h3>
            <dl class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div>
                <dt class="text-xs font-medium text-gray-500">Employee</dt>
                <dd class="text-sm text-gray-900 font-medium">{{ customer.employee?.fullName || '-' }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500">Store</dt>
                <dd class="text-sm text-gray-900">{{ customer.employee?.store?.name || '-' }}</dd>
              </div>
              <div class="col-span-2">
                <dt class="text-xs font-medium text-gray-500">Area</dt>
                <dd class="text-sm text-gray-900">{{ customer.employee?.areas?.map(a => a.name).join(', ') || '-' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Follow Up History Tab -->
        <div v-if="activeTab === 1">
          <AppDataTable 
            :columns="historyColumns"
            :data="followUps"
            :loading="isLoading"
            :total="pagination.total"
            emptyTitle="No Follow Up History"
            @update:pagination="handleHistoryPagination"
          >
            <template #date="{ row }">
              <span class="text-gray-600 whitespace-nowrap">{{ formatDateTime(row.followUpDate) }}</span>
            </template>
            
            <template #dedicate="{ row }">
              <span class="font-bold text-gray-700">{{ row.dedicate }}</span>
            </template>

            <template #template="{ row }">
              <span class="text-sm text-gray-700">{{ row.templateUsed }}</span>
            </template>

            <template #conversion="{ row }">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border" :class="formatConversionColor(row.conversion)">
                {{ row.conversion }}
              </span>
            </template>

            <template #employee="{ row }">
              <span class="text-sm text-gray-900">{{ row.employee?.fullName }}</span>
            </template>

            <template #notes="{ row }">
              <div class="max-w-xs text-sm text-gray-600 line-clamp-2" :title="row.notes">
                {{ row.notes || '-' }}
              </div>
            </template>
          </AppDataTable>
        </div>

        <!-- Timeline Tab -->
        <div v-if="activeTab === 2">
          <div class="max-w-md mx-auto py-4">
            <CustomerTimeline 
              :created-at="customer.createdAt"
              :conversion="customer.currentConversion"
              :status="customer.customerStatus"
              :last-follow-up="customer.lastFollowUp"
            />
          </div>
        </div>
      </AppTabs>
    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
        <AppButton v-if="customer" variant="primary" @click="emit('edit', customer)">
          <PencilSquareIcon class="w-4 h-4 mr-2" />
          Edit Data
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

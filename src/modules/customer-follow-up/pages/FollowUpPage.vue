<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { PlusIcon, ArrowPathIcon, ArrowDownTrayIcon, ListBulletIcon, CalendarIcon, ViewColumnsIcon } from '@heroicons/vue/24/outline'

import FollowUpSummaryCards from '../components/FollowUpSummaryCards.vue'
import FollowUpTableView from '../views/FollowUpTableView.vue'
import FollowUpCalendarView from '../views/FollowUpCalendarView.vue'
import FollowUpKanbanView from '../views/FollowUpKanbanView.vue'
import FollowUpWorkflowModal from '../components/FollowUpWorkflowModal.vue'
import FollowUpDetailModal from '../components/FollowUpDetailModal.vue'

import { useCustomerFollowUp } from '../composables/useCustomerFollowUp'
import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { useLookupStore } from '@/stores/lookup.store'
import { storeToRefs } from 'pinia'

const {
  followUps,
  pagination,
  isLoading,
  fetchHistory,
  openWhatsapp
} = useCustomerFollowUp()

const lookupStore = useLookupStore()
const { areas, stores, employees } = storeToRefs(lookupStore)

const viewMode = ref<'table' | 'calendar' | 'kanban'>('table')

const filters = ref({
  areaId: '',
  storeId: '',
  employeeId: '',
  dedicate: ''
})

onMounted(async () => {
  await lookupStore.fetchLookups()
  fetchHistory()
})

watch(filters, () => {
  pagination.value.page = 1
  fetchHistory()
}, { deep: true })

// Modals State
const isWorkflowOpen = ref(false)
const isDetailOpen = ref(false)
const selectedFollowUp = ref<CustomerFollowUp | null>(null)

// Summary Metrics computed locally for demo
const summaryMetrics = computed(() => {
  const total = pagination.value.total
  const today = followUps.value.filter(f => new Date(f.followUpDate).toDateString() === new Date().toDateString()).length
  
  // mock counts
  const thisWeek = Math.min(total, 45)
  const thisMonth = Math.min(total, 120)
  
  const potential = followUps.value.filter(f => (f.customer as any)?.current_conversion === 'Potential').length
  const prospect = followUps.value.filter(f => (f.customer as any)?.current_conversion === 'Prospect').length
  const hotProspect = followUps.value.filter(f => (f.customer as any)?.current_conversion === 'Hot Prospect').length
  const purchased = followUps.value.filter(f => (f.customer as any)?.customer_status === 'Purchased').length
  
  return { total, today, thisWeek, thisMonth, potential, prospect, hotProspect, purchased }
})

// Handlers
const handleNew = () => {
  isWorkflowOpen.value = true
}

const handleView = (row: CustomerFollowUp) => {
  selectedFollowUp.value = row
  isDetailOpen.value = true
}

const handleOpenWhatsapp = async (row: CustomerFollowUp) => {
  if (row.customer?.phone) {
    await openWhatsapp(row.customer.phone, row.whatsappMessage)
  }
}

const handleRefresh = () => {
  fetchHistory()
}
</script>

<template>
  <AppPage 
    title="Follow Up Management" 
    subtitle="Manage customer follow-up activities and monitor conversion progress."
  >


    <FollowUpSummaryCards v-bind="summaryMetrics" />

    <!-- View Toggle -->
    <div class="mb-4 flex justify-end">
      <div class="bg-gray-100 p-1 rounded-lg inline-flex">
        <button 
          @click="viewMode = 'table'"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'table' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'"
        >
          <ListBulletIcon class="w-4 h-4 mr-2" />
          Table List
        </button>
        <button 
          @click="viewMode = 'calendar'"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'calendar' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'"
        >
          <CalendarIcon class="w-4 h-4 mr-2" />
          Calendar
        </button>
        <button 
          @click="viewMode = 'kanban'"
          class="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'kanban' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'"
        >
          <ViewColumnsIcon class="w-4 h-4 mr-2" />
          Kanban
        </button>
      </div>
    </div>

    <!-- Views -->
    <div v-if="viewMode === 'table'">
      <FollowUpTableView 
        :data="followUps"
        :loading="isLoading"
        :total="pagination.total"
        :filters="filters"
        :areas="areas"
        :stores="stores"
        :employees="employees"
        @update:filters="filters = $event"
        @pagination="fetchHistory"
        @refresh="fetchHistory"
        @add="handleNew"
        @view="handleView"
        @open-whatsapp="handleOpenWhatsapp"
      />
    </div>
    
    <div v-else-if="viewMode === 'calendar'">
      <FollowUpCalendarView :data="followUps" />
    </div>

    <div v-else-if="viewMode === 'kanban'">
      <FollowUpKanbanView :data="followUps" />
    </div>

    <!-- Modals -->
    <FollowUpWorkflowModal 
      :is-open="isWorkflowOpen"
      :customer="null"
      @close="isWorkflowOpen = false"
      @success="fetchHistory"
    />

    <FollowUpDetailModal 
      :is-open="isDetailOpen"
      :follow-up="selectedFollowUp"
      @close="isDetailOpen = false"
    />

  </AppPage>
</template>

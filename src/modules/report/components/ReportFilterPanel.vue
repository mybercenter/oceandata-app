<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'

import { useLookupStore } from '@/stores/lookup.store'
import { storeToRefs } from 'pinia'
import type { ReportFilter } from '../types/report.types'

const props = defineProps<{
  modelValue: ReportFilter
  hideRole?: boolean
  hideArea?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: ReportFilter): void
  (e: 'apply'): void
}>()

const localFilter = ref<ReportFilter>({ ...props.modelValue })

const lookupStore = useLookupStore()
const { areas, stores, employees } = storeToRefs(lookupStore)

onMounted(async () => {
  await lookupStore.fetchLookups()
})

watch(() => props.modelValue, (val) => {
  localFilter.value = { ...val }
}, { deep: true })

const setQuickDate = (type: string) => {
  const today = new Date()
  let start = new Date()
  let end = new Date()
  
  if (type === 'today') {
    // leave as today
  } else if (type === 'yesterday') {
    start.setDate(start.getDate() - 1)
    end.setDate(end.getDate() - 1)
  } else if (type === 'thisWeek') {
    const first = start.getDate() - start.getDay()
    start = new Date(start.setDate(first))
  } else if (type === 'thisMonth') {
    start = new Date(start.getFullYear(), start.getMonth(), 1)
  } else if (type === 'lastMonth') {
    start = new Date(start.getFullYear(), start.getMonth() - 1, 1)
    end = new Date(end.getFullYear(), end.getMonth(), 0)
  } else if (type === 'thisYear') {
    start = new Date(start.getFullYear(), 0, 1)
  }
  
  localFilter.value.startDate = start.toISOString().split('T')[0]
  localFilter.value.endDate = end.toISOString().split('T')[0]
}

const handleReset = () => {
  localFilter.value = {}
  emit('update:modelValue', localFilter.value)
  emit('apply')
}

const handleApply = () => {
  emit('update:modelValue', localFilter.value)
  emit('apply')
}
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
    <div class="flex flex-col lg:flex-row gap-6">
      
      <!-- Date Range Section -->
      <div class="flex-shrink-0">
        <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Date Range</h4>
        <div class="flex flex-col sm:flex-row gap-3 mb-3">
          <AppInput type="date" label="Start Date" v-model="localFilter.startDate" />
          <AppInput type="date" label="End Date" v-model="localFilter.endDate" />
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="setQuickDate('today')" class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">Today</button>
          <button @click="setQuickDate('yesterday')" class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">Yesterday</button>
          <button @click="setQuickDate('thisWeek')" class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">This Week</button>
          <button @click="setQuickDate('thisMonth')" class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">This Month</button>
          <button @click="setQuickDate('lastMonth')" class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">Last Month</button>
          <button @click="setQuickDate('thisYear')" class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">This Year</button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
        <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Data Filters</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AppSelect 
            v-if="!hideArea"
            label="Area" 
            v-model="localFilter.areaId" 
            :options="[{label:'All Areas', value:''}, ...areas.map(a => ({label: a.name || a.area_name || (a as any).areaName, value: a.id}))]" 
          />
          <AppSelect 
            label="Store" 
            v-model="localFilter.storeId" 
            :options="[{label:'All Stores', value:''}, ...stores.map(s => ({label: s.name, value: s.id}))]" 
          />
          <AppSelect 
            label="Employee" 
            v-model="localFilter.employeeId" 
            :options="[{label:'All Employees', value:''}, ...employees.map(e => ({label: e.name || e.fullName || e.full_name, value: e.id}))]" 
          />
          <AppSelect 
            label="Dedicate" 
            v-model="localFilter.dedicate" 
            :options="[{label:'All', value:''}, {label:'AV', value:'AV'}, {label:'HA', value:'HA'}]" 
          />
          <AppSelect 
            label="Status" 
            v-model="localFilter.customerStatus" 
            :options="[{label:'All', value:''}, {label:'Inquiry', value:'Inquiry'}, {label:'Purchased', value:'Purchased'}]" 
          />
          <AppSelect 
            label="Conversion" 
            v-model="localFilter.conversion" 
            :options="[{label:'All', value:''}, {label:'Potential', value:'Potential'}, {label:'Prospect', value:'Prospect'}, {label:'Hot Prospect', value:'Hot Prospect'}]" 
          />
        </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
      <AppButton variant="outline" @click="handleReset">Reset Filters</AppButton>
      <AppButton variant="primary" @click="handleApply">Apply Filters</AppButton>
    </div>
  </div>
</template>

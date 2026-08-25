<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import http from '@/shared/services/http'

const emit = defineEmits<{
  (e: 'update:filters', filters: Record<string, any>): void
}>()

const dateRange = ref('this_month')
const selectedArea = ref('all')
const selectedStore = ref('all')

const areas = ref<any[]>([])
const stores = ref<any[]>([])

const fetchLookups = async () => {
  try {
    const response = await http.get('/lookups')
    if (response.data && response.data.data) {
      areas.value = response.data.data.areas || []
      stores.value = response.data.data.stores || []
    }
  } catch (error) {
    console.error('Failed to fetch lookups', error)
  }
}

const filteredStores = computed(() => {
  if (selectedArea.value === 'all') return stores.value
  return stores.value.filter(s => s.area_id.toString() === selectedArea.value.toString())
})

const getFilters = () => {
  const filters: Record<string, any> = {}
  
  if (selectedArea.value !== 'all') filters.area_id = selectedArea.value
  if (selectedStore.value !== 'all') filters.store_id = selectedStore.value

  const today = new Date()
  if (dateRange.value === 'today') {
    const dateStr = today.toISOString().split('T')[0]
    filters.date_from = dateStr
    filters.date_to = dateStr
  } else if (dateRange.value === 'this_week') {
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    filters.date_from = startOfWeek.toISOString().split('T')[0]
    filters.date_to = today.toISOString().split('T')[0]
  } else if (dateRange.value === 'this_month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    filters.date_from = startOfMonth.toISOString().split('T')[0]
    filters.date_to = today.toISOString().split('T')[0]
  } else if (dateRange.value === 'this_year') {
    const startOfYear = new Date(today.getFullYear(), 0, 1)
    filters.date_from = startOfYear.toISOString().split('T')[0]
    filters.date_to = today.toISOString().split('T')[0]
  }

  return filters
}

watch([selectedArea, selectedStore, dateRange], () => {
  emit('update:filters', getFilters())
})

onMounted(() => {
  fetchLookups()
  // Optional: Emit initial filters if needed, but fetchAllData handles its own defaults
})
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <span class="font-medium text-gray-700">Filters</span>
    </div>

    <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
      <select v-model="selectedArea" @change="selectedStore = 'all'" class="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2">
        <option value="all">All Areas</option>
        <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.name }}</option>
      </select>

      <select v-model="selectedStore" class="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2">
        <option value="all">All Stores</option>
        <option v-for="store in filteredStores" :key="store.id" :value="store.id">{{ store.name }}</option>
      </select>

      <div class="h-6 w-px bg-gray-200 hidden sm:block"></div>

      <select v-model="dateRange" class="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2">
        <option value="today">Today</option>
        <option value="this_week">This Week</option>
        <option value="this_month">This Month</option>
        <option value="this_year">This Year</option>
      </select>
    </div>
  </div>
</template>

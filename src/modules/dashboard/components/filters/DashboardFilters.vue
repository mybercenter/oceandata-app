<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { CalendarDaysIcon, FunnelIcon, BuildingStorefrontIcon, MapIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import http from '@/shared/services/http'

const emit = defineEmits<{
  (e: 'update:filters', filters: Record<string, any>): void
}>()

// Filter state
const dateRangeMode = ref<'preset' | 'custom'>('preset')
const selectedPreset = ref('this_month')
const customDateFrom = ref('')
const customDateTo = ref('')
const selectedArea = ref('all')
const selectedStore = ref('all')

// Lookup data
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

const dateRangeLabel = computed(() => {
  if (dateRangeMode.value === 'custom') {
    if (customDateFrom.value && customDateTo.value) {
      return `${customDateFrom.value} s/d ${customDateTo.value}`
    }
    return 'Pilih Tanggal'
  }
  const labels: Record<string, string> = {
    today: 'Hari Ini',
    this_week: 'Minggu Ini',
    this_month: 'Bulan Ini',
    this_year: 'Tahun Ini',
    all: 'Semua Data',
  }
  return labels[selectedPreset.value] || 'Bulan Ini'
})

const getDateFilters = (): { date_from?: string; date_to?: string } => {
  const today = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  if (dateRangeMode.value === 'custom') {
    const result: { date_from?: string; date_to?: string } = {}
    if (customDateFrom.value) result.date_from = customDateFrom.value
    if (customDateTo.value) result.date_to = customDateTo.value
    return result
  }

  switch (selectedPreset.value) {
    case 'today': {
      const d = fmt(today)
      return { date_from: d, date_to: d }
    }
    case 'this_week': {
      const start = new Date(today)
      start.setDate(today.getDate() - today.getDay())
      return { date_from: fmt(start), date_to: fmt(today) }
    }
    case 'this_month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      return { date_from: fmt(start), date_to: fmt(today) }
    }
    case 'this_year': {
      const start = new Date(today.getFullYear(), 0, 1)
      return { date_from: fmt(start), date_to: fmt(today) }
    }
    case 'all':
    default:
      return {}
  }
}

const buildFilters = (): Record<string, any> => {
  const filters: Record<string, any> = {}
  if (selectedArea.value !== 'all') filters.area_id = selectedArea.value
  if (selectedStore.value !== 'all') filters.store_id = selectedStore.value
  return { ...filters, ...getDateFilters() }
}

const emitFilters = () => {
  emit('update:filters', buildFilters())
}

const selectPreset = (preset: string) => {
  dateRangeMode.value = 'preset'
  selectedPreset.value = preset
}

const switchToCustom = () => {
  dateRangeMode.value = 'custom'
}

const clearCustomDates = () => {
  customDateFrom.value = ''
  customDateTo.value = ''
  dateRangeMode.value = 'preset'
  selectedPreset.value = 'this_month'
}

const resetFilters = () => {
  selectedArea.value = 'all'
  selectedStore.value = 'all'
  dateRangeMode.value = 'preset'
  selectedPreset.value = 'this_month'
  customDateFrom.value = ''
  customDateTo.value = ''
}

// Emit when custom dates are both filled
watch([customDateFrom, customDateTo], ([from, to]) => {
  if (dateRangeMode.value === 'custom') {
    // Only emit if at least one date is set
    if (from || to) emitFilters()
  }
})

watch([selectedArea, selectedStore], () => {
  if (selectedArea.value !== 'all') selectedStore.value = 'all'
  emitFilters()
})

watch([selectedPreset, dateRangeMode], () => {
  if (dateRangeMode.value === 'preset') emitFilters()
})

onMounted(() => {
  fetchLookups()
})

// Expose buildFilters so parent can get initial filters
defineExpose({ buildFilters })
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header bar -->
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
      <div class="flex items-center gap-2">
        <FunnelIcon class="w-4 h-4 text-gray-500" />
        <span class="text-sm font-semibold text-gray-700">Filter Dashboard</span>
      </div>
      <button
        @click="resetFilters"
        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <XMarkIcon class="w-3.5 h-3.5" />
        Reset
      </button>
    </div>

    <div class="p-4 flex flex-col lg:flex-row gap-4 lg:items-end">

      <!-- Date Range Presets -->
      <div class="flex-1">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rentang Waktu</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="preset in [
              { key: 'today', label: 'Hari Ini' },
              { key: 'this_week', label: 'Minggu Ini' },
              { key: 'this_month', label: 'Bulan Ini' },
              { key: 'this_year', label: 'Tahun Ini' },
              { key: 'all', label: 'Semua Data' },
            ]"
            :key="preset.key"
            @click="selectPreset(preset.key)"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              dateRangeMode === 'preset' && selectedPreset === preset.key
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ preset.label }}
          </button>

          <!-- Custom toggle -->
          <button
            @click="switchToCustom"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              dateRangeMode === 'custom'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            <CalendarDaysIcon class="w-3.5 h-3.5" />
            Kustom
          </button>
        </div>

        <!-- Custom date picker -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="dateRangeMode === 'custom'" class="mt-2.5 flex items-center gap-2">
            <div class="flex items-center gap-2 flex-1">
              <div class="relative flex-1">
                <input
                  v-model="customDateFrom"
                  type="date"
                  :max="customDateTo || undefined"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Dari tanggal"
                />
                <span class="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-400 font-medium">Dari</span>
              </div>
              <span class="text-gray-400 text-sm font-medium">—</span>
              <div class="relative flex-1">
                <input
                  v-model="customDateTo"
                  type="date"
                  :min="customDateFrom || undefined"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Sampai tanggal"
                />
                <span class="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-400 font-medium">Sampai</span>
              </div>
            </div>
            <button @click="clearCustomDates" class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </Transition>
      </div>

      <!-- Divider -->
      <div class="hidden lg:block w-px h-12 bg-gray-100"></div>

      <!-- Area & Store Filters -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 sm:w-48">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <MapIcon class="w-3.5 h-3.5 inline mr-1" />Area
          </label>
          <select
            v-model="selectedArea"
            @change="selectedStore = 'all'"
            class="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block px-3 py-2 outline-none"
          >
            <option value="all">Semua Area</option>
            <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.name }}</option>
          </select>
        </div>

        <div class="flex-1 sm:w-48">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <BuildingStorefrontIcon class="w-3.5 h-3.5 inline mr-1" />Toko
          </label>
          <select
            v-model="selectedStore"
            class="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block px-3 py-2 outline-none"
          >
            <option value="all">Semua Toko</option>
            <option v-for="store in filteredStores" :key="store.id" :value="store.id">{{ store.name }}</option>
          </select>
        </div>
      </div>

      <!-- Active Filter Badge -->
      <div v-if="selectedArea !== 'all' || selectedStore !== 'all' || dateRangeMode === 'custom'" class="flex items-center">
        <div class="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-primary-100">
          <span class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
          Filter aktif
        </div>
      </div>
    </div>
  </div>
</template>

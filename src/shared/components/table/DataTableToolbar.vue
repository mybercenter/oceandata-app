<script setup lang="ts">
import { ref } from 'vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon, DocumentArrowDownIcon, PlusIcon, FunnelIcon } from '@heroicons/vue/24/outline'

const showMobileFilters = ref(false)

const props = defineProps<{
  search: string
  status?: string
  statusOptions?: { label: string; value: string }[]
  loading?: boolean
  showAdd?: boolean
  showExport?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:status', value: string | number): void
  (e: 'refresh'): void
  (e: 'clear'): void
  (e: 'export'): void
  (e: 'add'): void
}>()

const defaultStatusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const options = props.statusOptions || defaultStatusOptions
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-4 p-5 bg-white border-b border-gray-100">
    <!-- Left: Search & Filter -->
    <div class="flex flex-col sm:flex-row gap-3 flex-1">
      <div class="flex gap-2 w-full sm:w-auto">
        <div class="flex-1 sm:w-64">
          <AppInput 
            :modelValue="search"
            @update:modelValue="emit('update:search', $event)"
            placeholder="Search..."
            :icon="MagnifyingGlassIcon"
          />
        </div>
        <!-- Toggle button for mobile -->
        <AppButton variant="outline" class="sm:hidden px-3" @click="showMobileFilters = !showMobileFilters" title="Toggle Filters">
          <FunnelIcon class="w-5 h-5" :class="{ 'text-primary-600': showMobileFilters }" />
        </AppButton>
      </div>
      
      <div class="flex-col sm:flex-row gap-3 flex-1" :class="showMobileFilters ? 'flex' : 'hidden sm:flex'">
        <div class="w-full sm:w-48">
          <AppSelect 
            :modelValue="status"
            @update:modelValue="emit('update:status', $event)"
            :options="options"
          />
        </div>

        <!-- Custom Filters Slot -->
        <div class="flex-1 flex flex-col sm:flex-row w-full">
          <slot name="filters"></slot>
        </div>
        
        <div class="flex gap-2 mt-1 sm:mt-0">
          <AppButton 
            v-if="search || status"
            variant="outline" 
            @click="emit('clear')"
            class="px-3 flex-1 sm:flex-none justify-center"
            title="Clear Filters"
          >
            <XMarkIcon class="w-5 h-5" />
          </AppButton>
          <AppButton 
            variant="outline" 
            @click="emit('refresh')"
            :loading="loading"
            class="px-3 flex-1 sm:flex-none justify-center"
            title="Refresh Data"
          >
            <ArrowPathIcon class="w-5 h-5" />
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex flex-col sm:flex-row gap-3 lg:items-center">
      <AppButton 
        v-if="showExport"
        variant="outline" 
        @click="emit('export')"
        class="w-full sm:w-auto justify-center"
      >
        <DocumentArrowDownIcon class="w-5 h-5 mr-2 -ml-1" />
        Export
      </AppButton>
      
      <AppButton 
        v-if="showAdd"
        variant="primary" 
        @click="emit('add')"
        class="w-full sm:w-auto justify-center"
      >
        <PlusIcon class="w-5 h-5 mr-2 -ml-1" />
        Add New
      </AppButton>
    </div>
  </div>
</template>

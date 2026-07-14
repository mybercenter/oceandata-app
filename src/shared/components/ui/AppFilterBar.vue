<script setup lang="ts">
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  searchQuery: string
  statusFilter: string
  statusOptions?: { label: string; value: string }[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:statusFilter', value: string | number | boolean): void
  (e: 'refresh'): void
  (e: 'clear'): void
}>()

const defaultStatusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const options = props.statusOptions || defaultStatusOptions
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <!-- Search -->
    <div class="flex-1">
      <AppInput 
        :modelValue="searchQuery"
        @update:modelValue="emit('update:searchQuery', $event)"
        placeholder="Search..."
        :icon="MagnifyingGlassIcon"
      />
    </div>

    <!-- Filters & Actions -->
    <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
      <div class="w-full sm:w-48">
        <AppSelect 
          :modelValue="statusFilter"
          @update:modelValue="emit('update:statusFilter', $event)"
          :options="options"
        />
      </div>

      <div class="flex gap-2">
        <AppButton 
          variant="outline" 
          @click="emit('clear')"
          v-if="searchQuery || statusFilter"
          class="flex-1 sm:flex-none justify-center px-3"
          title="Clear Filters"
        >
          <XMarkIcon class="w-5 h-5" />
        </AppButton>
        <AppButton 
          variant="outline" 
          @click="emit('refresh')"
          :loading="loading"
          class="flex-1 sm:flex-none justify-center px-3"
          title="Refresh Data"
        >
          <ArrowPathIcon class="w-5 h-5" />
        </AppButton>
      </div>
    </div>
  </div>
</template>

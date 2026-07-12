<script setup lang="ts">
import { computed } from 'vue'

export interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number | null
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  placeholder: 'Select an option'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substring(2, 9)}`)
</script>

<template>
  <div class="flex flex-col w-full">
    <label v-if="label" :for="selectId" class="mb-1.5 block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        :disabled="disabled"
        :class="[
          'w-full appearance-none rounded-input border bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500',
          disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
        ]"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-red-500">{{ error }}</p>
    <p v-else-if="helperText" class="mt-1.5 text-xs text-gray-500">{{ helperText }}</p>
  </div>
</template>

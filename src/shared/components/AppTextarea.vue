<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  rows?: number
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  disabled: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaId = computed(() => props.id || `textarea-${Math.random().toString(36).substring(2, 9)}`)
</script>

<template>
  <div class="flex flex-col w-full">
    <label v-if="label" :for="textareaId" class="mb-1.5 block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <textarea
        :id="textareaId"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        :class="[
          'w-full rounded-input border bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 resize-y',
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500',
          disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
        ]"
      ></textarea>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-red-500">{{ error }}</p>
    <p v-else-if="helperText" class="mt-1.5 text-xs text-gray-500">{{ helperText }}</p>
  </div>
</template>

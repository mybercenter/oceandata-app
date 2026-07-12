<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'text' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  type: 'button'
})

const classes = computed(() => {
  return [
    'inline-flex items-center justify-center font-medium rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    {
      // Variants
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm': props.variant === 'primary',
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 shadow-sm': props.variant === 'secondary',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm': props.variant === 'danger',
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500': props.variant === 'ghost',
      'bg-transparent text-primary-600 hover:text-primary-700 focus:ring-primary-500 p-0': props.variant === 'text',
      'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 focus:ring-primary-500 shadow-sm': props.variant === 'outline',


      // Sizes
      'px-3 py-1.5 text-sm': props.size === 'sm' && props.variant !== 'text',
      'px-4 py-2 text-sm': props.size === 'md' && props.variant !== 'text',
      'px-5 py-2.5 text-base': props.size === 'lg' && props.variant !== 'text',

      // Block
      'w-full flex': props.block,
    }
  ]
})
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'gray' | 'purple' | 'pink'
  text: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const variantClasses = computed(() => {
  const map: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-primary-100 text-primary-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800'
  }
  return map[props.variant] || map.primary
})
</script>

<template>
  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses]">
    {{ text }}
  </span>
</template>

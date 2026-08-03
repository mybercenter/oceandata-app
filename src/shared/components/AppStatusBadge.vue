<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from './AppBadge.vue'

interface Props {
  status: 'Active' | 'Inactive' | 'Potential' | 'Prospect' | 'Hot Prospect' | 'Inquiry' | 'Purchased' | string
  label?: string
}

const props = defineProps<Props>()

const variant = computed(() => {
  const map: Record<string, string> = {
    'Active': 'success',
    'active': 'success',
    'Inactive': 'gray',
    'inactive': 'gray',
    'Potential': 'warning',
    'potential': 'warning',
    'Prospect': 'info',
    'prospect': 'info',
    'Hot Prospect': 'pink',
    'hot prospect': 'pink',
    'Inquiry': 'gray',
    'inquiry': 'gray',
    'Purchased': 'primary',
    'purchased': 'primary'
  }
  return (map[props.status] || 'primary') as any
})

const displayText = computed(() => {
  return props.label || props.status
})
</script>

<template>
  <AppBadge :variant="variant" :text="displayText" />
</template>

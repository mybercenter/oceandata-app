<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from './AppBadge.vue'

interface Props {
  status: 'Active' | 'Inactive' | 'Potential' | 'Prospect' | 'Hot Prospect' | 'Inquiry' | 'Purchased' | string
}

const props = defineProps<Props>()

const variant = computed(() => {
  const map: Record<string, string> = {
    'Active': 'success',
    'Inactive': 'gray',
    'Potential': 'warning',
    'Prospect': 'info',
    'Hot Prospect': 'pink',
    'Inquiry': 'gray',
    'Purchased': 'primary'
  }
  return (map[props.status] || 'primary') as any
})
</script>

<template>
  <AppBadge :variant="variant" :text="status" />
</template>

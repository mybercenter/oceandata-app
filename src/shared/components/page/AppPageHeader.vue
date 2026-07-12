<script setup lang="ts">
import AppBreadcrumb from '../layout/AppBreadcrumb.vue'

interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ title }}</h2>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
      
      <div class="mt-3">
        <AppBreadcrumb />
      </div>
    </div>
    
    <!-- Action buttons slot (e.g., Create New, Export) -->
    <div class="flex items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

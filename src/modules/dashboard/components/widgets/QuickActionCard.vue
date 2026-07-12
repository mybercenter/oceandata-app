<script setup lang="ts">
import AppCard from '@/shared/components/AppCard.vue'

defineProps<{
  title: string
  actions: { title: string, icon: string, route: string, color: string }[]
}>()
</script>

<template>
  <AppCard class="p-6">
    <h4 class="text-xl font-bold text-gray-900 mb-6">{{ title }}</h4>
    <div class="grid grid-cols-2 gap-4">
      <RouterLink 
        v-for="action in actions" 
        :key="action.title"
        :to="action.route"
        class="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-primary-100 hover:shadow-sm transition-all duration-300 group"
      >
        <div :class="['w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors', action.color]">
          <!-- We can use a generic icon slot or map icons if needed. For now, use a generic bolt icon -->
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-sm font-medium text-gray-700 group-hover:text-primary-600">{{ action.title }}</span>
      </RouterLink>
    </div>
  </AppCard>
</template>

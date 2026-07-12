<script setup lang="ts">
import AppCard from '@/shared/components/AppCard.vue'
import type { TopPromotor } from '../../types/dashboard.types'

defineProps<{
  title: string
  promotors: TopPromotor[]
}>()
</script>

<template>
  <AppCard class="p-6">
    <h4 class="text-xl font-bold text-gray-900 mb-6">{{ title }}</h4>
    <div class="flex flex-col gap-6">
      <div v-for="(promotor, index) in promotors" :key="promotor.id" class="flex items-center gap-4">
        <!-- Rank Number -->
        <div class="w-6 text-center">
          <span :class="['text-sm font-bold', index < 3 ? 'text-primary-600' : 'text-gray-400']">
            #{{ index + 1 }}
          </span>
        </div>
        
        <!-- Avatar -->
        <img :src="promotor.avatar" :alt="promotor.name" class="w-10 h-10 rounded-full bg-gray-100" />
        
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h5 class="text-sm font-semibold text-gray-900 truncate">{{ promotor.name }}</h5>
          <p class="text-xs text-gray-500 truncate">{{ promotor.store }} • {{ promotor.area }}</p>
          
          <!-- Progress Bar -->
          <div class="mt-2 w-full bg-gray-100 rounded-full h-1.5">
            <div class="bg-primary-500 h-1.5 rounded-full" :style="{ width: promotor.progress + '%' }"></div>
          </div>
        </div>
        
        <!-- Stats -->
        <div class="text-right">
          <span class="text-sm font-bold text-gray-900">{{ promotor.conversionRate }}%</span>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ClipboardDocumentCheckIcon, 
  CalendarDaysIcon,
  CalendarIcon,
  ChartBarIcon,
  StarIcon,
  FireIcon,
  ShoppingBagIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  potential: number
  prospect: number
  hotProspect: number
  purchased: number
}>()
</script>

<template>
  <div class="flex overflow-x-auto sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-6 pb-2 sm:pb-0 snap-x hide-scrollbar">
    <!-- Card 1 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-primary-300 transition-colors">
      <div class="flex items-center gap-2 text-gray-500 mb-2">
        <ClipboardDocumentCheckIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Total</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ total }}</p>
    </div>
    
    <!-- Card 2 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col bg-blue-50/30">
      <div class="flex items-center gap-2 text-blue-500 mb-2">
        <ClockIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Today</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ today }}</p>
    </div>
    
    <!-- Card 3 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col bg-indigo-50/30">
      <div class="flex items-center gap-2 text-indigo-500 mb-2">
        <CalendarIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">This Week</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ thisWeek }}</p>
    </div>

    <!-- Card 4 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col bg-purple-50/30">
      <div class="flex items-center gap-2 text-purple-500 mb-2">
        <CalendarDaysIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">This Month</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ thisMonth }}</p>
    </div>

    <!-- Card 5 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-amber-300 transition-colors">
      <div class="flex items-center gap-2 text-amber-500 mb-2">
        <ChartBarIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Potential</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ potential }}</p>
    </div>

    <!-- Card 6 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-orange-300 transition-colors">
      <div class="flex items-center gap-2 text-orange-500 mb-2">
        <StarIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Prospect</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ prospect }}</p>
    </div>

    <!-- Card 7 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-red-300 transition-colors">
      <div class="flex items-center gap-2 text-red-500 mb-2">
        <FireIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Hot</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ hotProspect }}</p>
    </div>

    <!-- Card 8 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-emerald-300 transition-colors">
      <div class="flex items-center gap-2 text-emerald-500 mb-2">
        <ShoppingBagIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Purchased</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ purchased }}</p>
    </div>
  </div>
</template>

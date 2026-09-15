<script setup lang="ts">
import { 
  UsersIcon, 
  ChatBubbleLeftEllipsisIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  StarIcon,
  FireIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  metrics: {
    total: number
    inquiry: number
    purchased: number
    potential: number
    prospect: number
    hotProspect: number
    today: number
    thisMonth: number
    followUp: number
  }
}>()
</script>

<template>
  <div class="flex overflow-x-auto sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-6 pb-2 sm:pb-0 snap-x hide-scrollbar">
    <!-- Card 1 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-primary-300 transition-colors">
      <div class="flex items-center gap-2 text-gray-500 mb-2">
        <UsersIcon class="w-4 h-4" />
        <span class="text-xs font-semibold uppercase tracking-wider">Total</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ metrics.total }}</p>
    </div>
    
    <!-- Card 2 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-blue-300 transition-colors">
      <div class="flex items-center gap-2 text-blue-500 mb-2">
        <ChatBubbleLeftEllipsisIcon class="w-4 h-4" />
        <span class="text-xs font-semibold uppercase tracking-wider">Tanya-tanya</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ metrics.inquiry }}</p>
    </div>
    
    <!-- Card 3 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-emerald-300 transition-colors">
      <div class="flex items-center gap-2 text-emerald-500 mb-2">
        <ShoppingBagIcon class="w-4 h-4" />
        <span class="text-xs font-semibold uppercase tracking-wider">Purchased</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ metrics.purchased }}</p>
    </div>

    <!-- Card 4 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-amber-300 transition-colors">
      <div class="flex items-center gap-2 text-amber-500 mb-2">
        <ChartBarIcon class="w-4 h-4" />
        <span class="text-xs font-semibold uppercase tracking-wider">Potential</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ metrics.potential }}</p>
    </div>

    <!-- Card 5 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-orange-300 transition-colors">
      <div class="flex items-center gap-2 text-orange-500 mb-2">
        <StarIcon class="w-4 h-4" />
        <span class="text-xs font-semibold uppercase tracking-wider">Prospect</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ metrics.prospect }}</p>
    </div>

    <!-- Card 6 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:border-red-300 transition-colors">
      <div class="flex items-center gap-2 text-red-500 mb-2">
        <FireIcon class="w-4 h-4" />
        <span class="text-xs font-semibold uppercase tracking-wider">Hot</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">{{ metrics.hotProspect }}</p>
    </div>

    <!-- Card 7 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col bg-gray-50/50 hover:border-gray-300 transition-colors">
      <div class="flex items-center gap-2 text-gray-500 mb-2">
        <CalendarDaysIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Today / Month</span>
      </div>
      <div class="flex items-baseline gap-1">
        <p class="text-2xl font-bold text-gray-900">{{ metrics.today }}</p>
        <p class="text-sm font-medium text-gray-500">/ {{ metrics.thisMonth }}</p>
      </div>
    </div>

    <!-- Card 8 -->
    <div class="min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col bg-indigo-50/30 hover:border-indigo-300 transition-colors">
      <div class="flex items-center gap-2 text-indigo-600 mb-2">
        <ChatBubbleLeftEllipsisIcon class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Follow Up</span>
      </div>
      <p class="text-2xl font-bold text-indigo-900">{{ metrics.followUp }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: any[]
}>()

// Simplified mockup of a calendar grid
const days = computed(() => {
  const list = []
  for (let i = 1; i <= 30; i++) {
    // Generate random dots based on data length just for visual mockup
    const hasActivity = Math.random() > 0.6
    const count = hasActivity ? Math.floor(Math.random() * 5) + 1 : 0
    list.push({ day: i, count })
  }
  return list
})
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
      <h2 class="text-lg font-bold text-gray-900">Follow Up Calendar</h2>
      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded text-sm hover:bg-gray-100">Prev</button>
        <span class="font-bold py-1 px-2">July 2026</span>
        <button class="px-3 py-1 border rounded text-sm hover:bg-gray-100">Next</button>
      </div>
    </div>
    <div class="grid grid-cols-7 border-b border-gray-200">
      <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-r last:border-r-0">
        {{ day }}
      </div>
    </div>
    <div class="grid grid-cols-7 bg-gray-50 gap-[1px]">
      <div v-for="(day, idx) in days" :key="idx" class="bg-white h-24 p-2 relative hover:bg-primary-50 cursor-pointer transition-colors">
        <span class="text-sm font-medium" :class="day.day === 12 ? 'text-primary-600 bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-500'">{{ day.day }}</span>
        
        <div v-if="day.count > 0" class="absolute bottom-2 left-2 right-2 flex flex-col gap-1">
          <div class="text-[10px] bg-blue-100 text-blue-700 rounded px-1 py-0.5 truncate">{{ day.count }} Follow Ups</div>
        </div>
      </div>
    </div>
  </div>
</template>

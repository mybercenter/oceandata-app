<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: any[]
}>()

const columns = computed(() => {
  return [
    { title: 'Potential', items: props.data.filter(d => d.conversion === 'Potential').slice(0, 5), color: 'border-amber-500', bg: 'bg-amber-50' },
    { title: 'Prospect', items: props.data.filter(d => d.conversion === 'Prospect').slice(0, 5), color: 'border-orange-500', bg: 'bg-orange-50' },
    { title: 'Hot Prospect', items: props.data.filter(d => d.conversion === 'Hot Prospect').slice(0, 5), color: 'border-red-500', bg: 'bg-red-50' },
    { title: 'Purchased', items: props.data.filter(d => d.conversion === 'Purchased' || d.customerStatus === 'Purchased').slice(0, 5), color: 'border-emerald-500', bg: 'bg-emerald-50' }
  ]
})
</script>

<template>
  <div class="overflow-x-auto pb-4">
    <div class="flex gap-4 min-w-[1000px] h-[calc(100vh-300px)] min-h-[500px]">
      
      <div v-for="col in columns" :key="col.title" class="flex-1 rounded-xl bg-gray-100 flex flex-col border border-gray-200">
        <div class="p-3 border-b-2" :class="col.color">
          <h3 class="font-bold text-gray-800 flex justify-between">
            {{ col.title }}
            <span class="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{{ col.items.length }}</span>
          </h3>
        </div>
        
        <div class="flex-1 p-3 overflow-y-auto space-y-3">
          <div v-for="item in col.items" :key="item.id" class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-move hover:border-primary-300 hover:shadow-md transition-all">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-sm text-gray-900">{{ item.customer?.fullName }}</h4>
              <span class="text-[10px] text-gray-400">{{ new Date(item.followUpDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) }}</span>
            </div>
            <p class="text-xs text-gray-500 mb-3">{{ item.customer?.phone }}</p>
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{{ item.dedicate }}</span>
              <span class="text-[10px] text-gray-500 flex items-center">
                <div class="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center mr-1 text-[8px] font-bold text-gray-700">
                  {{ item.employee?.fullName?.charAt(0) || '?' }}
                </div>
                {{ item.employee?.fullName.split(' ')[0] || 'Unknown' }}
              </span>
            </div>
          </div>
          
          <div v-if="col.items.length === 0" class="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
            Drag cards here
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

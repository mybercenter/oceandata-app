<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  createdAt: string
  conversion: string
  status: string
  lastFollowUp?: string
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

// Generate simple mock timeline items based on current status
const items = computed(() => {
  const list = []
  list.push({ title: 'Customer Created', date: props.createdAt, icon: 'user' })
  
  if (props.lastFollowUp) {
    list.push({ title: 'Follow Up Activity', date: props.lastFollowUp, icon: 'phone' })
  }
  
  if (props.conversion !== 'Potential') {
    list.push({ title: 'Conversion Updated: ' + props.conversion, date: props.lastFollowUp || props.createdAt, icon: 'chart' })
  }
  
  if (props.status === 'Purchased') {
    list.push({ title: 'Product Purchased', date: props.lastFollowUp || props.createdAt, icon: 'cart' })
  }
  
  return list
})
</script>

<template>
  <div class="flow-root mt-4">
    <ul role="list" class="-mb-8">
      <li v-for="(item, itemIdx) in items" :key="itemIdx">
        <div class="relative pb-8">
          <!-- Line connecting items -->
          <span 
            v-if="itemIdx !== items.length - 1" 
            class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" 
            aria-hidden="true"
          />
          <div class="relative flex space-x-3">
            <div>
              <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-primary-100 text-primary-600">
                <svg v-if="item.icon === 'user'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <svg v-else-if="item.icon === 'phone'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <svg v-else-if="item.icon === 'chart'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <svg v-else-if="item.icon === 'cart'" class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p class="text-sm text-gray-900 font-medium">{{ item.title }}</p>
              </div>
              <div class="whitespace-nowrap text-right text-sm text-gray-500">
                <time :datetime="item.date">{{ formatDate(item.date) }}</time>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

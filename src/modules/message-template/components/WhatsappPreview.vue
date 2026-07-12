<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  messages: string[]
}>()

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div class="relative w-full h-[600px] sm:h-full min-h-[500px] bg-[#e5ddd5] rounded-xl overflow-hidden shadow-inner border border-gray-300 flex flex-col font-sans">
    
    <!-- WA Header -->
    <div class="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shadow-md z-10 shrink-0">
      <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
        <svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
      </div>
      <div>
        <h3 class="font-semibold text-[16px] leading-tight">Customer Contact</h3>
        <p class="text-xs text-[#dcf8c6] opacity-90">online</p>
      </div>
    </div>
    
    <!-- Background pattern (Simplified for tailwind) -->
    <div class="absolute inset-0 opacity-[0.06] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E'); background-size: 20px 20px;"></div>

    <!-- Messages Container -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 z-10 flex flex-col">
      <div v-for="(msg, index) in messages" :key="index" class="w-full flex justify-end">
        <div v-if="msg" class="relative max-w-[85%] bg-[#dcf8c6] text-[#303030] px-3 py-2 rounded-lg rounded-tr-none shadow-sm text-[14.2px] leading-relaxed break-words whitespace-pre-wrap">
          {{ msg }}
          <div class="flex justify-end items-center gap-1 mt-1 -mb-1 float-right clear-both ml-4">
            <span class="text-[10px] text-gray-500">{{ currentTime }}</span>
            <svg viewBox="0 0 16 15" width="16" height="15" class="text-[#4fc3f7]"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
          </div>
          <!-- Right Tail Triangle -->
          <svg viewBox="0 0 8 13" width="8" height="13" class="absolute top-0 -right-2 text-[#dcf8c6]">
            <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
            <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

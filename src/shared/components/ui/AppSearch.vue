<script setup lang="ts">
import { ref } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const isFocused = ref(false)
</script>

<template>
  <div class="relative w-full max-w-md hidden md:block">
    <div class="relative flex items-center">
      <MagnifyingGlassIcon class="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        v-model="searchQuery"
        @focus="isFocused = true"
        @blur="isFocused = false"
        type="text"
        placeholder="Type to search..."
        class="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
      />
      <!-- Keyboard shortcut hint -->
      <div class="absolute right-3 hidden lg:flex items-center gap-1 pointer-events-none">
        <kbd class="px-1.5 py-0.5 text-[10px] font-sans font-medium text-gray-500 bg-white border border-gray-200 rounded shadow-sm">Ctrl</kbd>
        <kbd class="px-1.5 py-0.5 text-[10px] font-sans font-medium text-gray-500 bg-white border border-gray-200 rounded shadow-sm">K</kbd>
      </div>
    </div>

    <!-- Dropdown for suggestions (UI Only) -->
    <div 
      v-if="isFocused && searchQuery"
      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
    >
      <div class="p-2">
        <p class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Navigation</p>
        <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-md transition-colors">Go to Customers</a>
        <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-md transition-colors">Create New Follow-up</a>
      </div>
    </div>
  </div>
</template>

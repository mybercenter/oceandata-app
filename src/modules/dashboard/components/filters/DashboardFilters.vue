<script setup lang="ts">
import { ref } from 'vue'

const dateRange = ref('this_month')
const selectedArea = ref('all')
const selectedStore = ref('all')
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <span class="font-medium text-gray-700">Filters</span>
    </div>

    <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
      <select v-model="selectedArea" class="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2">
        <option value="all">All Areas</option>
        <option value="jakarta">Jakarta</option>
        <option value="surabaya">Surabaya</option>
        <option value="bandung">Bandung</option>
      </select>

      <select v-model="selectedStore" class="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2">
        <option value="all">All Stores</option>
        <option value="store1">Store 1</option>
        <option value="store2">Store 2</option>
      </select>

      <div class="h-6 w-px bg-gray-200 hidden sm:block"></div>

      <select v-model="dateRange" class="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2">
        <option value="today">Today</option>
        <option value="this_week">This Week</option>
        <option value="this_month">This Month</option>
        <option value="this_year">This Year</option>
      </select>
    </div>
  </div>
</template>

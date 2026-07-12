<script setup lang="ts">
import { BellIcon } from '@heroicons/vue/24/outline'
import AppDropdown from './AppDropdown.vue'

const notifications = [
  { id: 1, title: 'New Customer Registered', message: 'John Doe has registered a new account.', time: '5m ago', type: 'customer', unread: true },
  { id: 2, title: 'Follow-up Reminder', message: 'Call Sarah regarding the new proposal.', time: '1h ago', type: 'follow-up', unread: true },
  { id: 3, title: 'System Update', message: 'System maintenance scheduled for tonight.', time: '2h ago', type: 'system', unread: false },
]
</script>

<template>
  <AppDropdown width="w-80">
    <template #trigger="{ isOpen }">
      <button class="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none" :class="{ 'bg-gray-100 text-gray-700': isOpen }">
        <BellIcon class="w-6 h-6" />
        <!-- Unread Badge -->
        <span class="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
      </button>
    </template>

    <template #default="{ close }">
      <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
        <button class="text-xs font-medium text-primary-600 hover:text-primary-700">Mark all as read</button>
      </div>

      <div class="max-h-80 overflow-y-auto">
        <a 
          v-for="notification in notifications" 
          :key="notification.id"
          href="#"
          @click.prevent="close"
          class="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          :class="{ 'bg-primary-50/30': notification.unread }"
        >
          <div class="flex items-start justify-between">
            <p class="text-sm font-medium text-gray-900 mb-0.5">{{ notification.title }}</p>
            <span class="text-[10px] font-medium text-gray-500 whitespace-nowrap ml-2">{{ notification.time }}</span>
          </div>
          <p class="text-xs text-gray-500 line-clamp-2">{{ notification.message }}</p>
        </a>
      </div>

      <div class="p-2 border-t border-gray-100 text-center">
        <a href="#" @click.prevent="close" class="block w-full px-4 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors rounded">
          View all notifications
        </a>
      </div>
    </template>
  </AppDropdown>
</template>

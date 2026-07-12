<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  UserCircleIcon,
  Cog8ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import AppDropdown from './AppDropdown.vue'

const router = useRouter()

// Mock user for now
const user = {
  name: 'Admin User',
  email: 'admin@oceandata.com',
  role: 'Administrator',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=465FFF&color=fff'
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth/login')
}
</script>

<template>
  <AppDropdown width="w-60">
    <template #trigger="{ isOpen }">
      <button class="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none" :class="{ 'bg-gray-100': isOpen }">
        <img :src="user.avatar" :alt="user.name" class="w-9 h-9 rounded-full object-cover border border-gray-200" />
        <div class="hidden sm:block text-left mr-2">
          <p class="text-sm font-semibold text-gray-900 leading-tight">{{ user.name }}</p>
          <p class="text-xs text-gray-500">{{ user.role }}</p>
        </div>
      </button>
    </template>

    <template #default="{ close }">
      <div class="px-4 py-3 border-b border-gray-100">
        <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
        <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
      </div>

      <div class="py-1">
        <a href="#" @click.prevent="close" class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
          <UserCircleIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600" />
          My Profile
        </a>
        <a href="#" @click.prevent="close" class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
          <Cog8ToothIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600" />
          Account Settings
        </a>
      </div>

      <div class="py-1 border-t border-gray-100">
        <a href="#" @click.prevent="handleLogout" class="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
          <ArrowRightOnRectangleIcon class="mr-3 h-5 w-5 text-red-500" />
          Sign out
        </a>
      </div>
    </template>
  </AppDropdown>
</template>

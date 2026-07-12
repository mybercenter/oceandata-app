<script setup lang="ts">
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useSidebar } from '@/shared/composables/useSidebar'
import AppSearch from '../ui/AppSearch.vue'
import AppNotificationDropdown from '../ui/AppNotificationDropdown.vue'
import AppUserDropdown from '../ui/AppUserDropdown.vue'

const { toggleExpanded, toggleMobileDrawer } = useSidebar()
</script>

<template>
  <header class="sticky top-0 z-40 flex w-full bg-white shadow-sm border-b border-gray-100">
    <div class="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-8">
      
      <!-- Left Section: Toggle & Search (Mobile) -->
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <!-- Hamburger Menu -->
        <button
          @click="toggleMobileDrawer"
          class="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden focus:outline-none"
        >
          <Bars3Icon class="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <!-- Left Section: Toggle (Desktop) -->
      <div class="hidden lg:flex items-center gap-4">
        <button
          @click="toggleExpanded"
          class="rounded-sm border border-stroke bg-white p-1.5 shadow-sm text-gray-500 hover:text-primary-600 transition-colors focus:outline-none"
        >
          <Bars3Icon class="h-5 w-5" />
        </button>
      </div>

      <!-- Center/Left Search (Desktop) -->
      <div class="hidden sm:block ml-4 flex-1">
        <AppSearch />
      </div>

      <!-- Right Section: Actions & Profile -->
      <div class="flex items-center gap-3 sm:gap-5 ml-auto">
        
        <!-- Mobile Search Toggle -->
        <button class="sm:hidden p-2 text-gray-500 hover:text-gray-700">
          <MagnifyingGlassIcon class="w-5 h-5" />
        </button>

        <!-- Dark Mode Toggle Placeholder (UI Only) -->
        <button class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <AppNotificationDropdown />
        
        <!-- Separator -->
        <div class="hidden sm:block h-6 w-px bg-gray-200"></div>

        <AppUserDropdown />
      </div>
    </div>
  </header>
</template>

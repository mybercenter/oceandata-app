<script setup lang="ts">
import { computed } from 'vue'
import { useSidebar } from '@/shared/composables/useSidebar'
import { navigationConfig, type NavigationItem } from '@/app/navigation/navigation'
import AppSidebarItem from './AppSidebarItem.vue'
import { useAuth } from '@/shared/composables/useAuth'

const { isExpanded, isMobileDrawerOpen, setMobileDrawer } = useSidebar()
const { employee, user, hasAnyPermission } = useAuth()

const userRole = computed(() => employee.value?.role?.name || user.value?.role?.name || '')
const isSuperAdmin = computed(() => userRole.value === 'Administrator' || userRole.value === 'Super Admin')

const filteredNavigation = computed(() => {
  return navigationConfig.map(group => {
    // Filter items in the group based on permissions
    const filteredItems = group.items.filter(item => {
      if (item.permissions && item.permissions.length > 0) {
        if (!isSuperAdmin.value && !hasAnyPermission(item.permissions)) return false
      }
      return true
    }).map(item => {
      // Also filter children if they exist
      if (item.children) {
        const filteredChildren = item.children.filter(child => {
          if (child.permissions && child.permissions.length > 0) {
            if (!isSuperAdmin.value && !hasAnyPermission(child.permissions)) return false
          }
          return true
        })
        
        if (filteredChildren.length === 0 && !isSuperAdmin.value) return null
        
        return { ...item, children: filteredChildren }
      }
      return item
    }).filter(Boolean) as NavigationItem[]

    if (filteredItems.length === 0) return null

    return {
      ...group,
      items: filteredItems
    }
  }).filter(Boolean)
})
</script>

<template>
  <!-- Mobile Backdrop -->
  <div 
    v-show="isMobileDrawerOpen" 
    class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
    @click="setMobileDrawer(false)"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'absolute left-0 top-0 z-50 flex h-screen flex-col overflow-y-hidden bg-white shadow-sm border-r border-gray-100 duration-300 ease-in-out lg:static lg:translate-x-0',
      isExpanded ? 'w-64' : 'w-20',
      isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between gap-2 px-6 py-4 lg:py-5 min-h-[64px]">
      <RouterLink to="/" class="flex items-center gap-2 overflow-hidden">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap transition-opacity duration-300" :class="!isExpanded ? 'opacity-0 hidden' : 'opacity-100'">
          OceanData
        </span>
      </RouterLink>

      <!-- Mobile Close Button -->
      <button class="block lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none" @click="setMobileDrawer(false)">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Sidebar Content -->
    <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-in-out">
      <nav class="mt-4 px-3 lg:mt-6 pb-20">
        <template v-for="(group, groupIndex) in filteredNavigation" :key="groupIndex">
          <div v-if="group" class="mb-6">
            <h3 
              class="mb-2 ml-4 text-xs font-semibold text-gray-400 uppercase tracking-wider transition-opacity duration-300"
              :class="!isExpanded ? 'opacity-0 hidden' : 'opacity-100'"
            >
              {{ group.name }}
            </h3>

            <ul class="mb-4 flex flex-col gap-1.5">
              <AppSidebarItem
                v-for="(item, itemIndex) in group.items"
                :key="itemIndex"
                :item="item"
              />
            </ul>
          </div>
        </template>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>

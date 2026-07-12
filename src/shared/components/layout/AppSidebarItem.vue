<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import type { NavigationItem } from '@/app/navigation/navigation'
import { useSidebar } from '@/shared/composables/useSidebar'

const props = defineProps<{
  item: NavigationItem
  level?: number
}>()

const route = useRoute()
const { isExpanded } = useSidebar()

const level = computed(() => props.level || 0)
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)

const isActive = computed(() => {
  if (props.item.route && route.path === props.item.route) return true
  if (hasChildren.value) {
    return props.item.children!.some(child => child.route && route.path.startsWith(child.route))
  }
  return false
})

const isOpen = ref(isActive.value)

const toggleOpen = () => {
  if (hasChildren.value) {
    isOpen.value = !isOpen.value
    // If opening a submenu while sidebar is collapsed, force expand sidebar
    if (isOpen.value && !isExpanded.value) {
      useSidebar().setExpanded(true)
    }
  }
}
</script>

<template>
  <li>
    <template v-if="hasChildren">
      <div 
        @click="toggleOpen"
        class="group relative flex items-center gap-2.5 rounded-lg px-4 py-2 font-medium text-sm text-gray-700 duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
        :class="{ 'bg-primary-50 text-primary-700': isActive }"
      >
        <component 
          v-if="item.icon" 
          :is="item.icon" 
          class="h-5 w-5 flex-shrink-0" 
          :class="isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'"
        />
        <span class="flex-1 whitespace-nowrap transition-opacity duration-300" :class="!isExpanded ? 'opacity-0 hidden' : 'opacity-100'">
          {{ item.title }}
        </span>
        <ChevronDownIcon 
          v-if="isExpanded"
          class="h-4 w-4 transition-transform duration-200 flex-shrink-0" 
          :class="{ '-rotate-180': isOpen }" 
        />
      </div>

      <!-- Nested Menu -->
      <transition
        enter-active-class="transition-[max-height] duration-300 ease-in-out overflow-hidden"
        enter-from-class="max-h-0"
        enter-to-class="max-h-[500px]"
        leave-active-class="transition-[max-height] duration-300 ease-in-out overflow-hidden"
        leave-from-class="max-h-[500px]"
        leave-to-class="max-h-0"
      >
        <ul v-show="isOpen && isExpanded" class="mt-1 flex flex-col gap-1 pl-9 pr-2">
          <AppSidebarItem 
            v-for="(child, index) in item.children" 
            :key="index"
            :item="child"
            :level="level + 1"
          />
        </ul>
      </transition>
    </template>

    <template v-else>
      <RouterLink
        :to="item.route || '#'"
        class="group relative flex items-center gap-2.5 rounded-lg px-4 py-2 font-medium text-sm text-gray-700 duration-300 ease-in-out hover:bg-gray-100 hover:text-gray-900"
        :class="{ 'bg-primary-50 text-primary-700': isActive, 'justify-center pl-0 pr-0': !isExpanded }"
      >
        <component 
          v-if="item.icon" 
          :is="item.icon" 
          class="h-5 w-5 flex-shrink-0"
          :class="isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'"
        />
        <span class="flex-1 whitespace-nowrap transition-opacity duration-300" :class="!isExpanded ? 'opacity-0 hidden' : 'opacity-100'">
          {{ item.title }}
        </span>
      </RouterLink>
    </template>
  </li>
</template>

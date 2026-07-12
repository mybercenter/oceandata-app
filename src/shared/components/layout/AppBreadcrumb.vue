<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { useBreadcrumbs } from '@/shared/composables/useBreadcrumbs'

const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-2">
      <li v-for="(item, index) in breadcrumbs" :key="index">
        <div class="flex items-center">
          <ChevronRightIcon v-if="index > 0" class="h-4 w-4 flex-shrink-0 text-gray-400 mr-2" aria-hidden="true" />
          <RouterLink 
            v-if="item.route && index < breadcrumbs.length - 1" 
            :to="item.route" 
            class="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            {{ item.title }}
          </RouterLink>
          <span 
            v-else 
            class="text-sm font-semibold text-gray-900" 
            aria-current="page"
          >
            {{ item.title }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

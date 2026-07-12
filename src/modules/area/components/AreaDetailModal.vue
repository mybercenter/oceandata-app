<script setup lang="ts">
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { BuildingStorefrontIcon, UserGroupIcon, UsersIcon } from '@heroicons/vue/24/outline'
import type { Area } from '../types/area.types'

const props = defineProps<{
  isOpen: boolean
  area: Area | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', area: Area): void
}>()

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <AppModal 
    :isOpen="isOpen" 
    @close="emit('close')"
    title="Area Details"
    size="md"
  >
    <div v-if="area" class="space-y-8">
      
      <!-- Basic Info -->
      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ area.name }}</h3>
            <p class="text-sm text-gray-500 font-mono mt-1">{{ area.code }}</p>
          </div>
          <AppStatusBadge :status="area.status" />
        </div>
        
        <div class="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-50">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Created At</p>
            <p class="text-sm text-gray-900">{{ formatDate(area.createdAt) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Last Updated</p>
            <p class="text-sm text-gray-900">{{ formatDate(area.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div>
        <h4 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Operational Statistics</h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <BuildingStorefrontIcon class="w-5 h-5" />
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ area.stats.totalStores }}</p>
            <p class="text-xs text-gray-500 font-medium mt-1">Stores</p>
          </div>
          
          <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div class="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <UserGroupIcon class="w-5 h-5" />
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ area.stats.totalEmployees }}</p>
            <p class="text-xs text-gray-500 font-medium mt-1">Employees</p>
          </div>
          
          <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div class="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
              <UsersIcon class="w-5 h-5" />
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ area.stats.totalCustomers }}</p>
            <p class="text-xs text-gray-500 font-medium mt-1">Customers</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <AppButton 
          variant="outline" 
          @click="emit('close')"
          class="w-full sm:w-auto"
        >
          Close
        </AppButton>
        <AppButton 
          variant="primary" 
          @click="area && emit('edit', area)"
          class="w-full sm:w-auto"
        >
          Edit Area
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>


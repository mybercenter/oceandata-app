<script setup lang="ts">
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import type { Store } from '../types/store.types'

defineProps<{
  isOpen: boolean
  store: Store | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', store: Store): void
}>()

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="store?.name || 'Store Details'"
    @close="emit('close')"
  >
    <div v-if="store" class="space-y-6">
      
      <!-- Store Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Store Information</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Code</dt>
            <dd class="text-sm text-gray-900 col-span-2 font-mono">{{ store.code }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Name</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ store.name }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="text-sm text-gray-900 col-span-2">
              <AppStatusBadge :status="store.status" />
            </dd>
          </div>
        </dl>
      </div>
      
      <hr class="border-gray-100" />

      <!-- Area & Location Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Location & Area</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Area</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ store.area?.name || store.areaId }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Address</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ store.address }}</dd>
          </div>
        </dl>
      </div>
      
      <hr class="border-gray-100" />

      <!-- Statistics -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Mock Statistics</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ store.stats?.totalEmployees || 0 }}</div>
            <div class="text-xs text-gray-500 uppercase mt-1">Employees</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ store.stats?.totalCustomers || 0 }}</div>
            <div class="text-xs text-gray-500 uppercase mt-1">Customers</div>
          </div>
        </div>
      </div>

      <hr class="border-gray-100" />

      <!-- Metadata -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">System Info</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Created</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(store.createdAt) }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Updated</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(store.updatedAt) }}</dd>
          </div>
        </dl>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
        <AppButton v-if="store" variant="primary" @click="emit('edit', store)">
          <PencilSquareIcon class="w-4 h-4 mr-2" />
          Edit Store
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>


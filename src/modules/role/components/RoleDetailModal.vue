<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import type { Role } from '../types/role.types'
import { roleService } from '../services/role.service'

const props = defineProps<{
  isOpen: boolean
  role: Role | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', role: Role): void
}>()

const stats = ref({ employees: 0, users: 0, permissions: 0 })
const isLoadingStats = ref(false)

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.role) {
    isLoadingStats.value = true
    stats.value = await roleService.getRoleStats(props.role.id)
    isLoadingStats.value = false
  }
})

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="'Role: ' + (role?.name || '')"
    @close="emit('close')"
  >
    <div v-if="role" class="space-y-6">
      
      <!-- Role Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Role Information</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Name</dt>
            <dd class="text-sm text-gray-900 col-span-2 font-semibold">{{ role.name }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="text-sm text-gray-900 col-span-2">
              <AppStatusBadge :status="role.status" />
            </dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ role.description || '-' }}</dd>
          </div>
        </dl>
      </div>
      
      <hr class="border-gray-100" />

      <!-- Statistics -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Statistics</h3>
        <div v-if="isLoadingStats" class="animate-pulse space-y-3">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <dl v-else class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="px-4 py-4 bg-gray-50 rounded-lg border border-gray-100">
            <dt class="text-sm font-medium text-gray-500 truncate">Permissions</dt>
            <dd class="mt-1 text-xl font-semibold text-primary-600">{{ stats.permissions }}</dd>
          </div>
          <div class="px-4 py-4 bg-gray-50 rounded-lg border border-gray-100">
            <dt class="text-sm font-medium text-gray-500 truncate">Users</dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">{{ stats.users }}</dd>
          </div>
          <div class="px-4 py-4 bg-gray-50 rounded-lg border border-gray-100">
            <dt class="text-sm font-medium text-gray-500 truncate">Employees</dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">{{ stats.employees }}</dd>
          </div>
        </dl>
      </div>
      
      <hr class="border-gray-100" />

      <!-- Metadata -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">System Info</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Created</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(role.createdAt) }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Updated</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(role.updatedAt) }}</dd>
          </div>
        </dl>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
        <AppButton v-if="role" variant="primary" @click="emit('edit', role)">
          <PencilSquareIcon class="w-4 h-4 mr-2" />
          Edit Role
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>


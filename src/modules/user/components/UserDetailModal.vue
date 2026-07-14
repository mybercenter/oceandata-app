<script setup lang="ts">
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import type { User } from '../types/user.types'

defineProps<{
  isOpen: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', user: User): void
}>()

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const formatLastLogin = (isoString?: string) => {
  if (!isoString) return 'Never Logged In'
  
  const date = new Date(isoString)
  const today = new Date()
  
  const msDiff = today.getTime() - date.getTime()
  const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Yesterday'
  return daysDiff + ' Days Ago'
}

const getRoleColor = (roleName?: string) => {
  switch(roleName) {
    case 'Administrator': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Manager': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Supervisor': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case 'Trainer': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'Sales': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'Promotor': return 'bg-rose-100 text-rose-800 border-rose-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="'User: ' + (user?.username || '')"
    @close="emit('close')"
  >
    <div v-if="user" class="space-y-6">
      
      <!-- User Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Account Information</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Username</dt>
            <dd class="text-sm text-gray-900 col-span-2 font-semibold">{{ user.username }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="text-sm text-gray-900 col-span-2">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                user?.is_active 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              ]">
                {{ user?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Last Login</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(user.last_login) }}</dd>
          </div>
        </dl>
      </div>
      
      <hr class="border-gray-100" />

      <!-- Employee Info -->
      <div v-if="user.employee">
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Linked Employee</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Full Name</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ user.employee?.full_name || '-' }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Code</dt>
            <dd class="text-sm text-gray-900 col-span-2 font-mono">{{ user.employee.employee_code }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Role</dt>
            <dd class="text-sm col-span-2">
              <span class="px-2 py-0.5 rounded-md text-xs font-medium border" :class="getRoleColor(user.employee.role?.name)">
                {{ user.employee.role?.name || '-' }}
              </span>
            </dd>
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
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(user.created_at) }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Updated</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(user.updated_at) }}</dd>
          </div>
        </dl>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
        <AppButton v-if="user" variant="primary" @click="emit('edit', user)">
          <PencilSquareIcon class="w-4 h-4 mr-2" />
          Edit User
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>


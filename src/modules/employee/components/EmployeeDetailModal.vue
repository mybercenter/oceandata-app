<script setup lang="ts">
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import type { Employee } from '../types/employee.types'

defineProps<{
  isOpen: boolean
  employee: Employee | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', employee: Employee): void
}>()

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
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

const getDedicateColor = (dedicate?: string) => {
  if (dedicate === 'AV') return 'bg-indigo-100 text-indigo-800'
  if (dedicate === 'HA') return 'bg-teal-100 text-teal-800'
  return 'bg-fuchsia-100 text-fuchsia-800'
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="employee?.full_name || 'Employee Details'"
    @close="emit('close')"
  >
    <div v-if="employee" class="space-y-6">
      
      <!-- Employee Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Employee Information</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Code</dt>
            <dd class="text-sm text-gray-900 col-span-2 font-mono">{{ employee.employee_code || '-' }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Full Name</dt>
            <dd class="text-sm text-gray-900 col-span-2"><p class="font-medium text-gray-900">{{ employee?.full_name || '-' }}</p></dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Role</dt>
            <dd class="text-sm col-span-2">
              <span class="px-2 py-0.5 rounded-md text-xs font-medium border" :class="getRoleColor(employee.role?.name)">
                {{ employee?.full_name || '-' }}
              </span>
            </dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="text-sm text-gray-900 col-span-2">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                employee?.is_active 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              ]">
                {{ employee?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </dd>
          </div>
        </dl>
      </div>
      
      <hr class="border-gray-100" />

      <!-- Assignment Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Assignment</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Area(s)</dt>
            <dd class="text-sm text-gray-900 col-span-2 flex flex-wrap gap-1">
              <template v-if="employee.areas && employee.areas.length > 0">
                <span 
                  v-for="area in employee.areas" 
                  :key="area.id"
                  class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium border border-gray-200"
                >
                  {{ area.name }}
                </span>
              </template>
              <span v-else class="text-gray-400">-</span>
            </dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Store</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ employee.store?.name || '-' }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Dedicate</dt>
            <dd class="text-sm text-gray-900 col-span-2">
              <span v-if="employee.dedicate" class="px-2 py-0.5 rounded text-xs font-medium" :class="getDedicateColor(employee.dedicate)">
                {{ employee.dedicate }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </dd>
          </div>
        </dl>
      </div>
      
      <hr class="border-gray-100" />

      <!-- Contact Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Contact</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Phone</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ employee.phone || '-' }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Email</dt>
            <dd class="text-sm text-gray-900 col-span-2 break-all">{{ employee.email || '-' }}</dd>
          </div>
        </dl>
      </div>

      <hr class="border-gray-100" />

      <!-- Statistics -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Mock Statistics</h3>
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-blue-50 p-3 rounded-lg text-center">
            <div class="text-xl font-bold text-blue-700">{{ employee.stats?.totalCustomers || 0 }}</div>
            <div class="text-[10px] text-blue-600 uppercase mt-1 font-semibold leading-tight">Total<br/>Customers</div>
          </div>
          <div class="bg-amber-50 p-3 rounded-lg text-center">
            <div class="text-xl font-bold text-amber-700">{{ employee.stats?.followUps || 0 }}</div>
            <div class="text-[10px] text-amber-600 uppercase mt-1 font-semibold leading-tight">Follow<br/>Ups</div>
          </div>
          <div class="bg-emerald-50 p-3 rounded-lg text-center">
            <div class="text-xl font-bold text-emerald-700">{{ employee.stats?.purchasedCustomers || 0 }}</div>
            <div class="text-[10px] text-emerald-600 uppercase mt-1 font-semibold leading-tight">Purchased<br/>Customers</div>
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
            <dd class="text-sm text-gray-900 col-span-2"><p class="text-sm text-gray-900">{{ employee?.created_at ? new Date(employee.created_at).toLocaleString() : '-' }}</p></dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Updated</dt>
            <dd class="text-sm text-gray-900 col-span-2"><p class="text-sm text-gray-900">{{ employee?.updated_at ? new Date(employee.updated_at).toLocaleString() : '-' }}</p></dd>
          </div>
        </dl>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
        <AppButton v-if="employee" variant="primary" @click="emit('edit', employee)">
          <PencilSquareIcon class="w-4 h-4 mr-2" />
          Edit Employee
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useLookupStore } from '@/stores/lookup.store'
import { permissionService } from '@/services/api/permission.service'
import { storeToRefs } from 'pinia'
import type { Role } from '../types/role.types'
import type { Permission, ModuleName, ActionName } from '../types/permission.types'
import { useToast } from '@/shared/composables/useToast'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const toast = useToast()

const lookupStore = useLookupStore()
const { roles } = storeToRefs(lookupStore)

const selectedRoleId = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const assignedPermissions = ref<Set<string>>(new Set())
const originalPermissions = ref<Set<string>>(new Set())
const allPermissions = ref<any[]>([])

onMounted(async () => {
  isLoading.value = true
  try {
    await lookupStore.fetchLookups()

    // Fetch all permissions from API directly
    const permRes = await permissionService.index({ per_page: 1000 })
    let rawData = permRes.data as any
    if (rawData && typeof rawData === 'object' && !Array.isArray(rawData) && Array.isArray(rawData.data)) {
      rawData = rawData.data
    }
    allPermissions.value = Array.isArray(rawData) ? rawData : (rawData ? Object.values(rawData) : [])

    if (roles.value.length > 0) {
      selectedRoleId.value = (roles.value[0] as any).id
    }
  } catch (e: any) {
    toast.error('Initialization Failed', e.message)
  } finally {
    isLoading.value = false
  }
})

watch(selectedRoleId, async (newVal) => {
  if (!newVal) return
  isLoading.value = true
  try {
    const rolePerms = await permissionService.getRolePermissions(newVal)
    assignedPermissions.value = new Set(rolePerms)
    originalPermissions.value = new Set(rolePerms)
  } catch (e: any) {
    toast.error('Failed to load role permissions', e.message)
  } finally {
    isLoading.value = false
  }
})

const roleOptions = computed(() => {
  return roles.value.map((r: any) => ({ label: r.name, value: r.id }))
})

// Build Matrix Structure
const modules = computed(() => {
  const mods = new Set<string>()
  allPermissions.value.forEach((p: any) => mods.add(p.module))
  return Array.from(mods).sort()
})

const actions = ['View', 'Create', 'Update', 'Delete', 'Export', 'Approve']

const getPermissionForCell = (mod: string, act: string) => {
  return allPermissions.value.find((p: any) => p.module === mod && p.action === act) as any
}

const togglePermission = (permId: string) => {
  if (assignedPermissions.value.has(permId)) {
    assignedPermissions.value.delete(permId)
  } else {
    assignedPermissions.value.add(permId)
  }
}

const selectAllInModule = (mod: string) => {
  const modPerms = allPermissions.value.filter((p: any) => p.module === mod)
  const allAssigned = modPerms.every((p: any) => assignedPermissions.value.has(String(p.id)))
  
  modPerms.forEach((p: any) => {
    if (allAssigned) {
      assignedPermissions.value.delete(String(p.id))
    } else {
      assignedPermissions.value.add(String(p.id))
    }
  })
}

const handleReset = () => {
  assignedPermissions.value = new Set(originalPermissions.value)
}

const handleSave = async () => {
  if (!selectedRoleId.value) return
  isSaving.value = true
  try {
    await permissionService.updateRolePermissions(selectedRoleId.value, Array.from(assignedPermissions.value))
    originalPermissions.value = new Set(assignedPermissions.value)
    toast.success('Matrix Saved', 'Permissions have been updated for this role.')
  } catch (e: any) {
    toast.error('Save Failed', e.message)
  } finally {
    isSaving.value = false
  }
}

const hasChanges = computed(() => {
  if (assignedPermissions.value.size !== originalPermissions.value.size) return true
  for (const item of assignedPermissions.value) {
    if (!originalPermissions.value.has(item)) return true
  }
  return false
})
</script>

<template>
  <AppPage 
    title="Role Permission Matrix" 
    subtitle="Configure fine-grained access across the entire application."
  >
    <div class="space-y-6 max-w-[1200px]">
      
      <!-- Top Bar -->
      <div class="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div class="w-full sm:w-72">
          <AppSelect 
            label="Select Role"
            v-model="selectedRoleId"
            :options="roleOptions"
            :disabled="isLoading || isSaving"
          />
        </div>
        
        <div class="flex gap-6 items-center">
          <div class="text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Modules</p>
            <p class="text-xl font-bold text-gray-900">{{ modules.length }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Permissions</p>
            <p class="text-xl font-bold text-gray-900">{{ allPermissions.length }}</p>
          </div>
          <div class="text-center bg-primary-50 px-4 py-2 rounded-lg border border-primary-100">
            <p class="text-xs text-primary-600 uppercase tracking-wider font-semibold">Assigned</p>
            <p class="text-xl font-bold text-primary-700">{{ assignedPermissions.size }}</p>
          </div>
        </div>
      </div>

      <!-- Matrix Grid -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative min-h-[400px]">
        <div v-if="isLoading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[200px]">
                  Module
                </th>
                <th 
                  v-for="act in actions" 
                  :key="act"
                  scope="col" 
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  {{ act }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="mod in modules" :key="mod" class="hover:bg-gray-50 transition-colors">
                <td class="sticky left-0 z-20 bg-white group-hover:bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 flex items-center justify-between">
                  {{ mod }}
                  <button 
                    @click="selectAllInModule(mod)"
                    class="text-xs text-primary-600 hover:text-primary-800 font-normal px-2 py-1 rounded hover:bg-primary-50"
                  >
                    Toggle All
                  </button>
                </td>
                <td 
                  v-for="act in actions" 
                  :key="act"
                  class="px-6 py-4 whitespace-nowrap text-center text-sm"
                >
                  <template v-if="getPermissionForCell(mod, act)">
                    <div class="flex justify-center items-center h-full">
                      <input 
                        type="checkbox"
                        class="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer transition-colors"
                        :checked="assignedPermissions.has(String(getPermissionForCell(mod, act)!.id))"
                        @change="togglePermission(String(getPermissionForCell(mod, act)!.id))"
                      />
                    </div>
                  </template>
                  <span v-else class="text-gray-300 text-xs">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-end gap-3 shadow-sm">
        <AppButton 
          variant="outline" 
          @click="handleReset"
          :disabled="!hasChanges || isSaving"
        >
          <XMarkIcon class="w-4 h-4 mr-2" />
          Reset Changes
        </AppButton>
        <AppButton 
          variant="primary" 
          @click="handleSave"
          :disabled="!hasChanges"
          :loading="isSaving"
        >
          <CheckIcon class="w-4 h-4 mr-2" />
          Save Matrix
        </AppButton>
      </div>

    </div>
  </AppPage>
</template>

<style scoped>
/* Ensure hover effect affects sticky column */
tr:hover td.sticky {
  background-color: #f9fafb;
}
</style>

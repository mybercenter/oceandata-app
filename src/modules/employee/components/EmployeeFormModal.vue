<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppMultiSelect from '@/shared/components/AppMultiSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'

import type { Employee, DedicateType, EmployeeStatus } from '../types/employee.types'
import { mockRoles } from '../../role/mock/role.mock'
import { areaService } from '../../area/services/area.service'
import { storeService } from '../../store/services/store.service'
import type { Area } from '../../area/types/area.types'
import type { Store } from '../../store/types/store.types'

const props = defineProps<{
  isOpen: boolean
  initialData: Employee | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

// Data Sources
const areas = ref<Area[]>([])
const stores = ref<Store[]>([])
const roles = ref(mockRoles)

const roleOptions = computed(() => roles.value.map(r => ({ label: r.name, value: r.id })))
const areaOptions = computed(() => areas.value.map(a => ({ label: a.name, value: a.id })))

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const dedicateOptions = [
  { label: 'AV', value: 'AV' },
  { label: 'HA', value: 'HA' },
  { label: 'Hybrid', value: 'Hybrid' }
]

// Form State
const formData = ref({
  employeeCode: '',
  fullName: '',
  roleId: '',
  areaIds: [] as string[],
  storeId: '',
  phone: '',
  email: '',
  dedicate: '' as DedicateType | '',
  status: 'active' as EmployeeStatus
})

// Dynamic Business Logic State
const selectedRoleObj = computed(() => roles.value.find(r => r.id === formData.value.roleId))
const roleName = computed(() => selectedRoleObj.value?.name)

const showStore = computed(() => roleName.value === 'Promotor')
const isStoreRequired = computed(() => roleName.value === 'Promotor')

const showDedicate = computed(() => roleName.value === 'Promotor')
const isDedicateRequired = computed(() => roleName.value === 'Promotor')

const isAreaRequired = computed(() => roleName.value !== 'Administrator')

// Filter stores by selected areas
const filteredStoreOptions = computed(() => {
  let filtered = stores.value
  if (formData.value.areaIds.length > 0) {
    filtered = stores.value.filter(s => formData.value.areaIds.includes(s.areaId))
  }
  return filtered.map(s => ({ label: s.name, value: s.id }))
})

onMounted(async () => {
  const [a, s] = await Promise.all([
    areaService.getAreas(),
    storeService.getStores()
  ])
  areas.value = a
  stores.value = s
})

// Reset dependencies when role changes
watch(() => formData.value.roleId, (newRole, oldRole) => {
  if (oldRole && props.isOpen && !props.initialData) {
    if (!showStore.value) formData.value.storeId = ''
    if (!showDedicate.value) formData.value.dedicate = ''
  }
})

// Reset store if selected areas change and store doesn't belong to them
watch(() => formData.value.areaIds, (newAreas) => {
  if (formData.value.storeId && newAreas.length > 0) {
    const storeObj = stores.value.find(s => s.id === formData.value.storeId)
    if (storeObj && !newAreas.includes(storeObj.areaId)) {
      formData.value.storeId = ''
    }
  }
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        employeeCode: props.initialData.employeeCode,
        fullName: props.initialData.fullName,
        roleId: props.initialData.roleId,
        areaIds: [...props.initialData.areaIds],
        storeId: props.initialData.storeId || '',
        phone: props.initialData.phone,
        email: props.initialData.email,
        dedicate: props.initialData.dedicate || '',
        status: props.initialData.status
      }
    } else {
      formData.value = {
        employeeCode: '',
        fullName: '',
        roleId: '',
        areaIds: [],
        storeId: '',
        phone: '',
        email: '',
        dedicate: '',
        status: 'active'
      }
    }
  }
})

// Validation
const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  
  if (!formData.value.employeeCode || !formData.value.fullName || !formData.value.roleId) {
    formError.value = 'Please fill all required General Information.'
    return
  }
  
  if (isAreaRequired.value && formData.value.areaIds.length === 0) {
    formError.value = 'At least one Area is required for this role.'
    return
  }
  
  if (isStoreRequired.value && !formData.value.storeId) {
    formError.value = 'Store is required for Promotor.'
    return
  }
  
  if (isDedicateRequired.value && !formData.value.dedicate) {
    formError.value = 'Dedicate is required for Promotor.'
    return
  }
  
  // Clean up hidden fields before submitting
  const payload: any = { ...formData.value }
  if (!showStore.value) delete payload.storeId
  if (!showDedicate.value) delete payload.dedicate

  emit('submit', payload, createAnother)
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="initialData ? 'Edit Employee' : 'New Employee'"
    @close="emit('close')"
  >
    <div class="space-y-8">
      
      <!-- Error Message -->
      <div v-if="formError" class="p-4 rounded-md bg-red-50 border border-red-100">
        <p class="text-sm text-red-700">{{ formError }}</p>
      </div>
      
      <!-- General Information -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-100 pb-2">General Information</h3>
        <div class="space-y-4">
          <AppInput
            label="Employee Code"
            v-model="formData.employeeCode"
            placeholder="e.g. EMP001"
            required
          />
          <AppInput
            label="Full Name"
            v-model="formData.fullName"
            placeholder="e.g. Budi Santoso"
            required
          />
          <AppSelect
            label="Role"
            v-model="formData.roleId"
            :options="roleOptions"
            placeholder="Select a role..."
            required
          />
        </div>
      </section>

      <!-- Assignment -->
      <section v-if="formData.roleId">
        <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-100 pb-2">Assignment</h3>
        <div class="space-y-4">
          
          <AppMultiSelect
            label="Area"
            v-model="formData.areaIds"
            :options="areaOptions"
            :required="isAreaRequired"
            placeholder="Select area(s)..."
          />
          
          <AppSelect
            v-if="showStore"
            label="Store"
            v-model="formData.storeId"
            :options="filteredStoreOptions"
            :required="isStoreRequired"
            placeholder="Select a store..."
          />
          
          <AppSelect
            v-if="showDedicate"
            label="Dedicate"
            v-model="formData.dedicate"
            :options="dedicateOptions"
            :required="isDedicateRequired"
            placeholder="Select dedicate type..."
          />
        </div>
      </section>

      <!-- Contact Information -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-100 pb-2">Contact Information</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput
            label="Phone Number"
            v-model="formData.phone"
            placeholder="08xxxxxxxx"
          />
          <AppInput
            label="Email"
            v-model="formData.email"
            type="email"
            placeholder="email@example.com"
          />
        </div>
      </section>
      
      <!-- Status -->
      <section>
        <AppSelect
          label="Status"
          v-model="formData.status"
          :options="statusOptions"
          required
        />
      </section>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <AppButton variant="outline" @click="emit('close')" :disabled="loading">Cancel</AppButton>
        <AppButton 
          v-if="!initialData"
          variant="outline" 
          @click="handleSubmit(true)"
          :loading="loading"
        >
          Save & Create Another
        </AppButton>
        <AppButton 
          variant="primary" 
          @click="handleSubmit(false)"
          :loading="loading"
        >
          Save
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

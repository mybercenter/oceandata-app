<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppMultiSelect from '@/shared/components/AppMultiSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'

import type { Employee, DedicateType } from '../types/employee.types'
import { useLookupStore } from '@/stores/lookup.store'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  isOpen: boolean
  initialData: Employee | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

const lookupStore = useLookupStore()
const { roles, areas, stores } = storeToRefs(lookupStore)

const roleOptions = computed(() => roles.value?.map((r: any) => ({ label: r.name, value: r.id })) || [])
const areaOptions = computed(() => areas.value?.map((a: any) => ({ label: a.name, value: String(a.id) })) || [])

const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

const dedicateOptions = [
  { label: 'AV', value: 'AV' },
  { label: 'HA', value: 'HA' },
  { label: 'Hybrid', value: 'Hybrid' }
]

// Form State
const formData = ref({
  employee_code: '',
  full_name: '',
  role_id: '' as string | number,
  area_ids: [] as string[],
  store_id: '' as string | number,
  phone: '',
  email: '',
  dedicate: '' as DedicateType | '',
  is_active: true
})

// Dynamic Business Logic State
const selectedRoleObj = computed(() => roles.value?.find((r: any) => String(r.id) === String(formData.value.role_id)))
const roleName = computed(() => selectedRoleObj.value?.name)

const showStore = computed(() => roleName.value === 'Promotor')
const isStoreRequired = computed(() => roleName.value === 'Promotor')

const showDedicate = computed(() => roleName.value === 'Promotor')
const isDedicateRequired = computed(() => roleName.value === 'Promotor')

const isAreaRequired = computed(() => roleName.value !== 'Administrator')

const singleAreaId = computed({
  get: () => formData.value.area_ids[0] || '',
  set: (val: any) => {
    formData.value.area_ids = val ? [String(val)] : []
  }
})

const filteredStoreOptions = computed(() => {
  let filtered = stores.value || []
  if (formData.value.area_ids.length > 0) {
    filtered = filtered.filter((s: any) => formData.value.area_ids.includes(String(s.area_id)))
  }
  return filtered.map((s: any) => ({ label: s.name, value: String(s.id) }))
})

onMounted(async () => {
  await lookupStore.fetchLookups()
})

// Reset dependencies when role changes
watch(() => formData.value.role_id, (newRole, oldRole) => {
  if (oldRole && props.isOpen && !props.initialData) {
    if (!showStore.value) formData.value.store_id = ''
    if (!showDedicate.value) formData.value.dedicate = ''
  }
})

// Reset store if selected areas change and store doesn't belong to them
watch(() => formData.value.area_ids, (newAreas) => {
  if (formData.value.store_id && newAreas.length > 0) {
    const storeObj = stores.value?.find((s: any) => s.id === formData.value.store_id)
    if (storeObj && !newAreas.includes(storeObj.area_id)) {
      formData.value.store_id = ''
    }
  }
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        employee_code: props.initialData.employee_code || '',
        full_name: props.initialData.full_name || '',
        role_id: String(props.initialData.role?.id || ''),
        area_ids: props.initialData.areas?.map((a: any) => String(a.id)) || [],
        store_id: String(props.initialData.store?.id || ''),
        phone: props.initialData.phone || '',
        email: props.initialData.email || '',
        dedicate: props.initialData.dedicate || '',
        is_active: props.initialData.is_active !== undefined ? props.initialData.is_active : true
      }
    } else {
      formData.value = {
        employee_code: '',
        full_name: '',
        role_id: '',
        area_ids: [],
        store_id: '',
        phone: '',
        email: '',
        dedicate: '',
        is_active: true
      }
    }
  }
})

// Validation
const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  
  if (!formData.value.employee_code || !formData.value.full_name || !formData.value.role_id) {
    formError.value = 'Please fill all required General Information.'
    return
  }
  
  if (isAreaRequired.value && formData.value.area_ids.length === 0) {
    formError.value = 'At least one Area is required for this role.'
    return
  }
  
  if (isStoreRequired.value && !formData.value.store_id) {
    formError.value = 'Store is required for Promotor.'
    return
  }
  
  if (isDedicateRequired.value && !formData.value.dedicate) {
    formError.value = 'Dedicate is required for Promotor.'
    return
  }
  
  // Clean up hidden fields before submitting
  const payload: any = { 
    ...formData.value,
    // Cast IDs back to numbers for the backend
    role_id: Number(formData.value.role_id) || undefined,
    store_id: formData.value.store_id ? Number(formData.value.store_id) : undefined,
    area_ids: formData.value.area_ids.map(id => Number(id))
  }
  if (!showStore.value) delete payload.store_id
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
            v-model="formData.employee_code"
            placeholder="e.g. EMP001"
            required
          />
          <AppInput
            label="Full Name"
            v-model="formData.full_name"
            placeholder="e.g. Budi Santoso"
            required
          />
          <AppSelect
            label="Role"
            v-model="formData.role_id"
            :options="roleOptions"
            placeholder="Select a role..."
            required
          />
        </div>
      </section>

      <!-- Assignment -->
      <section v-if="formData.role_id">
        <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-100 pb-2">Assignment</h3>
        <div class="space-y-4">
          
          <AppSelect
            v-if="roleName === 'Trainer'"
            label="Area"
            v-model="singleAreaId"
            :options="areaOptions"
            :required="isAreaRequired"
            placeholder="Select an area..."
          />
          <AppMultiSelect
            v-else
            label="Area"
            v-model="formData.area_ids"
            :options="areaOptions"
            :required="isAreaRequired"
            placeholder="Select area(s)..."
          />
          
          <AppSelect
            v-if="showStore"
            label="Store"
            v-model="formData.store_id"
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
          v-model="formData.is_active"
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

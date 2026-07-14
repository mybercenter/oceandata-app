<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppAsyncSelect from '@/shared/components/AppAsyncSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import PasswordInput from '@/shared/components/PasswordInput.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

import type { User } from '../types/user.types'

const props = defineProps<{
  isOpen: boolean
  initialData: User | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

const formData = ref({
  employee_id: null as number | string | null,
  username: '',
  password: '',
  confirmPassword: '',
  is_active: true
})

// Map employee item from /employees API response to select option
const mapEmployeeOption = (item: any) => ({
  label: `${item.full_name} (${item.employee_code}) - ${item.role?.name || 'No Role'}`,
  value: item.id
})

// Initial option for edit mode (employee already linked)
const initialEmployeeOption = computed(() => {
  if (props.initialData?.employee) {
    const emp = props.initialData.employee
    return {
      label: `${emp.full_name} (${(emp as any).employee_code || ''}) - ${(emp as any).role?.name || ''}`,
      value: emp.id
    }
  }
  return null
})

const isEditMode = computed(() => !!props.initialData)

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        employee_id: props.initialData.employee?.id || null,
        username: props.initialData.username,
        password: '',
        confirmPassword: '',
        is_active: props.initialData.is_active !== undefined ? props.initialData.is_active : true
      }
    } else {
      formData.value = {
        employee_id: null,
        username: '',
        password: '',
        confirmPassword: '',
        is_active: true
      }
    }
  }
})

// Validation & Generation
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let pwd = ''
  for (let i = 0; i < 12; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  formData.value.password = pwd
  formData.value.confirmPassword = pwd
}

const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  
  if (!formData.value.employee_id || !formData.value.username) {
    formError.value = 'Please fill all required fields.'
    return
  }

  if (!isEditMode.value) {
    if (!formData.value.password) {
      formError.value = 'Password is required for new accounts.'
      return
    }
    if (formData.value.password.length < 8) {
      formError.value = 'Password must be at least 8 characters.'
      return
    }
    if (formData.value.password !== formData.value.confirmPassword) {
      formError.value = 'Passwords do not match.'
      return
    }
  }

  // Send password_confirmation for Laravel validation
  const payload: any = {
    employee_id: formData.value.employee_id,
    username: formData.value.username,
    is_active: formData.value.is_active,
  }
  if (formData.value.password) {
    payload.password = formData.value.password
    payload.password_confirmation = formData.value.confirmPassword
  }

  emit('submit', payload, createAnother)
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="initialData ? 'Edit User' : 'Create User'"
    @close="emit('close')"
  >
    <div class="space-y-6">
      
      <div v-if="formError" class="p-3 rounded-md bg-red-50 border border-red-100">
        <p class="text-sm text-red-700">{{ formError }}</p>
      </div>
      
      <!-- Employee Info -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-100 pb-2">Employee Information</h3>
        <AppAsyncSelect
          label="Employee"
          v-model="formData.employee_id"
          endpoint="/employees"
          :extra-params="isEditMode ? {} : { unregistered: 1 }"
          :map-option="mapEmployeeOption"
          :initial-option="initialEmployeeOption"
          :disabled="isEditMode"
          placeholder="Search unregistered employees..."
          required
        />
        <p v-if="!isEditMode" class="text-xs text-gray-500 mt-1">Only employees without existing user accounts are shown.</p>
      </section>

      <!-- Account Info -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-100 pb-2">Account Information</h3>
        <div class="space-y-4">
          <AppInput
            label="Username"
            v-model="formData.username"
            placeholder="e.g. jdoe"
            required
          />
          
          <template v-if="!isEditMode">
            <div class="space-y-4">
              <div class="flex items-end gap-2">
                <div class="flex-1">
                  <PasswordInput
                    label="Password"
                    v-model="formData.password"
                    placeholder="Min. 8 characters"
                    required
                  />
                </div>
                <AppButton type="button" variant="outline" @click="generatePassword" class="mb-1" title="Generate Password">
                  <ArrowPathIcon class="w-5 h-5 text-gray-600" />
                </AppButton>
              </div>
              <PasswordInput
                label="Confirm Password"
                v-model="formData.confirmPassword"
                placeholder="Retype password"
                required
              />
            </div>
          </template>
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

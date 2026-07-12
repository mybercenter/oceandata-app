<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import PasswordInput from '@/shared/components/PasswordInput.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

import type { User, UserStatus } from '../types/user.types'
import { userService } from '../services/user.service'
import type { Employee } from '../../employee/types/employee.types'

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
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const formData = ref({
  employeeId: '',
  username: '',
  password: '',
  confirmPassword: '',
  status: 'active' as UserStatus
})

const unregisteredEmployees = ref<Employee[]>([])
const isLoadingEmployees = ref(false)

const loadEmployees = async () => {
  isLoadingEmployees.value = true
  const list = await userService.getUnregisteredEmployees()
  unregisteredEmployees.value = list
  isLoadingEmployees.value = false
}

const employeeOptions = computed(() => {
  const options = unregisteredEmployees.value.map(e => ({ 
    label: e.fullName + ' (' + e.employeeCode + ') - ' + (e.role?.name || ''), 
    value: e.id 
  }))
  
  if (props.initialData && props.initialData.employee) {
    options.unshift({
      label: props.initialData.employee.fullName + ' (' + props.initialData.employee.employeeCode + ') - ' + (props.initialData.employee.role?.name || ''),
      value: props.initialData.employee.id
    })
  }
  return options
})

const isEditMode = computed(() => !!props.initialData)

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await loadEmployees()
    if (props.initialData) {
      formData.value = {
        employeeId: props.initialData.employeeId,
        username: props.initialData.username,
        password: '',
        confirmPassword: '',
        status: props.initialData.status
      }
    } else {
      formData.value = {
        employeeId: '',
        username: '',
        password: '',
        confirmPassword: '',
        status: 'active'
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
  
  if (!formData.value.employeeId || !formData.value.username) {
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

  emit('submit', { ...formData.value }, createAnother)
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
        <AppSelect
          label="Employee"
          v-model="formData.employeeId"
          :options="employeeOptions"
          :disabled="isEditMode || isLoadingEmployees"
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

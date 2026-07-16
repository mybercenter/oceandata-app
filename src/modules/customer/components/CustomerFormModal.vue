<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppAsyncSelect from '@/shared/components/AppAsyncSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'

import type { Customer, CustomerStatus, Conversion, Gender } from '../types/customer.types'

const props = defineProps<{
  isOpen: boolean
  initialData: Customer | null
  loading?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' }
]

const statusOptions = [
  { label: 'Inquiry', value: 'Inquiry' },
  { label: 'Purchased', value: 'Purchased' }
]

const conversionOptions = [
  { label: 'Potential', value: 'Potential' },
  { label: 'Prospect', value: 'Prospect' },
  { label: 'Hot Prospect', value: 'Hot Prospect' }
]

const activeOptions = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' }
]

const formData = ref({
  customer_date: new Date().toISOString().split('T')[0],
  full_name: '',
  gender: '' as Gender | '',
  phone: '',
  social_media: '',
  product: '',
  quantity: '' as number | '',
  current_conversion: '' as Conversion,
  customer_status: 'Inquiry' as CustomerStatus,
  is_active: 'true',
  employee_id: null as number | string | null
})

const isEditMode = computed(() => !!props.initialData)

// Initial employee option for edit mode
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

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        customer_date: props.initialData.customer_date || new Date().toISOString().split('T')[0],
        full_name: props.initialData.full_name || '',
        gender: props.initialData.gender || '',
        phone: props.initialData.phone || '',
        social_media: props.initialData.social_media || '',
        product: props.initialData.product || '',
        quantity: props.initialData.quantity || '',
        current_conversion: props.initialData.current_conversion || ('' as Conversion),
        customer_status: props.initialData.customer_status || 'Inquiry',
        is_active: props.initialData.is_active ? 'true' : 'false',
        employee_id: props.initialData.employee?.id || null
      }
    } else {
      formData.value = {
        customer_date: new Date().toISOString().split('T')[0],
        full_name: '',
        gender: '',
        phone: '',
        social_media: '',
        product: '',
        quantity: '',
        current_conversion: '' as Conversion,
        customer_status: 'Inquiry',
        is_active: 'true',
        employee_id: null
      }
    }
  }
})

const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  
  if (!formData.value.customer_date) {
    formError.value = 'Customer Date is required.'
    return
  }
  if (!formData.value.full_name) {
    formError.value = 'Customer Name is required.'
    return
  }
  if (isEditMode.value && !formData.value.employee_id) {
    formError.value = 'Assigned Employee is required.'
    return
  }
  
  const submitData: any = {
    ...formData.value,
    is_active: formData.value.is_active === 'true',
    quantity: formData.value.quantity === '' ? null : Number(formData.value.quantity)
  }

  // Remove employee_id if not in edit mode (handled by backend auth context)
  if (!isEditMode.value) {
    delete submitData.employee_id
  }
  
  emit('submit', submitData, createAnother)
}

const getError = (field: string) => {
  return props.errors?.[field]?.[0]
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="initialData ? 'Edit Customer' : 'Add Customer'"
    @close="emit('close')"
  >
    <div class="space-y-8">
      <div v-if="formError" class="p-3 rounded-md bg-red-50 border border-red-100">
        <p class="text-sm text-red-700">{{ formError }}</p>
      </div>

      <!-- Basic Information -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
        <div class="space-y-4">
          <AppInput
            type="date"
            label="Customer Date"
            v-model="formData.customer_date"
            :error="getError('customer_date')"
            required
          />
          <AppInput
            label="Customer Name"
            v-model="formData.full_name"
            placeholder="e.g. John Doe"
            :error="getError('full_name')"
            required
          />
          <AppSelect
            label="Gender"
            v-model="formData.gender"
            :options="[{label: 'Select Gender', value: ''}, ...genderOptions]"
            :error="getError('gender')"
          />
          <AppAsyncSelect
            v-if="isEditMode"
            label="Assigned Employee"
            v-model="formData.employee_id"
            endpoint="/employees"
            :initial-option="initialEmployeeOption"
            :error="getError('employee_id')"
            required
          />
        </div>
      </section>

      <!-- Contact Information -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-4 border-b pb-2">Contact Information</h3>
        <div class="space-y-4">
          <AppInput
            label="Phone Number"
            v-model="formData.phone"
            placeholder="e.g. 081234567890"
            :error="getError('phone')"
          />
          <AppInput
            label="Social Media"
            v-model="formData.social_media"
            placeholder="e.g. @johndoe (IG/FB)"
            :error="getError('social_media')"
          />
        </div>
      </section>

      <!-- Product Information -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-4 border-b pb-2">Product Information</h3>
        <div class="space-y-4">
          <AppInput
            label="Interested/Purchased Product"
            v-model="formData.product"
            placeholder="e.g. TV LED 50 Inch"
            :error="getError('product')"
          />
          <AppInput
            type="number"
            label="Quantity"
            v-model="formData.quantity as any"
            placeholder="e.g. 1"
            :error="getError('quantity')"
          />
        </div>
      </section>

      <!-- Status -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-4 border-b pb-2">Status & Tracking</h3>
        <div class="space-y-4">
          <AppSelect
            label="Customer Status"
            v-model="formData.customer_status"
            :options="statusOptions"
            :error="getError('customer_status')"
          />
          <AppSelect
            v-if="initialData"
            label="Conversion Stage"
            v-model="formData.current_conversion"
            :options="conversionOptions"
            :error="getError('current_conversion')"
          />
          <AppSelect
            label="System Status"
            v-model="formData.is_active"
            :options="activeOptions"
            :error="getError('is_active')"
          />
        </div>
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
          Save & Add Another
        </AppButton>
        <AppButton 
          variant="primary" 
          @click="handleSubmit(false)"
          :loading="loading"
        >
          Save Customer
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppTextarea from '@/shared/components/AppTextarea.vue'

import type { Customer, CustomerStatus, Conversion, Gender } from '../types/customer.types'
import { employeeService } from '../../employee/services/employee.service'
import type { Employee } from '../../employee/types/employee.types'

const props = defineProps<{
  isOpen: boolean
  initialData: Customer | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

const employees = ref<Employee[]>([])
const isLoadingEmployees = ref(false)

onMounted(async () => {
  isLoadingEmployees.value = true
  try {
    employees.value = await employeeService.getEmployees()
  } finally {
    isLoadingEmployees.value = false
  }
})

const employeeOptions = computed(() => {
  return employees.value.map(e => ({ label: e.fullName, value: e.id }))
})

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
  customerDate: new Date().toISOString().split('T')[0],
  fullName: '',
  gender: '' as Gender | '',
  phone: '',
  socialMedia: '',
  product: '',
  quantity: 1 as number | '',
  currentConversion: 'Potential' as Conversion,
  customerStatus: 'Inquiry' as CustomerStatus,
  isActive: 'true',
  employeeId: ''
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        customerDate: props.initialData.customerDate,
        fullName: props.initialData.fullName,
        gender: props.initialData.gender || '',
        phone: props.initialData.phone || '',
        socialMedia: props.initialData.socialMedia || '',
        product: props.initialData.product || '',
        quantity: props.initialData.quantity || '',
        currentConversion: props.initialData.currentConversion,
        customerStatus: props.initialData.customerStatus,
        isActive: props.initialData.isActive ? 'true' : 'false',
        employeeId: props.initialData.employeeId
      }
    } else {
      formData.value = {
        customerDate: new Date().toISOString().split('T')[0],
        fullName: '',
        gender: '',
        phone: '',
        socialMedia: '',
        product: '',
        quantity: '',
        currentConversion: 'Potential',
        customerStatus: 'Inquiry',
        isActive: 'true',
        employeeId: ''
      }
    }
  }
})

const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  if (!formData.value.customerDate) {
    formError.value = 'Customer Date is required.'
    return
  }
  if (!formData.value.fullName) {
    formError.value = 'Customer Name is required.'
    return
  }
  if (!formData.value.employeeId) {
    formError.value = 'Assigned Employee is required.'
    return
  }
  
  const submitData = {
    ...formData.value,
    isActive: formData.value.isActive === 'true',
    quantity: formData.value.quantity === '' ? undefined : Number(formData.value.quantity)
  }
  
  emit('submit', submitData, createAnother)
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
            v-model="formData.customerDate"
            required
          />
          <AppInput
            label="Customer Name"
            v-model="formData.fullName"
            placeholder="e.g. John Doe"
            required
          />
          <AppSelect
            label="Gender"
            v-model="formData.gender"
            :options="[{label: 'Select Gender', value: ''}, ...genderOptions]"
          />
          <AppSelect
            label="Assigned Employee"
            v-model="formData.employeeId"
            :options="employeeOptions"
            :disabled="isLoadingEmployees"
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
          />
          <AppInput
            label="Social Media"
            v-model="formData.socialMedia"
            placeholder="e.g. @johndoe (IG/FB)"
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
          />
          <AppInput
            type="number"
            label="Quantity"
            v-model="formData.quantity as any"
            placeholder="e.g. 1"
          />
        </div>
      </section>

      <!-- Status -->
      <section>
        <h3 class="text-sm font-semibold text-gray-900 mb-4 border-b pb-2">Status & Tracking</h3>
        <div class="space-y-4">
          <AppSelect
            label="Customer Status"
            v-model="formData.customerStatus"
            :options="statusOptions"
          />
          <AppSelect
            v-if="initialData"
            label="Conversion Stage"
            v-model="formData.currentConversion"
            :options="conversionOptions"
          />
          <AppSelect
            label="System Status"
            v-model="formData.isActive"
            :options="activeOptions"
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


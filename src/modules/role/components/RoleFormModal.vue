<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppTextarea from '@/shared/components/AppTextarea.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'

import type { Role, RoleStatus } from '../types/role.types'

const props = defineProps<{
  isOpen: boolean
  initialData: Role | null
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
  name: '',
  description: '',
  status: 'active' as RoleStatus
})

const isEditMode = computed(() => !!props.initialData)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        name: props.initialData.name,
        description: props.initialData.description || '',
        status: props.initialData.status
      }
    } else {
      formData.value = {
        name: '',
        description: '',
        status: 'active'
      }
    }
  }
})

const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  if (!formData.value.name) {
    formError.value = 'Role name is required.'
    return
  }
  emit('submit', { ...formData.value }, createAnother)
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="initialData ? 'Edit Role' : 'Create Role'"
    @close="emit('close')"
  >
    <div class="space-y-6">
      <div v-if="formError" class="p-3 rounded-md bg-red-50 border border-red-100">
        <p class="text-sm text-red-700">{{ formError }}</p>
      </div>

      <AppInput
        label="Role Name"
        v-model="formData.name"
        placeholder="e.g. Content Writer"
        required
      />

      <AppTextarea
        label="Description"
        v-model="formData.description"
        placeholder="Explain what this role does..."
        :rows="3"
      />

      <AppSelect
        label="Status"
        v-model="formData.status"
        :options="statusOptions"
        required
      />
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { SparklesIcon } from '@heroicons/vue/24/outline'

import type { Permission, ModuleName, ActionName } from '../types/permission.types'

const props = defineProps<{
  isOpen: boolean
  initialData: Permission | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

const moduleOptions = [
  'Dashboard', 'Area', 'Store', 'Employee', 'Users', 'Roles', 'Message Template', 'Customer', 'Follow Up', 'Report', 'Settings'
].map(m => ({ label: m, value: m }))

const actionOptions = [
  'View', 'Create', 'Update', 'Delete', 'Export', 'Approve'
].map(a => ({ label: a, value: a }))

const formData = ref({
  name: '',
  module: 'Dashboard' as ModuleName,
  action: 'View' as ActionName
})

const isEditMode = computed(() => !!props.initialData)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        name: props.initialData.name,
        module: props.initialData.module,
        action: props.initialData.action
      }
    } else {
      formData.value = {
        name: '',
        module: 'Dashboard',
        action: 'View'
      }
    }
  }
})

const autoGenerateName = () => {
  if (formData.value.module && formData.value.action) {
    formData.value.name = formData.value.action + ' ' + formData.value.module
  }
}

// Automatically update name if empty and module/action changes
watch(() => formData.value.module, autoGenerateName)
watch(() => formData.value.action, autoGenerateName)

const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  if (!formData.value.name) {
    formError.value = 'Permission name is required.'
    return
  }
  emit('submit', { ...formData.value }, createAnother)
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="initialData ? 'Edit Permission' : 'Create Permission'"
    @close="emit('close')"
  >
    <div class="space-y-6">
      <div v-if="formError" class="p-3 rounded-md bg-red-50 border border-red-100">
        <p class="text-sm text-red-700">{{ formError }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <AppSelect
          label="Module"
          v-model="formData.module"
          :options="moduleOptions"
          required
        />
        <AppSelect
          label="Action"
          v-model="formData.action"
          :options="actionOptions"
          required
        />
      </div>

      <div class="flex items-end gap-2">
        <div class="flex-1">
          <AppInput
            label="Permission Name"
            v-model="formData.name"
            placeholder="e.g. View Dashboard"
            required
          />
        </div>
        <AppButton type="button" variant="outline" @click="autoGenerateName" class="mb-1" title="Auto Generate">
          <SparklesIcon class="w-5 h-5 text-gray-600" />
        </AppButton>
      </div>
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

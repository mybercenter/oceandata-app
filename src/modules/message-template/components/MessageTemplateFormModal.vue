<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppTextarea from '@/shared/components/AppTextarea.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppAsyncSelect from '@/shared/components/AppAsyncSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'

import WhatsappPreview from './WhatsappPreview.vue'
import PlaceholderHelper from './PlaceholderHelper.vue'
import CharacterCounter from './CharacterCounter.vue'

import type { MessageTemplate, DedicateType } from '../types/message-template.types'

const props = defineProps<{
  isOpen: boolean
  initialData: MessageTemplate | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

// Initial area option for edit mode
const initialAreaOption = computed(() => {
  if (props.initialData?.area) {
    return { label: props.initialData.area.name, value: props.initialData.area.id }
  }
  return null
})

const dedicateOptions = [
  { label: 'AV (Audio Video)', value: 'AV' },
  { label: 'HA (Home Appliances)', value: 'HA' }
]

const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

const formData = ref({
  area_id: null as number | string | null,
  dedicate: 'AV' as DedicateType,
  template_1: '',
  template_2: '',
  template_3: '',
  is_active: true
})

const isEditMode = computed(() => !!props.initialData)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        area_id: props.initialData.area?.id || null,
        dedicate: props.initialData.dedicate,
        template_1: props.initialData.template_1 || '',
        template_2: props.initialData.template_2 || '',
        template_3: props.initialData.template_3 || '',
        is_active: props.initialData.is_active !== undefined ? props.initialData.is_active : true
      }
    } else {
      formData.value = {
        area_id: null,
        dedicate: 'AV',
        template_1: '',
        template_2: '',
        template_3: '',
        is_active: true
      }
    }
  }
})

const previewMessages = computed(() => {
  const msgs = []
  if (formData.value.template_1) msgs.push(formData.value.template_1)
  if (formData.value.template_2) msgs.push(formData.value.template_2)
  if (formData.value.template_3) msgs.push(formData.value.template_3)
  return msgs
})

const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  if (!formData.value.area_id) {
    formError.value = 'Operational Area is required.'
    return
  }
  if (!formData.value.template_1 && !formData.value.template_2 && !formData.value.template_3) {
    formError.value = 'At least one template message must be filled.'
    return
  }
  
  emit('submit', { ...formData.value }, createAnother)
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="initialData ? 'Edit Message Template' : 'Create Message Template'"
    size="full"
    @close="emit('close')"
  >
    <!-- Split Layout Wrapper -->
    <div class="flex flex-col lg:flex-row gap-6 h-full -mx-2">
      
      <!-- Left Column: Form -->
      <div class="w-full lg:w-3/5 space-y-6 px-2">
        
        <div v-if="formError" class="p-3 rounded-md bg-red-50 border border-red-100">
          <p class="text-sm text-red-700">{{ formError }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppAsyncSelect
            label="Operational Area"
            v-model="formData.area_id"
            endpoint="/areas"
            :initial-option="initialAreaOption"
            required
          />
          <AppSelect
            label="Dedicate Category"
            v-model="formData.dedicate"
            :options="dedicateOptions"
            required
          />
        </div>

        <PlaceholderHelper />

        <div>
          <AppTextarea
            label="Template 1 (Follow Up Day 1)"
            v-model="formData.template_1"
            placeholder="Type your first follow-up message..."
            :rows="5"
          />
          <CharacterCounter :length="formData.template_1.length" />
        </div>

        <div>
          <AppTextarea
            label="Template 2 (Follow Up Day 3)"
            v-model="formData.template_2"
            placeholder="Type your second follow-up message..."
            :rows="4"
          />
          <CharacterCounter :length="formData.template_2.length" />
        </div>

        <div>
          <AppTextarea
            label="Template 3 (Follow Up Day 7)"
            v-model="formData.template_3"
            placeholder="Type your third follow-up message..."
            :rows="4"
          />
          <CharacterCounter :length="formData.template_3.length" />
        </div>

        <AppSelect
          label="Status"
          v-model="formData.is_active"
          :options="statusOptions"
          required
        />
      </div>

      <!-- Right Column: Live Preview -->
      <div class="w-full lg:w-2/5 px-2">
        <div class="sticky top-0 pt-2 lg:pt-0">
          <h4 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Live Preview</h4>
          <WhatsappPreview :messages="previewMessages" />
        </div>
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


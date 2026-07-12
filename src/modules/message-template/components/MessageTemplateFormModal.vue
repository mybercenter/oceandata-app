<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppTextarea from '@/shared/components/AppTextarea.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'

import WhatsappPreview from './WhatsappPreview.vue'
import PlaceholderHelper from './PlaceholderHelper.vue'
import CharacterCounter from './CharacterCounter.vue'

import type { MessageTemplate, DedicateType, TemplateStatus } from '../types/message-template.types'
import { areaService } from '../../area/services/area.service'
import type { Area } from '../../area/types/area.types'

const props = defineProps<{
  isOpen: boolean
  initialData: MessageTemplate | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

const areas = ref<Area[]>([])
const isLoadingAreas = ref(false)

onMounted(async () => {
  isLoadingAreas.value = true
  try {
    areas.value = await areaService.getAreas()
  } finally {
    isLoadingAreas.value = false
  }
})

const areaOptions = computed(() => {
  return areas.value.map(a => ({ label: a.name, value: a.id }))
})

const dedicateOptions = [
  { label: 'AV (Audio Video)', value: 'AV' },
  { label: 'HA (Home Appliances)', value: 'HA' }
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const formData = ref({
  areaId: '',
  dedicate: 'AV' as DedicateType,
  template1: '',
  template2: '',
  template3: '',
  status: 'active' as TemplateStatus
})

const isEditMode = computed(() => !!props.initialData)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        areaId: props.initialData.areaId,
        dedicate: props.initialData.dedicate,
        template1: props.initialData.template1 || '',
        template2: props.initialData.template2 || '',
        template3: props.initialData.template3 || '',
        status: props.initialData.status
      }
    } else {
      formData.value = {
        areaId: '',
        dedicate: 'AV',
        template1: '',
        template2: '',
        template3: '',
        status: 'active'
      }
    }
  }
})

const previewMessages = computed(() => {
  const msgs = []
  if (formData.value.template1) msgs.push(formData.value.template1)
  if (formData.value.template2) msgs.push(formData.value.template2)
  if (formData.value.template3) msgs.push(formData.value.template3)
  return msgs
})

const formError = ref('')
const handleSubmit = (createAnother = false) => {
  formError.value = ''
  if (!formData.value.areaId) {
    formError.value = 'Operational Area is required.'
    return
  }
  if (!formData.value.template1 && !formData.value.template2 && !formData.value.template3) {
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
          <AppSelect
            label="Operational Area"
            v-model="formData.areaId"
            :options="areaOptions"
            :disabled="isLoadingAreas"
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
            v-model="formData.template1"
            placeholder="Type your first follow-up message..."
            :rows="5"
          />
          <CharacterCounter :length="formData.template1.length" />
        </div>

        <div>
          <AppTextarea
            label="Template 2 (Follow Up Day 3)"
            v-model="formData.template2"
            placeholder="Type your second follow-up message..."
            :rows="4"
          />
          <CharacterCounter :length="formData.template2.length" />
        </div>

        <div>
          <AppTextarea
            label="Template 3 (Follow Up Day 7)"
            v-model="formData.template3"
            placeholder="Type your third follow-up message..."
            :rows="4"
          />
          <CharacterCounter :length="formData.template3.length" />
        </div>

        <AppSelect
          label="Status"
          v-model="formData.status"
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


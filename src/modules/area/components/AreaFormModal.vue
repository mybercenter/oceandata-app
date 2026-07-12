<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import type { Area } from '../types/area.types'

const props = defineProps<{
  isOpen: boolean
  initialData?: Area | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

const form = ref({
  code: '',
  name: '',
  status: 'active'
})

const isEdit = ref(false)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      isEdit.value = true
      form.value = {
        code: props.initialData.code,
        name: props.initialData.name,
        status: props.initialData.status
      }
    } else {
      isEdit.value = false
      form.value = {
        code: '',
        name: '',
        status: 'active'
      }
    }
  }
})

const handleSubmit = (createAnother = false) => {
  if (!form.value.code || !form.value.name || !form.value.status) return
  emit('submit', { ...form.value }, createAnother)
}
</script>

<template>
  <AppModal 
    :isOpen="isOpen" 
    @close="emit('close')"
    :title="isEdit ? 'Edit Area' : 'New Area'"
    size="md"
  >
    <div class="space-y-6">
      <AppInput 
        label="Area Code" 
        v-model="form.code"
        placeholder="e.g. JATIM1"
        required
        :disabled="loading"
        hint="Unique code for this area"
      />
      
      <AppInput 
        label="Area Name" 
        v-model="form.name"
        placeholder="e.g. Jawa Timur 1"
        required
        :disabled="loading"
      />
      
      <AppSelect 
        label="Status" 
        v-model="form.status"
        :options="[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ]"
        required
        :disabled="loading"
      />
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row justify-end gap-3 w-full">
        <AppButton 
          variant="outline" 
          @click="emit('close')"
          :disabled="loading"
          class="w-full sm:w-auto"
        >
          Cancel
        </AppButton>
        
        <AppButton 
          v-if="!isEdit"
          variant="secondary" 
          @click="handleSubmit(true)"
          :loading="loading"
          class="w-full sm:w-auto hidden sm:flex"
        >
          Save & Create Another
        </AppButton>
        
        <AppButton 
          variant="primary" 
          @click="handleSubmit(false)"
          :loading="loading"
          class="w-full sm:w-auto"
        >
          {{ isEdit ? 'Save Changes' : 'Save Area' }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

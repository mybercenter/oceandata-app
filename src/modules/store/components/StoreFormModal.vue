<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppAsyncSelect from '@/shared/components/AppAsyncSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import type { Store } from '../types/store.types'
import { useLookupStore } from '@/stores/lookup.store'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  isOpen: boolean
  initialData: Store | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any, createAnother: boolean): void
}>()

const formData = ref({
  code: '',
  name: '',
  area_id: '' as string | number | null,
  address: '',
  is_active: true
})

const lookupStore = useLookupStore()

const initialAreaOption = computed(() => {
  if (props.initialData?.area) {
    return {
      label: props.initialData.area.name,
      value: props.initialData.area.id
    }
  }
  return null
})

const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

onMounted(async () => {
  await lookupStore.fetchLookups()
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        code: props.initialData.code,
        name: props.initialData.name,
        area_id: props.initialData.area?.id || null,
        address: props.initialData.address,
        is_active: props.initialData.is_active
      }
    } else {
      formData.value = {
        code: '',
        name: '',
        area_id: null,
        address: '',
        is_active: true
      }
    }
  }
})

const handleSubmit = (createAnother = false) => {
  emit('submit', { ...formData.value }, createAnother)
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="initialData ? 'Edit Store' : 'New Store'"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <AppAsyncSelect
        label="Area"
        v-model="formData.area_id"
        endpoint="/areas"
        :initial-option="initialAreaOption"
        required
      />
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppInput
          label="Store Code"
          v-model="formData.code"
          placeholder="e.g. UFO-SBY-001"
          required
        />
        <AppInput
          label="Store Name"
          v-model="formData.name"
          placeholder="e.g. UFO Surabaya 1"
          required
        />
      </div>

      <AppInput
        label="Address"
        v-model="formData.address"
        placeholder="Full address"
        required
      />

      <AppSelect
        label="Status"
        v-model="formData.is_active"
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

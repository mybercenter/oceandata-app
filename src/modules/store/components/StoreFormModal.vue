<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import type { Store, StoreStatus } from '../types/store.types'
import { areaService } from '../../area/services/area.service'
import type { Area } from '../../area/types/area.types'

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
  areaId: '',
  address: '',
  status: 'active' as StoreStatus
})

const areas = ref<Area[]>([])
const isLoadingAreas = ref(false)

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Maintenance', value: 'maintenance' }
]

onMounted(async () => {
  isLoadingAreas.value = true
  areas.value = await areaService.getAreas()
  isLoadingAreas.value = false
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.value = {
        code: props.initialData.code,
        name: props.initialData.name,
        areaId: props.initialData.areaId,
        address: props.initialData.address,
        status: props.initialData.status
      }
    } else {
      formData.value = {
        code: '',
        name: '',
        areaId: '',
        address: '',
        status: 'active'
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
      <AppSelect
        label="Area"
        v-model="formData.areaId"
        :options="areas.map(a => ({ label: a.name, value: a.id }))"
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

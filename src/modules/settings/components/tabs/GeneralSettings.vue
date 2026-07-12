<script setup lang="ts">
import AppInput from '@/shared/components/AppInput.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { ref } from 'vue'

const props = defineProps<{
  modelValue: any
  isSaving: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save', 'reset'])

const langOptions = [{label: 'English', value: 'English'}, {label: 'Indonesian', value: 'Indonesian'}]
const tzOptions = [{label: 'Asia/Jakarta', value: 'Asia/Jakarta'}, {label: 'Asia/Makassar', value: 'Asia/Makassar'}, {label: 'Asia/Jayapura', value: 'Asia/Jayapura'}]
const formatOptions = [{label: 'DD/MM/YYYY', value: 'DD/MM/YYYY'}, {label: 'MM/DD/YYYY', value: 'MM/DD/YYYY'}, {label: 'YYYY-MM-DD', value: 'YYYY-MM-DD'}]

// mock file upload
const logoPreview = ref('https://via.placeholder.com/150x150.png?text=OD')
</script>
<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 border-b pb-3 mb-6">General Settings</h2>
    
    <div class="space-y-6 max-w-2xl">
      <div class="flex items-center gap-6">
        <div class="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
          <img :src="logoPreview" alt="App Logo" class="w-full h-full object-cover" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-gray-900 mb-1">Application Logo</h4>
          <p class="text-xs text-gray-500 mb-3">Recommended size 256x256px. Max 2MB.</p>
          <div class="flex gap-2">
            <AppButton variant="outline" size="sm">Upload New</AppButton>
            <AppButton variant="outline" size="sm" class="text-red-600">Remove</AppButton>
          </div>
        </div>
      </div>

      <AppInput label="Application Name" v-model="modelValue.appName" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppSelect label="Language" v-model="modelValue.language" :options="langOptions" />
        <AppSelect label="Timezone" v-model="modelValue.timezone" :options="tzOptions" />
      </div>
      <AppSelect label="Date Format" v-model="modelValue.dateFormat" :options="formatOptions" />
      
      <div class="flex justify-end gap-3 pt-6 border-t mt-8">
        <AppButton variant="outline" @click="emit('reset')">Discard Changes</AppButton>
        <AppButton variant="primary" @click="emit('save')" :loading="isSaving">Save General</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppTextarea from '@/shared/components/AppTextarea.vue'

const props = defineProps<{
  modelValue: any
  isSaving: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save', 'reset'])
</script>
<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 border-b pb-3 mb-6">Company Information</h2>
    
    <div class="space-y-6 max-w-2xl">
      <AppInput label="Company Name" v-model="modelValue.name" />
      <AppTextarea label="Address" v-model="modelValue.address" :rows="3" />
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppInput label="Phone Number" v-model="modelValue.phone" />
        <AppInput label="Email Address" type="email" v-model="modelValue.email" />
      </div>
      <AppInput label="Website" type="url" v-model="modelValue.website" />
      
      <div class="flex justify-end gap-3 pt-6 border-t mt-8">
        <AppButton variant="outline" @click="emit('reset')">Discard Changes</AppButton>
        <AppButton variant="primary" @click="emit('save')" :loading="isSaving">Save Company</AppButton>
      </div>
    </div>
  </div>
</template>

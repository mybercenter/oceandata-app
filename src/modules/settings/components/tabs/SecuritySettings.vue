<script setup lang="ts">
import AppButton from '@/shared/components/AppButton.vue'

const props = defineProps<{
  modelValue: any
  isSaving: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save', 'reset'])
</script>
<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 border-b pb-3 mb-6">Security & Policies</h2>
    
    <div class="space-y-6 max-w-2xl">
      <div>
        <h4 class="text-sm font-bold text-gray-900 mb-2">Password Policy</h4>
        <p class="text-xs text-gray-500 mb-4">Enforce strong password rules for all users across the application.</p>
        
        <div class="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Minimum Length</span>
            <select v-model="modelValue.minLength" class="border-gray-300 rounded-md shadow-sm text-sm py-1.5 focus:border-primary-500 focus:ring-primary-500">
              <option :value="6">6 characters</option>
              <option :value="8">8 characters</option>
              <option :value="10">10 characters</option>
              <option :value="12">12 characters</option>
            </select>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Require Uppercase Letter</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="modelValue.requireUppercase" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Require Number</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="modelValue.requireNumber" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Require Special Character</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="modelValue.requireSpecial" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

        </div>
      </div>
      
      <div class="flex justify-end gap-3 pt-6 border-t mt-8">
        <AppButton variant="outline" @click="emit('reset')">Discard Changes</AppButton>
        <AppButton variant="primary" @click="emit('save')" :loading="isSaving">Save Security Policies</AppButton>
      </div>
    </div>
  </div>
</template>

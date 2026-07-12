<script setup lang="ts">
import AppSelect from '@/shared/components/AppSelect.vue'
import AppButton from '@/shared/components/AppButton.vue'

const props = defineProps<{
  modelValue: any
  isSaving: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save', 'reset'])

const rowsOptions = [{label: '10 Rows', value: 10}, {label: '25 Rows', value: 25}, {label: '50 Rows', value: 50}]
const dashOptions = [{label: 'Admin Overview', value: 'Admin'}, {label: 'Sales Performance', value: 'Sales'}]
const themeOptions = [{label: 'Light', value: 'Light'}, {label: 'Dark', value: 'Dark'}, {label: 'System Default', value: 'System'}]
</script>
<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 border-b pb-3 mb-6">Application Preferences</h2>
    
    <div class="space-y-6 max-w-2xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppSelect label="Default Rows Per Page" v-model="modelValue.rowsPerPage" :options="rowsOptions" />
        <AppSelect label="Default Dashboard" v-model="modelValue.defaultDashboard" :options="dashOptions" />
        <AppSelect label="Default Theme" v-model="modelValue.defaultTheme" :options="themeOptions" />
      </div>

      <div class="pt-4 border-t mt-4">
        <h4 class="text-sm font-bold text-gray-900 mb-2">Notification Preferences</h4>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Email Notifications</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="modelValue.emailNotifications" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Push Notifications (Browser)</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="modelValue.pushNotifications" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 pt-6 border-t mt-8">
        <AppButton variant="outline" @click="emit('reset')">Discard Changes</AppButton>
        <AppButton variant="primary" @click="emit('save')" :loading="isSaving">Save Preferences</AppButton>
      </div>
    </div>
  </div>
</template>

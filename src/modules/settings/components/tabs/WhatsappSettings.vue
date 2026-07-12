<script setup lang="ts">
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: any
  isSaving: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save', 'reset'])

const formatDate = (d: string) => new Date(d).toLocaleString()
</script>
<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 class="text-lg font-bold text-emerald-600 border-b pb-3 mb-6">WhatsApp API Configuration</h2>
    
    <div class="space-y-6 max-w-2xl">
      <div class="flex items-center p-4 rounded-lg" :class="modelValue.isConnected ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'">
        <CheckCircleIcon v-if="modelValue.isConnected" class="w-8 h-8 text-emerald-500 mr-3" />
        <XCircleIcon v-else class="w-8 h-8 text-red-500 mr-3" />
        <div>
          <h4 class="text-sm font-bold" :class="modelValue.isConnected ? 'text-emerald-800' : 'text-red-800'">
            Connection Status: {{ modelValue.isConnected ? 'Connected' : 'Disconnected' }}
          </h4>
          <p class="text-xs" :class="modelValue.isConnected ? 'text-emerald-600' : 'text-red-600'">
            Last Synchronized: {{ formatDate(modelValue.lastSync) }}
          </p>
        </div>
        <div class="ml-auto">
          <AppButton size="sm" :variant="modelValue.isConnected ? 'outline' : 'primary'">Test Connection</AppButton>
        </div>
      </div>

      <AppInput label="WhatsApp Business Number" v-model="modelValue.businessNumber" />
      <AppInput label="Webhook URL" v-model="modelValue.webhookUrl" />
      
      <div class="flex justify-end gap-3 pt-6 border-t mt-8">
        <AppButton variant="outline" @click="emit('reset')">Discard Changes</AppButton>
        <AppButton variant="primary" @click="emit('save')" :loading="isSaving">Save Configuration</AppButton>
      </div>
    </div>
  </div>
</template>

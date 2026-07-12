<script setup lang="ts">
import { ref } from 'vue'
import AppInput from '@/shared/components/AppInput.vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  id?: string
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  label: 'Password'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const showPassword = ref(false)
</script>

<template>
  <AppInput
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :type="showPassword ? 'text' : 'password'"
    :label="label"
    :placeholder="placeholder"
    :error="error"
    :helper-text="helperText"
    :required="required"
    :disabled="disabled"
    :id="id"
  >
    <template #iconRight>
      <button 
        type="button"
        @click="showPassword = !showPassword"
        class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary-600 transition-colors"
        tabindex="-1"
      >
        <EyeIcon v-if="!showPassword" class="h-5 w-5" />
        <EyeSlashIcon v-else class="h-5 w-5" />
      </button>
    </template>
  </AppInput>
</template>

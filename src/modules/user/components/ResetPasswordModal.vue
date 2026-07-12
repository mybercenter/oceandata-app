<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import PasswordInput from '@/shared/components/PasswordInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  isOpen: boolean
  userId: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', newPassword: string): void
}>()

const password = ref('')
const confirmPassword = ref('')
const formError = ref('')

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    password.value = ''
    confirmPassword.value = ''
    formError.value = ''
  }
})

const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let pwd = ''
  for (let i = 0; i < 12; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = pwd
  confirmPassword.value = pwd
}

const handleSubmit = () => {
  formError.value = ''
  
  if (!password.value) {
    formError.value = 'Password is required.'
    return
  }
  if (password.value.length < 8) {
    formError.value = 'Password must be at least 8 characters.'
    return
  }
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.'
    return
  }

  emit('submit', password.value)
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    title="Reset Password"
    @close="emit('close')"
  >
    <div class="space-y-6">
      
      <div v-if="formError" class="p-3 rounded-md bg-red-50 border border-red-100">
        <p class="text-sm text-red-700">{{ formError }}</p>
      </div>

      <p class="text-sm text-gray-600">Enter a new password for the user. Alternatively, you can autogenerate a secure password.</p>
      
      <div class="space-y-4">
        <div class="flex items-end gap-2">
          <div class="flex-1">
            <PasswordInput
              label="New Password"
              v-model="password"
              placeholder="Min. 8 characters"
              required
            />
          </div>
          <AppButton type="button" variant="outline" @click="generatePassword" class="mb-1" title="Generate Password">
            <ArrowPathIcon class="w-5 h-5 text-gray-600" />
          </AppButton>
        </div>
        <PasswordInput
          label="Confirm Password"
          v-model="confirmPassword"
          placeholder="Retype password"
          required
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <AppButton variant="outline" @click="emit('close')" :disabled="loading">Cancel</AppButton>
        <AppButton 
          variant="primary" 
          @click="handleSubmit"
          :loading="loading"
        >
          Reset Password
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

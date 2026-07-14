<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EnvelopeIcon } from '@heroicons/vue/24/outline'
import AuthCard from '../components/AuthCard.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AuthAlert from '../components/AuthAlert.vue'
import { authService } from '@/services/api/auth.service'

const email = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleReset = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  
  if (!email.value) {
    errorMsg.value = 'Please enter your email address.'
    return
  }

  try {
    isLoading.value = true
    await authService.forgotPassword(email.value)
    successMsg.value = 'A password reset link has been sent to your email.'
    email.value = ''
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to send reset link. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const input = document.getElementById('email')
  if (input) input.focus()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6 sm:p-12">
    <div class="w-full max-w-[460px]">
      
      <!-- Brand Logo -->
      <div class="flex items-center justify-center gap-2 mb-10">
        <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-2xl font-bold text-gray-900 tracking-tight">OceanData</span>
      </div>

      <AuthCard>
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p class="text-sm text-gray-500">Enter your email and we'll send you a password reset link.</p>
        </div>

        <AuthAlert 
          v-if="errorMsg" 
          type="error" 
          :title="errorMsg" 
          dismissible 
          @dismiss="errorMsg = ''" 
          class="mb-6"
        />
        
        <AuthAlert 
          v-if="successMsg" 
          type="success" 
          :title="successMsg" 
          dismissible 
          @dismiss="successMsg = ''" 
          class="mb-6"
        />

        <form @submit.prevent="handleReset" class="space-y-6">
          <AppInput
            id="email"
            v-model="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            :disabled="isLoading"
            required
          >
            <template #iconRight>
              <EnvelopeIcon class="h-5 w-5 text-gray-400" />
            </template>
          </AppInput>

          <AppButton
            type="submit"
            :loading="isLoading"
            block
            size="lg"
          >
            Send Reset Link
          </AppButton>

          <div class="text-center mt-4">
            <RouterLink to="/auth/login" class="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
              &larr; Back to Login
            </RouterLink>
          </div>
        </form>
      </AuthCard>
    </div>
  </div>
</template>

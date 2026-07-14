<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import AuthCard from '../components/AuthCard.vue'
import PasswordInput from '@/shared/components/PasswordInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AuthAlert from '../components/AuthAlert.vue'
import { authService } from '@/services/api/auth.service'

const router = useRouter()

const form = ref({
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const hasLength = computed(() => form.value.password.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(form.value.password))
const hasLowercase = computed(() => /[a-z]/.test(form.value.password))
const hasNumber = computed(() => /[0-9]/.test(form.value.password))
const hasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.value.password))
const passwordsMatch = computed(() => form.value.password === form.value.confirmPassword && form.value.password.length > 0)

const isFormValid = computed(() => {
  return hasLength.value && hasUppercase.value && hasLowercase.value && hasNumber.value && hasSpecial.value && passwordsMatch.value
})

const handleReset = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  
  if (!isFormValid.value) {
    errorMsg.value = 'Please ensure all password requirements are met.'
    return
  }

  try {
    isLoading.value = true
    await authService.resetPassword()
    successMsg.value = 'Your password has been successfully reset.'
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
    
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to reset password. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const input = document.getElementById('new-password')
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
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p class="text-sm text-gray-500">Please enter your new password.</p>
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
          class="mb-6"
        />

        <form @submit.prevent="handleReset" class="space-y-6" v-if="!successMsg">
          <PasswordInput
            id="new-password"
            v-model="form.password"
            label="New Password"
            placeholder="Enter new password"
            :disabled="isLoading"
            required
          />

          <!-- Password Requirements Indicator -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p class="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
            <ul class="space-y-1.5 text-xs">
              <li class="flex items-center" :class="hasLength ? 'text-green-600' : 'text-gray-500'">
                <CheckCircleIcon v-if="hasLength" class="w-4 h-4 mr-1.5" />
                <XCircleIcon v-else class="w-4 h-4 mr-1.5" />
                At least 8 characters
              </li>
              <li class="flex items-center" :class="hasUppercase ? 'text-green-600' : 'text-gray-500'">
                <CheckCircleIcon v-if="hasUppercase" class="w-4 h-4 mr-1.5" />
                <XCircleIcon v-else class="w-4 h-4 mr-1.5" />
                Uppercase letter
              </li>
              <li class="flex items-center" :class="hasLowercase ? 'text-green-600' : 'text-gray-500'">
                <CheckCircleIcon v-if="hasLowercase" class="w-4 h-4 mr-1.5" />
                <XCircleIcon v-else class="w-4 h-4 mr-1.5" />
                Lowercase letter
              </li>
              <li class="flex items-center" :class="hasNumber ? 'text-green-600' : 'text-gray-500'">
                <CheckCircleIcon v-if="hasNumber" class="w-4 h-4 mr-1.5" />
                <XCircleIcon v-else class="w-4 h-4 mr-1.5" />
                Number
              </li>
              <li class="flex items-center" :class="hasSpecial ? 'text-green-600' : 'text-gray-500'">
                <CheckCircleIcon v-if="hasSpecial" class="w-4 h-4 mr-1.5" />
                <XCircleIcon v-else class="w-4 h-4 mr-1.5" />
                Special character
              </li>
            </ul>
          </div>

          <PasswordInput
            id="confirm-password"
            v-model="form.confirmPassword"
            label="Confirm Password"
            placeholder="Confirm new password"
            :disabled="isLoading"
            required
            :error="form.confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''"
          />

          <AppButton
            type="submit"
            :loading="isLoading"
            :disabled="!isFormValid"
            block
            size="lg"
          >
            Reset Password
          </AppButton>
        </form>

        <div class="text-center mt-6">
          <RouterLink to="/auth/login" class="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
            &larr; Back to Login
          </RouterLink>
        </div>
      </AuthCard>
    </div>
  </div>
</template>

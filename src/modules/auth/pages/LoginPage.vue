<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserIcon } from '@heroicons/vue/24/outline'
import AuthLayout from '../components/AuthLayout.vue'
import AuthCard from '../components/AuthCard.vue'
import AppInput from '@/shared/components/AppInput.vue'
import PasswordInput from '@/shared/components/PasswordInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AuthAlert from '../components/AuthAlert.vue'
import { useAuth } from '@/shared/composables/useAuth'

const router = useRouter()
const { login } = useAuth()
const usernameInput = ref<InstanceType<typeof AppInput> | null>(null)

const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  
  if (!form.value.username || !form.value.password) {
    errorMsg.value = 'Please enter both username and password.'
    return
  }

  try {
    isLoading.value = true
    await login({
      username: form.value.username,
      password: form.value.password
    })
    
    router.push('/') // Redirect to dashboard
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || err.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Focus logic would need a template ref properly bound to input element in AppInput
  // For now, we simulate basic focus by selecting element by id if possible
  const input = document.getElementById('username')
  if (input) input.focus()
})
</script>

<template>
  <AuthLayout>
    <AuthCard>
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p class="text-sm text-gray-500">Sign in to continue to OceanData.</p>
      </div>

      <AuthAlert 
        v-if="errorMsg" 
        type="error" 
        :title="errorMsg" 
        dismissible 
        @dismiss="errorMsg = ''" 
        class="mb-6"
      />

      <form @submit.prevent="handleLogin" class="space-y-5">
        <AppInput
          id="username"
          v-model="form.username"
          label="Username"
          placeholder="Enter your username"
          :disabled="isLoading"
          required
        >
          <template #iconRight>
            <UserIcon class="h-5 w-5 text-gray-400" />
          </template>
        </AppInput>

        <PasswordInput
          id="password"
          v-model="form.password"
          placeholder="Enter your password"
          :disabled="isLoading"
          required
        />

        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700 select-none">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <RouterLink to="/auth/forgot-password" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Forgot your password?
            </RouterLink>
          </div>
        </div>

        <div class="pt-2">
          <AppButton
            type="submit"
            :loading="isLoading"
            block
            size="lg"
          >
            Sign in
          </AppButton>
        </div>
      </form>
    </AuthCard>
  </AuthLayout>
</template>

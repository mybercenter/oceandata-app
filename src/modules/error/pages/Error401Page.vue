<script setup lang="ts">
import ErrorLayout from '../components/ErrorLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <ErrorLayout>
    <div class="max-w-md w-full">
      <div class="text-primary-600 mb-8 flex justify-center">
        <!-- Abstract Illustration for 401 -->
        <svg class="w-64 h-64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="1" />
          <path d="M7 11V7a5 5 0 0110 0v4" stroke-width="1" stroke-linecap="round" />
        </svg>
      </div>
      <h1 class="text-8xl font-black text-gray-900 tracking-tighter mb-4">401</h1>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Unauthorized Access</h2>
      <p class="text-gray-500 mb-8">Please log in with appropriate credentials to view this page.</p>
      
      <div class="flex justify-center">
        <AppButton @click="router.push('/auth/login')" size="lg" block>
          Go to Login
        </AppButton>
      </div>
    </div>
  </ErrorLayout>
</template>

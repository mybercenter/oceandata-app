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
        <!-- Abstract Illustration for 404 -->
        <svg class="w-64 h-64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
          <circle cx="12" cy="12" r="10" stroke-width="0.5" />
          <path d="M12 8v4l3 3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="text-8xl font-black text-gray-900 tracking-tighter mb-4">404</h1>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p class="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <AppButton @click="router.push('/')" size="lg">
          Back to Dashboard
        </AppButton>
        <AppButton variant="secondary" @click="router.push('/auth/login')" size="lg">
          Back to Login
        </AppButton>
      </div>
    </div>
  </ErrorLayout>
</template>

<script setup lang="ts">
import ErrorLayout from '../components/ErrorLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleReload = () => window.location.reload()
</script>

<template>
  <ErrorLayout>
    <div class="max-w-md w-full">
      <div class="text-primary-600 mb-8 flex justify-center">
        <!-- Abstract Illustration for 500 -->
        <svg class="w-64 h-64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="text-8xl font-black text-gray-900 tracking-tighter mb-4">500</h1>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Internal Server Error</h2>
      <p class="text-gray-500 mb-8">Oops! Something went wrong on our end. Please try again later or contact support if the issue persists.</p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <AppButton @click="router.push('/')" size="lg">
          Back to Dashboard
        </AppButton>
        <AppButton variant="secondary" @click="handleReload" size="lg">
          Refresh Page
        </AppButton>
      </div>
    </div>
  </ErrorLayout>
</template>

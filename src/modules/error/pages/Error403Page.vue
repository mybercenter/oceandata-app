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
        <!-- Abstract Illustration for 403 -->
        <svg class="w-64 h-64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 8v4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" />
        </svg>
      </div>
      <h1 class="text-8xl font-black text-gray-900 tracking-tighter mb-4">403</h1>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Access Forbidden</h2>
      <p class="text-gray-500 mb-8">You don't have permission to access this resource. Please contact your administrator if you believe this is a mistake.</p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <AppButton @click="router.push('/')" size="lg">
          Back to Dashboard
        </AppButton>
      </div>
    </div>
  </ErrorLayout>
</template>

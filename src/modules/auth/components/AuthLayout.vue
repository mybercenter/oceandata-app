<script setup lang="ts">
// AuthLayout component
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Section (Branding & Illustration) -->
    <div class="hidden lg:flex lg:w-[45%] bg-primary-50 relative overflow-hidden flex-col justify-between p-12">
      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-8">
          <!-- Logo Placeholder -->
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-2xl font-bold text-gray-900 tracking-tight">OceanData</span>
        </div>
        
        <h1 class="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
          CRM & Customer <br/>
          Follow-up Management <br/>
          System
        </h1>
        
        <p class="text-lg text-gray-600 max-w-md">
          Manage customer interactions, monitor follow-ups, and improve sales performance in one centralized platform.
        </p>
      </div>

      <!-- Abstract Illustration -->
      <div class="absolute bottom-0 right-0 w-full h-full pointer-events-none opacity-50 select-none">
        <svg class="absolute -bottom-20 -right-20 w-[600px] h-[600px] text-primary-200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M47.7,-57.2C59.4,-47.3,64.8,-29.4,67.6,-11.2C70.4,7,70.5,25.4,61.9,39.6C53.3,53.8,36.1,63.7,18.1,68.4C0.2,73,-18.3,72.4,-34,65.2C-49.7,58.1,-62.5,44.4,-70.4,27.7C-78.2,11,-81.1,-8.6,-74.6,-24.1C-68,-39.6,-51.9,-51,-36.4,-60.2C-20.9,-69.3,-5.9,-76.1,6.8,-74.1C19.5,-72.1,36,-67.2,47.7,-57.2Z" transform="translate(100 100)" />
        </svg>
        <svg class="absolute top-20 right-10 w-[300px] h-[300px] text-primary-300 opacity-60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M41.7,-60.5C53.5,-51.3,62.1,-37.9,67.5,-23C72.9,-8.1,75.1,8.3,70.6,23.3C66.1,38.3,54.9,52,40.9,60C26.9,68,10.2,70.3,-5.6,73.5C-21.4,76.8,-36.3,81,-48.5,74.5C-60.7,68,-70.1,50.8,-74.4,32.7C-78.7,14.6,-77.9,-4.5,-71.4,-20.5C-64.8,-36.6,-52.5,-49.6,-38.8,-58.2C-25.1,-66.8,-10,-71.1,3,-74.9C16,-78.7,30,-69.8,41.7,-60.5Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div class="relative z-10 text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} OceanData. All rights reserved.
      </div>
    </div>

    <!-- Right Section (Form) -->
    <div class="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-[460px]">
        <!-- Mobile Logo -->
        <div class="flex lg:hidden items-center justify-center gap-2 mb-10">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-2xl font-bold text-gray-900 tracking-tight">OceanData</span>
        </div>
        
        <slot />
      </div>
    </div>
  </div>
</template>

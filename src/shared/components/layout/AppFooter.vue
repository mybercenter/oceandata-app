<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto py-6 px-4 md:px-6 2xl:px-8 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-gray-500 text-center sm:text-left">
        &copy; {{ currentYear }} <span class="font-semibold text-gray-900">OceanData</span>. All rights reserved.
      </p>
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <a href="#" class="hover:text-primary-600 transition-colors">Support</a>
        <a href="#" class="hover:text-primary-600 transition-colors">Privacy</a>
        <a href="#" class="hover:text-primary-600 transition-colors">Terms</a>
        <span class="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium">v1.0.0</span>
      </div>
    </div>
  </footer>
</template>

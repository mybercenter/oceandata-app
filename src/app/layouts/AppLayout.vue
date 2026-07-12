<script setup lang="ts">
import AppSidebar from '@/shared/components/layout/AppSidebar.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import AppFooter from '@/shared/components/layout/AppFooter.vue'
import AppToast from '@/shared/components/ui/AppToast.vue'
import AppConfirmDialog from '@/shared/components/ui/AppConfirmDialog.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50/50">
    <AppToast />
    <AppConfirmDialog />
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- Header -->
      <AppHeader />

      <!-- Page Content -->
      <main class="flex-1 flex flex-col">
        <router-view />
      </main>

      <!-- Footer -->
      <AppFooter />
    </div>
  </div>
</template>

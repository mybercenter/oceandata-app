<script setup lang="ts">
import AppPageHeader from './AppPageHeader.vue'
import AppContent from './AppContent.vue'

interface Props {
  title?: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="h-full flex flex-col w-full max-w-screen-2xl mx-auto p-4 md:p-6 2xl:p-10">
    <AppPageHeader v-if="title" :title="title" :subtitle="subtitle">
      <template #actions v-if="$slots.actions">
        <slot name="actions" />
      </template>
    </AppPageHeader>
    
    <AppContent>
      <template #top v-if="$slots.top">
        <slot name="top" />
      </template>
      <slot />
    </AppContent>
  </div>
</template>

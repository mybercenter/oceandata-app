<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  noPadding?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
    <div v-if="title || $slots.header" class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <slot name="headerAction" />
    </div>
    
    <div :class="[noPadding ? '' : 'p-6']">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
      <slot name="footer" />
    </div>
  </div>
</template>

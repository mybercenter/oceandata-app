<script setup lang="ts">
defineProps<{
  length: number
  max?: number
}>()
</script>
<template>
  <div class="flex justify-end mt-1">
    <span class="text-xs" :class="max && length > max ? 'text-red-500 font-medium' : 'text-gray-400'">
      {{ length }}{{ max ? ' / ' + max : '' }} characters
    </span>
  </div>
</template>

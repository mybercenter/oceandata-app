<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  tabs: string[]
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
}>()

const selectTab = (index: number) => {
  emit('update:modelValue', index)
}
</script>

<template>
  <div>
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-6" aria-label="Tabs">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="selectTab(index)"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
          :class="[
            modelValue === index
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab }}
        </button>
      </nav>
    </div>
    <div class="py-4">
      <slot></slot>
    </div>
  </div>
</template>

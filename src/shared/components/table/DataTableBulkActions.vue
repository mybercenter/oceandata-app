<script setup lang="ts">
import AppButton from '@/shared/components/AppButton.vue'
import { TrashIcon, DocumentArrowDownIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  selectedCount: number
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'export'): void
  (e: 'clear'): void
}>()
</script>

<template>
  <Transition name="slide-down">
    <div v-if="selectedCount > 0" class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-blue-50 border-b border-blue-100 shadow-sm">
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
          {{ selectedCount }}
        </span>
        <span class="text-sm font-semibold text-blue-900">
          item{{ selectedCount > 1 ? 's' : '' }} selected
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <AppButton 
          variant="outline" 
          size="sm"
          @click="emit('clear')"
          class="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hidden sm:flex"
        >
          <XMarkIcon class="w-4 h-4 mr-1.5" />
          Clear
        </AppButton>
        <AppButton 
          variant="outline" 
          size="sm"
          @click="emit('export')"
          class="bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
        >
          <DocumentArrowDownIcon class="w-4 h-4 mr-1.5" />
          Export
        </AppButton>
        <AppButton 
          variant="danger" 
          size="sm"
          @click="emit('delete')"
        >
          <TrashIcon class="w-4 h-4 mr-1.5" />
          Delete
        </AppButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>

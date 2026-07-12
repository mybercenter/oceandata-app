<script setup lang="ts">
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'

const props = defineProps<{
  isOpen: boolean
  title: string
  data: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="title"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="data" class="space-y-4">
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <pre class="text-xs text-gray-700 whitespace-pre-wrap font-mono">{{ JSON.stringify(data, null, 2) }}</pre>
      </div>
      <p class="text-xs text-gray-500 text-center italic">This is a mock detail view. In production, this modal will render specific detailed metrics for this row.</p>
    </div>
    
    <template #footer>
      <div class="flex justify-end w-full">
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
      </div>
    </template>
  </AppModal>
</template>

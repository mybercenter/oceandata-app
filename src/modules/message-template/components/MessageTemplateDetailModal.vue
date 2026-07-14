<script setup lang="ts">
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import type { MessageTemplate } from '../types/message-template.types'
import WhatsappPreview from './WhatsappPreview.vue'
import { computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
  template: MessageTemplate | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', template: MessageTemplate): void
}>()

const previewMessages = computed(() => {
  if (!props.template) return []
  const msgs = []
  if (props.template.template_1) msgs.push(props.template.template_1)
  if (props.template.template_2) msgs.push(props.template.template_2)
  if (props.template.template_3) msgs.push(props.template.template_3)
  return msgs
})

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    title="Message Template Details"
    size="xl"
    @close="emit('close')"
  >
    <div v-if="template" class="space-y-6">
      
      <!-- General Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">General Information</h3>
        <dl class="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Operational Area</dt>
            <dd class="text-sm text-gray-900 col-span-2 font-semibold">{{ template.area?.name || '-' }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Dedicate</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ template.dedicate }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="text-sm text-gray-900 col-span-2">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                template?.is_active 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              ]">
                {{ template?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <!-- Preview -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Messages Preview</h3>
        <WhatsappPreview :messages="previewMessages" />
      </div>

      <hr class="border-gray-100" />

      <!-- Metadata -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">System Info</h3>
        <dl class="space-y-3">
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Created</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(template.created_at) }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <dt class="text-sm font-medium text-gray-500">Updated</dt>
            <dd class="text-sm text-gray-900 col-span-2">{{ formatDate(template.updated_at) }}</dd>
          </div>
        </dl>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
        <AppButton v-if="template" variant="primary" @click="emit('edit', template)">
          <PencilSquareIcon class="w-4 h-4 mr-2" />
          Edit Template
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>


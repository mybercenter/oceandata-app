<script setup lang="ts">
import { ref, computed } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import WhatsappPreview from '../../message-template/components/WhatsappPreview.vue'
import EvidenceUploader from './EvidenceUploader.vue'
import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { customerFollowUpService } from '../services/customer-follow-up.service'
import { useToast } from '@/shared/composables/useToast'

const props = defineProps<{
  isOpen: boolean
  followUp: CustomerFollowUp | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
  (e: 'refresh'): void
}>()

const toast = useToast()

const isEditingEvidence = ref(false)
const newEvidenceFile = ref<File | null>(null)
const isSavingEvidence = ref(false)

// Local evidence URL override after upload (to show instantly without full refresh)
const localEvidenceUrl = ref<string | null>(null)

// Computed evidence URL: prefer local override, fallback to prop
const evidenceUrl = computed(() => localEvidenceUrl.value || props.followUp?.evidence || null)

const saveEvidence = async () => {
  if (!newEvidenceFile.value || !props.followUp) return
  isSavingEvidence.value = true
  try {
    const updatedFollowUp = await customerFollowUpService.updateFollowUp(props.followUp.id, {
      evidence: newEvidenceFile.value as any
    })
    
    // Update local evidence URL for instant display
    localEvidenceUrl.value = updatedFollowUp.evidence || null
    
    // Also mutate parent object so reopening detail still shows the image
    if (props.followUp) {
      props.followUp.evidence = updatedFollowUp.evidence
    }
    
    toast.success('Evidence Updated', 'Evidence photo has been successfully uploaded.')
    emit('updated')
    emit('refresh')
    isEditingEvidence.value = false
    newEvidenceFile.value = null
  } catch (error: any) {
    toast.error('Upload Failed', error.message || 'Failed to upload evidence.')
  } finally {
    isSavingEvidence.value = false
  }
}

const formatDateTime = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Image lightbox state
const isImageModalOpen = ref(false)

const openImageModal = () => {
  if (evidenceUrl.value) isImageModalOpen.value = true
}

const handleClose = () => {
  // Reset local state on close
  localEvidenceUrl.value = null
  isEditingEvidence.value = false
  newEvidenceFile.value = null
  emit('close')
}

</script>

<template>
  <AppModal
    :is-open="isOpen"
    title="Follow Up Record Details"
    size="xl"
    @close="handleClose"
  >
    <div v-if="followUp" class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 justify-between md:items-center">
        <div>
          <h2 class="text-lg font-bold text-gray-900">Follow Up: {{ followUp.customer?.full_name }}</h2>
          <p class="text-sm text-gray-500">{{ formatDateTime(followUp.followUpDate) }}</p>
        </div>
        <div class="flex items-center gap-2">
        </div>
      </div>

      <!-- Main Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Activity Information</h3>
          <dl class="space-y-3">
            <div>
              <dt class="text-xs font-medium text-gray-500">Dedicate</dt>
              <dd class="text-sm text-gray-900 font-bold">{{ followUp.dedicate }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500">Template Used</dt>
              <dd class="text-sm text-gray-900">{{ followUp.templateUsed }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500">Performed By</dt>
              <dd class="text-sm text-gray-900">{{ followUp.customer?.employee?.full_name || '-' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500">Store & Area</dt>
              <dd class="text-sm text-gray-900">{{ followUp.customer?.employee?.store?.name || '-' }} ({{ followUp.customer?.employee?.areas?.[0]?.name || '-' }})</dd>
            </div>
          </dl>

          <div class="mt-6">
            <div class="flex justify-between items-center mb-3 border-b pb-1">
              <h3 class="text-sm font-semibold text-gray-900">Evidence</h3>
              <button 
                v-if="evidenceUrl && !isEditingEvidence" 
                @click="isEditingEvidence = true" 
                class="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Change Evidence
              </button>
            </div>
            
            <div 
              v-if="evidenceUrl && !isEditingEvidence" 
              class="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
              @click="openImageModal"
              title="Click to enlarge"
            >
              <img :src="evidenceUrl" alt="Evidence" class="w-full h-full object-cover" />
            </div>
            
            <div v-else class="space-y-3">
              <EvidenceUploader v-model="newEvidenceFile" />
              <div class="flex justify-end gap-2">
                <AppButton v-if="evidenceUrl" size="sm" variant="outline" @click="isEditingEvidence = false" :disabled="isSavingEvidence">Cancel</AppButton>
                <AppButton size="sm" variant="primary" :disabled="!newEvidenceFile" :loading="isSavingEvidence" @click="saveEvidence">
                  {{ evidenceUrl ? 'Update Evidence' : 'Upload Evidence' }}
                </AppButton>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Notes</h3>
            <p class="text-sm text-gray-800 bg-yellow-50 p-3 rounded-lg border border-yellow-100">{{ followUp.notes || 'No notes provided.' }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">WhatsApp Message Sent</h3>
          <div class="bg-gray-100 p-4 rounded-lg flex justify-center">
            <div class="w-full max-w-sm h-[400px]">
              <WhatsappPreview :messages="[followUp.whatsappMessage]" />
            </div>
          </div>
        </div>

      </div>
    </div>

    <template #footer>
      <div class="flex justify-end w-full">
        <AppButton variant="outline" @click="handleClose">Close</AppButton>
      </div>
    </template>
  </AppModal>

  <!-- Image Lightbox Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isImageModalOpen"
        class="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
        @click.self="isImageModalOpen = false"
      >
        <div class="relative max-w-4xl max-h-[90vh] w-full">
          <button
            @click="isImageModalOpen = false"
            class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors text-sm font-medium"
          >
            ✕ Close
          </button>
          <img 
            :src="evidenceUrl!" 
            alt="Evidence Full" 
            class="w-full h-full object-contain rounded-lg max-h-[85vh]"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

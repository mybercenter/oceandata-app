<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppStatusBadge from '@/shared/components/AppStatusBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import WhatsappPreview from '../../message-template/components/WhatsappPreview.vue'
import EvidenceUploader from './EvidenceUploader.vue'
import type { CustomerFollowUp } from '../types/customer-follow-up.types'
import { customerFollowUpService } from '../services/customer-follow-up.service'

const props = defineProps<{
  isOpen: boolean
  followUp: CustomerFollowUp | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const isEditingEvidence = ref(false)
const newEvidenceFile = ref<File | null>(null)
const isSavingEvidence = ref(false)

const saveEvidence = async () => {
  if (!newEvidenceFile.value || !props.followUp) return
  isSavingEvidence.value = true
  try {
    const mockUrl = URL.createObjectURL(newEvidenceFile.value)
    await customerFollowUpService.updateFollowUp(props.followUp.id, {
      evidence: mockUrl
    })
    
    // Mutate locally for instant feedback
    props.followUp.evidence = mockUrl
    
    emit('updated')
    isEditingEvidence.value = false
    newEvidenceFile.value = null
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

const formatConversionColor = (conversion: string) => {
  switch (conversion) {
    case 'Hot Prospect': return 'text-red-700 bg-red-100 border-red-200'
    case 'Prospect': return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'Potential': return 'text-amber-700 bg-amber-100 border-amber-200'
    default: return 'text-gray-700 bg-gray-100 border-gray-200'
  }
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    title="Follow Up Record Details"
    size="xl"
    @close="emit('close')"
  >
    <div v-if="followUp" class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 justify-between md:items-center">
        <div>
          <h2 class="text-lg font-bold text-gray-900">Follow Up: {{ followUp.customer?.fullName }}</h2>
          <p class="text-sm text-gray-500">{{ formatDateTime(followUp.followUpDate) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <AppStatusBadge :status="followUp.customerStatus === 'Inquiry' ? 'active' : 'purchased'" :label="followUp.customerStatus" />
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="formatConversionColor(followUp.conversion)">
            {{ followUp.conversion }}
          </span>
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
              <dd class="text-sm text-gray-900">{{ followUp.employee?.fullName || '-' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500">Store & Area</dt>
              <dd class="text-sm text-gray-900">{{ followUp.employee?.store?.name || '-' }} ({{ followUp.employee?.areas?.[0]?.name || '-' }})</dd>
            </div>
          </dl>

          <div class="mt-6">
            <div class="flex justify-between items-center mb-3 border-b pb-1">
              <h3 class="text-sm font-semibold text-gray-900">Evidence</h3>
              <button 
                v-if="followUp.evidence && !isEditingEvidence" 
                @click="isEditingEvidence = true" 
                class="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Change Evidence
              </button>
            </div>
            
            <div v-if="followUp.evidence && !isEditingEvidence" class="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
              <img :src="followUp.evidence.startsWith('blob:') ? followUp.evidence : 'https://via.placeholder.com/400x300.png?text=Evidence+Mock'" alt="Evidence" class="w-full h-full object-cover" />
            </div>
            
            <div v-else class="space-y-3">
              <EvidenceUploader v-model="newEvidenceFile" />
              <div class="flex justify-end gap-2">
                <AppButton v-if="followUp.evidence" size="sm" variant="outline" @click="isEditingEvidence = false" :disabled="isSavingEvidence">Cancel</AppButton>
                <AppButton size="sm" variant="primary" :disabled="!newEvidenceFile" :loading="isSavingEvidence" @click="saveEvidence">
                  {{ followUp.evidence ? 'Update Evidence' : 'Upload Evidence' }}
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
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
      </div>
    </template>
  </AppModal>
</template>

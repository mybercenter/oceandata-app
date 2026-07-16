<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import AppAsyncSelect from '@/shared/components/AppAsyncSelect.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppTextarea from '@/shared/components/AppTextarea.vue'
import AppButton from '@/shared/components/AppButton.vue'
import TemplateSelector from './TemplateSelector.vue'
import EvidenceUploader from './EvidenceUploader.vue'
import WhatsappPreview from '../../message-template/components/WhatsappPreview.vue'
import CharacterCounter from '../../message-template/components/CharacterCounter.vue'
import { DocumentDuplicateIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

import { useCustomerFollowUp } from '../composables/useCustomerFollowUp'
import type { Customer } from '../../customer/types/customer.types'
import { customerService } from '../../customer/services/customer.service'

const props = defineProps<{
  isOpen: boolean
  customer: Customer | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const {
  templates,
  isSubmitting,
  isOpeningWhatsapp,
  fetchTemplates,
  createFollowUp,
  openWhatsapp
} = useCustomerFollowUp()

// Steps Management
const currentStep = ref(1)

// Form Data
const selectedCustomerId = ref<string | number>('')
const resolvedCustomer = ref<Customer | null>(null)
const dedicate = ref<'AV' | 'HA' | ''>('')
const selectedTemplate = ref('')
const originalMessage = ref('')
const editedMessage = ref('')
const followUpDate = ref(new Date().toISOString().split('T')[0])
const notes = ref('')
const formError = ref('')
// Watch for Modal Open
watch(() => props.isOpen, async (val) => {
  if (val) {
    currentStep.value = 1
    dedicate.value = ''
    selectedTemplate.value = ''
    editedMessage.value = ''
    originalMessage.value = ''
    followUpDate.value = new Date().toISOString().split('T')[0]
    notes.value = ''
    formError.value = ''
    
    if (props.customer) {
      resolvedCustomer.value = props.customer
      selectedCustomerId.value = props.customer.id
    } else {
      resolvedCustomer.value = null
      selectedCustomerId.value = ''
    }
  }
})

const getAreaId = (customer: any) => {
  if (!customer) return null
  const emp = customer.employee
  if (!emp) return null
  return emp.store?.area_id || emp.areas?.[0]?.id || emp.area_id
}

// Watch customer selection change
watch(selectedCustomerId, async (val) => {
  if (val && !props.customer) {
    try {
      const customerDetails = await customerService.show(val)
      if (customerDetails) {
        resolvedCustomer.value = customerDetails
        
        // Auto trigger templates if dedicate is already selected
        const areaId = getAreaId(customerDetails)
        if (dedicate.value && areaId) {
          fetchTemplates(areaId, dedicate.value as 'AV'|'HA')
        }
      }
    } catch (e) {
      console.error('Failed to fetch customer details:', e)
    }
  }
})

// Step 1: Dedicate Selection loads templates
watch(dedicate, async (val) => {
  const areaId = getAreaId(resolvedCustomer.value)
  if (val && areaId) {
    await fetchTemplates(areaId, val as 'AV'|'HA')
    selectedTemplate.value = ''
    editedMessage.value = ''
  }
})

const processPlaceholders = (text: string) => {
  if (!resolvedCustomer.value) return text
  let res = text
  res = res.replace(/{{customer_name}}/g, resolvedCustomer.value.full_name || '')
  res = res.replace(/{{employee_name}}/g, resolvedCustomer.value.employee?.full_name || '')
  res = res.replace(/{{store_name}}/g, (resolvedCustomer.value.employee as any)?.store?.name || '')
  res = res.replace(/{{area_name}}/g, (resolvedCustomer.value.employee as any)?.areas?.[0]?.name || '')
  res = res.replace(/{{product}}/g, resolvedCustomer.value.product || '')
  return res
}

const handleTemplateSelect = (text: string) => {
  const processed = processPlaceholders(text)
  originalMessage.value = processed
  editedMessage.value = processed
}

const handleResetMessage = () => {
  editedMessage.value = originalMessage.value
}

const handleCopy = () => {
  navigator.clipboard.writeText(editedMessage.value)
}

const nextStep = () => {
  formError.value = ''
  if (currentStep.value === 1) {
    if (!resolvedCustomer.value) {
      formError.value = 'Please select a Customer first.'
      return
    }
    if (!dedicate.value) {
      formError.value = 'Please select a Dedicate category.'
      return
    }
  }
  if (currentStep.value === 2 && !selectedTemplate.value) {
    formError.value = 'Please select a template or choose Free Text.'
    return
  }
  if (currentStep.value === 3 && !editedMessage.value) {
    formError.value = 'Message cannot be empty.'
    return
  }
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
  formError.value = ''
}

const handleOpenWhatsapp = async () => {
  const phone = resolvedCustomer.value?.phone || ''
  await openWhatsapp(phone, editedMessage.value)
  nextStep()
}

const handleSave = async () => {
  formError.value = ''
  if (!followUpDate.value) {
    formError.value = 'Follow Up Date is required.'
    return
  }
  if (!resolvedCustomer.value) return

  const success = await createFollowUp({
    customerId: resolvedCustomer.value.id,
    dedicate: dedicate.value,
    templateUsed: selectedTemplate.value,
    whatsappMessage: editedMessage.value,
    followUpDate: followUpDate.value,
    notes: notes.value,
    conversion: resolvedCustomer.value.current_conversion,
    customerStatus: resolvedCustomer.value.customer_status
  })

  if (success) {
    emit('success')
    emit('close')
  }
}
</script>

<template>
  <AppModal
    :is-open="isOpen"
    title="Customer Follow Up Workflow"
    size="full"
    @close="emit('close')"
  >
    <div class="flex flex-col h-full min-h-[500px]">
      
      <!-- Stepper Header -->
      <div class="mb-6 px-4">
        <div class="flex items-center justify-between relative">
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary-500 z-0 transition-all duration-300" :style="{ width: ((currentStep - 1) / 4) * 100 + '%' }"></div>
          
          <div v-for="i in 5" :key="i" class="relative z-10 flex flex-col items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow transition-colors duration-300" 
                 :class="currentStep >= i ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'">
              {{ i }}
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span>Target</span>
          <span>Template</span>
          <span>Message</span>
          <span>Send</span>
          <span>Result</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="formError" class="mb-4 p-3 rounded-md bg-red-50 border border-red-100 mx-4">
        <p class="text-sm text-red-700">{{ formError }}</p>
      </div>

      <!-- Step Content Area -->
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        
        <!-- STEP 1: Target & Dedicate -->
        <div v-show="currentStep === 1" class="max-w-xl mx-auto space-y-6 pt-2">
          <div v-if="!customer" class="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">1. Select Target Customer</h3>
            <AppAsyncSelect 
              label="Customer" 
              v-model="selectedCustomerId" 
              endpoint="/customers"
              placeholder="Search Customer..."
              :map-option="(c: any) => ({ label: c.full_name + ' - ' + c.phone, value: c.id })"
            />
          </div>
          <div v-else class="mb-6 bg-primary-50 p-4 rounded-xl border border-primary-200 text-center">
            <h3 class="text-xs font-bold text-primary-800 uppercase tracking-wider mb-1">Target Customer</h3>
            <p class="text-lg font-bold text-primary-900">{{ customer.full_name }}</p>
            <p class="text-sm text-primary-700">{{ customer.phone }}</p>
          </div>

          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900">2. Select Dedicate Category</h2>
            <p class="text-gray-500 text-sm">Which product category are you following up on?</p>
            <div class="flex justify-center gap-4 mt-6">
              <button class="w-32 py-4 rounded-xl border-2 transition-colors" :class="dedicate === 'AV' ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 hover:border-primary-300'" @click="dedicate = 'AV'">Audio Video (AV)</button>
              <button class="w-32 py-4 rounded-xl border-2 transition-colors" :class="dedicate === 'HA' ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 hover:border-primary-300'" @click="dedicate = 'HA'">Home App (HA)</button>
            </div>
          </div>
        </div>

        <!-- STEP 2: Template -->
        <div v-show="currentStep === 2" class="max-w-4xl mx-auto space-y-6">
          <h2 class="text-xl font-bold text-gray-900">Choose a Template</h2>
          <p class="text-gray-500 text-sm">Select one of the standard templates or write a custom message.</p>
          <div v-if="templates.length > 0">
            <TemplateSelector 
              :template-data="templates[0]" 
              v-model="selectedTemplate" 
              @select="handleTemplateSelect" 
            />
          </div>
          <div v-else class="p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200">
            No templates found for this Area and Dedicate. Only "Free Text" is available.
            <div class="mt-4">
              <TemplateSelector 
                :template-data="null" 
                v-model="selectedTemplate" 
                @select="handleTemplateSelect" 
              />
            </div>
          </div>
        </div>

        <!-- STEP 3: Message Editor -->
        <div v-show="currentStep === 3" class="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
          <div class="flex-1 space-y-4">
            <h2 class="text-xl font-bold text-gray-900">Review & Edit Message</h2>
            <p class="text-gray-500 text-sm">Variables have been automatically replaced. You can edit the text below before sending.</p>
            
            <AppTextarea
              label="WhatsApp Message"
              v-model="editedMessage"
              :rows="12"
            />
            <div class="flex justify-between items-center mt-1">
              <div class="flex gap-2">
                <button type="button" @click="handleCopy" class="text-xs flex items-center text-gray-600 hover:text-primary-600">
                  <DocumentDuplicateIcon class="w-3 h-3 mr-1" /> Copy
                </button>
                <button type="button" @click="handleResetMessage" class="text-xs flex items-center text-gray-600 hover:text-primary-600">
                  <ArrowPathIcon class="w-3 h-3 mr-1" /> Reset
                </button>
              </div>
              <CharacterCounter :length="editedMessage.length" />
            </div>
          </div>
          <div class="w-full md:w-80 flex-shrink-0">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Live Preview</h4>
            <div class="h-[400px]">
              <WhatsappPreview :messages="[editedMessage]" />
            </div>
          </div>
        </div>

        <!-- STEP 4: Send -->
        <div v-show="currentStep === 4" class="max-w-xl mx-auto space-y-6 pt-10 text-center">
          <h2 class="text-2xl font-bold text-gray-900">Ready to Send?</h2>
          <p class="text-gray-500 text-sm">The message is ready. Click the button below to open WhatsApp Web or Desktop.</p>
          <div class="mt-8">
            <AppButton 
              variant="primary" 
              class="w-full h-14 text-lg !bg-[#25D366] !border-[#25D366] hover:!bg-[#1DA851]" 
              @click="handleOpenWhatsapp"
              :loading="isOpeningWhatsapp"
            >
              Open WhatsApp
            </AppButton>
          </div>
          <p class="text-xs text-gray-400 mt-4">After sending the message, click Next to record the result.</p>
        </div>

        <!-- STEP 5: Result -->
        <div v-show="currentStep === 5" class="max-w-3xl mx-auto space-y-6">
          <h2 class="text-xl font-bold text-gray-900 border-b pb-2">Record Follow Up Result</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <AppInput type="date" label="Follow Up Date" v-model="followUpDate" required />
          </div>
          
          <EvidenceUploader />
          
          <AppTextarea
            label="Internal Notes (Optional)"
            v-model="notes"
            :rows="3"
            placeholder="E.g. Customer is interested but wants to discuss with family first."
          />
        </div>

      </div>
    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <AppButton variant="outline" @click="emit('close')" :disabled="isSubmitting">Cancel</AppButton>
        <div class="flex gap-2">
          <AppButton v-if="currentStep > 1" variant="outline" @click="prevStep" :disabled="isSubmitting">Back</AppButton>
          <AppButton v-if="currentStep < 5 && currentStep !== 4" variant="primary" @click="nextStep">Next</AppButton>
          <AppButton v-if="currentStep === 4" variant="outline" @click="nextStep">Skip WhatsApp</AppButton>
          <AppButton v-if="currentStep === 5" variant="primary" @click="handleSave" :loading="isSubmitting">Save Result</AppButton>
        </div>
      </div>
    </template>
  </AppModal>
</template>

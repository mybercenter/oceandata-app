<script setup lang="ts">
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import AppButton from '@/shared/components/AppButton.vue'
import { ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

const { isOpen, options, isLoading, close, handleConfirm } = useConfirmDialog()

const getIcon = (type?: string) => {
  switch (type) {
    case 'danger': return ExclamationTriangleIcon
    case 'warning': return ExclamationCircleIcon
    case 'info': return InformationCircleIcon
    default: return ExclamationTriangleIcon
  }
}

const getIconClass = (type?: string) => {
  switch (type) {
    case 'danger': return 'text-red-600 bg-red-100'
    case 'warning': return 'text-amber-600 bg-amber-100'
    case 'info': return 'text-blue-600 bg-blue-100'
    default: return 'text-red-600 bg-red-100'
  }
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      
      <!-- Backdrop -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" @click="!isLoading && close()"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal -->
      <div 
        class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-headline"
      >
        <div v-if="options" class="sm:flex sm:items-start">
          <div :class="['flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10', getIconClass(options.type)]">
            <component :is="getIcon(options.type)" class="w-6 h-6" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
              {{ options.title }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ options.message }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <AppButton 
            @click="handleConfirm"
            :loading="isLoading"
            :variant="options?.type === 'danger' ? 'danger' : 'primary'"
            class="w-full sm:w-auto sm:ml-3"
          >
            {{ options?.confirmText }}
          </AppButton>
          <AppButton 
            @click="close"
            :disabled="isLoading"
            variant="outline"
            class="w-full mt-3 sm:mt-0 sm:w-auto"
          >
            {{ options?.cancelText }}
          </AppButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { useToast } from '@/shared/composables/useToast'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const { toasts, removeToast } = useToast()

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircleIcon
    case 'error': return XCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'info': return InformationCircleIcon
    default: return InformationCircleIcon
  }
}

const getIconColor = (type: string) => {
  switch (type) {
    case 'success': return 'text-green-500'
    case 'error': return 'text-red-500'
    case 'warning': return 'text-amber-500'
    case 'info': return 'text-blue-500'
    default: return 'text-gray-500'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
    <TransitionGroup 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="bg-white rounded-lg shadow-lg border border-gray-100 p-4 pointer-events-auto flex items-start gap-3"
      >
        <component :is="getIcon(toast.type)" :class="['w-6 h-6 flex-shrink-0', getIconColor(toast.type)]" />
        
        <div class="flex-1 pt-0.5">
          <p class="text-sm font-semibold text-gray-900">{{ toast.title }}</p>
          <p v-if="toast.message" class="text-sm text-gray-500 mt-1">{{ toast.message }}</p>
        </div>
        
        <button 
          @click="removeToast(toast.id)"
          class="text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100 p-1 flex-shrink-0"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

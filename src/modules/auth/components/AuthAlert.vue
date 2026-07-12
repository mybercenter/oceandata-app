<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid'

interface Props {
  type: 'success' | 'error' | 'warning'
  title: string
  message?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: false
})

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

const typeClasses = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-50 text-green-800 border-green-200'
    case 'error': return 'bg-red-50 text-red-800 border-red-200'
    case 'warning': return 'bg-yellow-50 text-yellow-800 border-yellow-200'
    default: return ''
  }
})

const iconClasses = computed(() => {
  switch (props.type) {
    case 'success': return 'text-green-400'
    case 'error': return 'text-red-400'
    case 'warning': return 'text-yellow-400'
    default: return ''
  }
})
</script>

<template>
  <div :class="['rounded-lg border p-4 shadow-sm', typeClasses]">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <CheckCircleIcon v-if="type === 'success'" :class="['h-5 w-5', iconClasses]" aria-hidden="true" />
        <ExclamationCircleIcon v-else-if="type === 'error' || type === 'warning'" :class="['h-5 w-5', iconClasses]" aria-hidden="true" />
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium">{{ title }}</h3>
        <div v-if="message" class="mt-1 text-sm opacity-90">
          <p>{{ message }}</p>
        </div>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            @click="emit('dismiss')"
            :class="[
              'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50' : '',
              type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50' : '',
              type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50' : '',
            ]"
          >
            <span class="sr-only">Dismiss</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

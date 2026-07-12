<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: string[]
  options: { label: string; value: string }[]
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleOpen = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const toggleOption = (value: string) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)
  if (index === -1) {
    newValue.push(value)
  } else {
    newValue.splice(index, 1)
  }
  emit('update:modelValue', newValue)
}

const removeOption = (value: string, event: Event) => {
  event.stopPropagation()
  const newValue = props.modelValue.filter(v => v !== value)
  emit('update:modelValue', newValue)
}

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const selectedOptions = computed(() => {
  return props.options.filter(opt => props.modelValue.includes(opt.value))
})
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full" ref="dropdownRef">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div 
        @click="toggleOpen"
        class="min-h-[42px] w-full px-3 py-1.5 text-sm bg-white border rounded-lg flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-shadow"
        :class="[
          error ? 'border-red-300' : 'border-gray-300',
          disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : 'hover:border-gray-400'
        ]"
        tabindex="0"
      >
        <div class="flex flex-wrap gap-1.5 flex-1 pr-6">
          <span v-if="selectedOptions.length === 0" class="text-gray-500 py-1">{{ placeholder || 'Select options...' }}</span>
          
          <!-- Badges -->
          <span 
            v-for="opt in selectedOptions" 
            :key="opt.value"
            class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium border border-primary-100"
          >
            {{ opt.label }}
            <button 
              type="button"
              @click="(e) => removeOption(opt.value, e)"
              class="hover:bg-primary-200 hover:text-primary-900 rounded-full p-0.5 transition-colors focus:outline-none"
            >
              <XMarkIcon class="w-3 h-3" />
            </button>
          </span>
        </div>
        
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronUpDownIcon class="w-5 h-5" />
        </div>
      </div>

      <!-- Dropdown Menu -->
      <Transition name="fade">
        <div 
          v-if="isOpen" 
          class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none py-1"
        >
          <div 
            v-for="opt in options" 
            :key="opt.value"
            @click="toggleOption(opt.value)"
            class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
          >
            <div class="flex items-center h-5 mr-3">
              <input 
                type="checkbox" 
                :checked="modelValue.includes(opt.value)"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 pointer-events-none"
              />
            </div>
            <span class="text-gray-900 font-medium select-none">{{ opt.label }}</span>
          </div>
          <div v-if="options.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
            No options available
          </div>
        </div>
      </Transition>
    </div>
    
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { ChevronUpDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useDebounceFn } from '@vueuse/core'
import http from '@/shared/services/http'

export interface SelectOption {
  label: string
  value: string | number
}

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  endpoint: string
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  initialOption?: SelectOption | null
  extraParams?: Record<string, any>
  mapOption?: (item: any) => SelectOption
}>(), {
  placeholder: 'Search and select...',
  disabled: false,
  required: false,
  extraParams: () => ({}),
  mapOption: (item: any) => ({
    label: item.name || item.full_name || item.code || 'Unknown',
    value: item.id
  })
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const isOpen = ref(false)
const search = ref('')
const options = ref<SelectOption[]>([])
const isLoading = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// Include initial option if provided
if (props.initialOption) {
  options.value = [props.initialOption]
}

const toggleOpen = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    if (options.value.length === 0 || (options.value.length === 1 && props.initialOption)) {
      fetchOptions('')
    }
    setTimeout(() => {
      inputRef.value?.focus()
    }, 50)
  }
}

const close = () => {
  isOpen.value = false
  search.value = ''
}

const selectOption = (opt: SelectOption) => {
  emit('update:modelValue', opt.value)
  close()
}

const clearSelection = (e: Event) => {
  e.stopPropagation()
  emit('update:modelValue', null)
}

const fetchOptions = async (query: string) => {
  isLoading.value = true
  try {
    const res = await http.get(props.endpoint, {
      params: { search: query, per_page: 20, ...props.extraParams }
    })
    
    // Handle both paginated and non-paginated API responses
    let items = []
    if (res.data?.data?.data) {
      items = res.data.data.data
    } else if (res.data?.data) {
      items = Array.isArray(res.data.data) ? res.data.data : []
    }
    
    options.value = items.map(props.mapOption)
  } catch (error) {
    console.error('Failed to fetch options', error)
  } finally {
    isLoading.value = false
  }
}

const debouncedFetch = useDebounceFn((query: string) => {
  fetchOptions(query)
}, 300)

watch(search, (newVal) => {
  if (isOpen.value) {
    debouncedFetch(newVal)
  }
})

// Display logic
const selectedLabel = computed(() => {
  if (!props.modelValue) return ''
  const selected = options.value.find(o => o.value === props.modelValue)
  return selected ? selected.label : (props.initialOption?.label || '')
})

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
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full relative" ref="dropdownRef">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Select Trigger -->
    <div 
      @click="toggleOpen"
      class="min-h-[42px] w-full px-3 py-2 text-sm bg-white border rounded-lg flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-shadow"
      :class="[
        error ? 'border-red-300' : 'border-gray-300',
        disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : 'hover:border-gray-400'
      ]"
      tabindex="0"
    >
      <div class="flex-1 truncate pr-2">
        <span v-if="modelValue" class="text-gray-900">{{ selectedLabel }}</span>
        <span v-else class="text-gray-500">{{ placeholder }}</span>
      </div>
      
      <div class="flex items-center gap-1 text-gray-400 shrink-0">
        <button 
          v-if="modelValue && !disabled" 
          @click="clearSelection" 
          class="hover:text-gray-600 focus:outline-none p-0.5 rounded-full hover:bg-gray-100"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
        <ChevronUpDownIcon class="w-5 h-5 pointer-events-none" />
      </div>
    </div>

    <!-- Dropdown Panel -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="absolute top-full left-0 right-0 z-[100] mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden flex flex-col"
      >
        <!-- Search Input -->
        <div class="p-2 border-b border-gray-100 relative">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
            <MagnifyingGlassIcon class="w-4 h-4" />
          </div>
          <input
            ref="inputRef"
            v-model="search"
            type="text"
            class="w-full pl-9 pr-3 py-1.5 text-sm border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
            placeholder="Type to search..."
            @click.stop
          />
        </div>

        <!-- Options List -->
        <div class="max-h-60 overflow-auto py-1">
          <div v-if="isLoading" class="px-4 py-3 text-sm text-gray-500 flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
          
          <template v-else>
            <div 
              v-for="opt in options" 
              :key="opt.value"
              @click="selectOption(opt)"
              class="px-4 py-2 text-sm cursor-pointer hover:bg-primary-50 transition-colors"
              :class="modelValue === opt.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-900'"
            >
              {{ opt.label }}
            </div>
            
            <div v-if="options.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
              No results found
            </div>
          </template>
        </div>
      </div>
    </Transition>
    
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
    <span v-else-if="helperText" class="text-xs text-gray-500">{{ helperText }}</span>
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

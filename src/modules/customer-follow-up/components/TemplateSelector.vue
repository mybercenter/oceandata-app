<script setup lang="ts">
import { computed } from 'vue'
import type { MessageTemplate } from '../../message-template/types/message-template.types'

const props = defineProps<{
  templateData: MessageTemplate | null
  modelValue: string // selected template key ('Template 1', 'Free Text', dll)
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'select', text: string): void
}>()

const options = computed(() => {
  const list = []
  if (props.templateData?.template1) {
    list.push({ id: 'Template 1', title: 'Template 1 (Day 1)', text: props.templateData.template1 })
  }
  if (props.templateData?.template2) {
    list.push({ id: 'Template 2', title: 'Template 2 (Day 3)', text: props.templateData.template2 })
  }
  if (props.templateData?.template3) {
    list.push({ id: 'Template 3', title: 'Template 3 (Day 7)', text: props.templateData.template3 })
  }
  list.push({ id: 'Free Text', title: 'Free Text', text: '' })
  return list
})

const handleSelect = (opt: any) => {
  emit('update:modelValue', opt.id)
  emit('select', opt.text)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div 
      v-for="opt in options" 
      :key="opt.id"
      class="border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col"
      :class="modelValue === opt.id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 bg-white hover:border-primary-300'"
      @click="handleSelect(opt)"
    >
      <div class="flex justify-between items-center mb-2">
        <h4 class="font-bold text-sm" :class="modelValue === opt.id ? 'text-primary-700' : 'text-gray-900'">
          {{ opt.title }}
        </h4>
        <div class="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0" :class="modelValue === opt.id ? 'border-primary-500' : ''">
          <div v-if="modelValue === opt.id" class="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
        </div>
      </div>
      <p v-if="opt.text" class="text-xs text-gray-500 line-clamp-3 mb-2 flex-1">{{ opt.text }}</p>
      <p v-else class="text-xs text-gray-500 italic mb-2 flex-1">Write your own custom message.</p>
      
      <div class="text-[10px] text-gray-400 font-medium text-right mt-auto pt-2 border-t" :class="modelValue === opt.id ? 'border-primary-200' : 'border-gray-100'">
        {{ opt.text ? opt.text.length + ' chars' : '0 chars' }}
      </div>
    </div>
  </div>
</template>

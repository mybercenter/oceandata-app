<script setup lang="ts">
import { ref } from 'vue'
import { DocumentArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline'

const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const selected = target.files[0]
    file.value = selected
    previewUrl.value = URL.createObjectURL(selected)
  }
}

const handleRemove = () => {
  file.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}
</script>
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Evidence (Optional)</label>
    
    <div v-if="!previewUrl" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-400 hover:bg-primary-50 transition-colors">
      <div class="space-y-1 text-center">
        <DocumentArrowUpIcon class="mx-auto h-10 w-10 text-gray-400" />
        <div class="flex text-sm text-gray-600 justify-center">
          <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*" @change="handleFileSelect" />
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
      </div>
    </div>

    <div v-else class="relative border border-gray-200 rounded-lg p-2 bg-gray-50 flex items-center gap-4">
      <div class="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
        <img :src="previewUrl" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ file?.name }}</p>
        <p class="text-xs text-gray-500">{{ Math.round((file?.size || 0) / 1024) }} KB</p>
      </div>
      <button type="button" @click="handleRemove" class="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50">
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

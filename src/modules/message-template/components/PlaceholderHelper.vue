<script setup lang="ts">
const placeholders = [
  { tag: '{{customer_name}}', desc: 'Customer full name' },
  { tag: '{{product}}', desc: 'Purchased product name' },
  { tag: '{{store_name}}', desc: 'Store where purchased' },
  { tag: '{{employee_name}}', desc: 'Employee handling' },
  { tag: '{{area_name}}', desc: 'Operational area' }
]

const copyTag = (tag: string) => {
  navigator.clipboard.writeText(tag)
}
</script>

<template>
  <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <h4 class="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Available Placeholders</h4>
    <div class="flex flex-wrap gap-2">
      <button 
        v-for="p in placeholders" 
        :key="p.tag"
        type="button"
        @click="copyTag(p.tag)"
        class="inline-flex items-center px-2.5 py-1.5 border border-dashed border-primary-300 shadow-sm text-xs font-medium rounded text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        :title="'Click to copy: ' + p.desc"
      >
        {{ p.tag }}
      </button>
    </div>
    <p class="mt-2 text-xs text-gray-500">Click a placeholder to copy it to clipboard.</p>
  </div>
</template>

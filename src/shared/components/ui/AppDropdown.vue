<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  align?: 'left' | 'right'
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right',
  width: 'w-56'
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

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
  <div class="relative inline-block text-left" ref="dropdownRef">
    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger" :isOpen="isOpen" />
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute z-50 mt-2 origin-top-right rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 focus:outline-none"
        :class="[
          align === 'right' ? 'right-0' : 'left-0',
          width
        ]"
      >
        <div class="py-1">
          <slot :close="close" />
        </div>
      </div>
    </transition>
  </div>
</template>

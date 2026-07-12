<script setup lang="ts">
import {
  Cog6ToothIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', val: string): void
}>()

const tabs = [
  { id: 'general', name: 'General', icon: Cog6ToothIcon, desc: 'App name, timezone, logo' },
  { id: 'company', name: 'Company', icon: BuildingOfficeIcon, desc: 'Business profile & contacts' },
  { id: 'profile', name: 'Profile', icon: UserCircleIcon, desc: 'Your account & password' },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon, desc: 'Password policies' },
  { id: 'application', name: 'Application', icon: ComputerDesktopIcon, desc: 'UI preferences & notifications' },
  { id: 'whatsapp', name: 'WhatsApp API', icon: ChatBubbleBottomCenterTextIcon, desc: 'Connection & webhooks' }
]
</script>

<template>
  <nav class="space-y-1">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="emit('update:activeTab', tab.id)"
      class="w-full flex items-start text-left px-4 py-3 rounded-xl transition-all duration-200"
      :class="[
        activeTab === tab.id
          ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
          : 'text-gray-700 hover:bg-gray-50 border border-transparent'
      ]"
    >
      <component
        :is="tab.icon"
        class="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
        :class="activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'"
        aria-hidden="true"
      />
      <div>
        <div class="text-sm font-bold">{{ tab.name }}</div>
        <div class="text-xs mt-0.5" :class="activeTab === tab.id ? 'text-primary-600' : 'text-gray-500'">
          {{ tab.desc }}
        </div>
      </div>
    </button>
  </nav>
</template>

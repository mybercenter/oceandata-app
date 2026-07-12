<script setup lang="ts">
import { ref } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import SettingsSidebar from '../components/SettingsSidebar.vue'

import GeneralSettings from '../components/tabs/GeneralSettings.vue'
import CompanySettings from '../components/tabs/CompanySettings.vue'
import ProfileSettings from '../components/tabs/ProfileSettings.vue'
import SecuritySettings from '../components/tabs/SecuritySettings.vue'
import ApplicationSettings from '../components/tabs/ApplicationSettings.vue'
import WhatsappSettings from '../components/tabs/WhatsappSettings.vue'

import { useSettings } from '../composables/useSettings'

const activeTab = ref('general')
const { settings, isSaving, saveSettings, resetSettings } = useSettings()

const handleSave = () => saveSettings(activeTab.value)
const handleReset = () => resetSettings(activeTab.value as any)

const formatDate = (d: string) => new Date(d).toLocaleString()
</script>

<template>
  <AppPage 
    title="Settings & Configuration" 
    subtitle="Manage application preferences, profile settings, and system configuration."
  >
    <div class="flex flex-col lg:flex-row gap-6 pb-12">
      
      <!-- Sidebar -->
      <div class="w-full lg:w-72 flex-shrink-0">
        <SettingsSidebar v-model:active-tab="activeTab" />
        
        <!-- Audit Info below sidebar -->
        <div class="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">System Audit</h4>
          <dl class="space-y-2 text-xs">
            <div class="flex justify-between"><dt class="text-gray-500">Created By</dt><dd class="font-bold text-gray-900">{{ settings.audit.createdBy }}</dd></div>
            <div class="flex justify-between"><dt class="text-gray-500">Created At</dt><dd class="text-gray-900">{{ formatDate(settings.audit.createdAt) }}</dd></div>
            <div class="flex justify-between pt-2 border-t border-gray-200"><dt class="text-gray-500">Last Updated By</dt><dd class="font-bold text-gray-900">{{ settings.audit.updatedBy }}</dd></div>
            <div class="flex justify-between"><dt class="text-gray-500">Last Updated</dt><dd class="text-gray-900">{{ formatDate(settings.audit.updatedAt) }}</dd></div>
          </dl>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 min-w-0">
        <Transition name="fade" mode="out-in">
          <div :key="activeTab">
            <GeneralSettings v-if="activeTab === 'general'" v-model="settings.general" :is-saving="isSaving" @save="handleSave" @reset="handleReset" />
            <CompanySettings v-else-if="activeTab === 'company'" v-model="settings.company" :is-saving="isSaving" @save="handleSave" @reset="handleReset" />
            <ProfileSettings v-else-if="activeTab === 'profile'" v-model="settings.profile" :is-saving="isSaving" @save="handleSave" @reset="handleReset" />
            <SecuritySettings v-else-if="activeTab === 'security'" v-model="settings.security" :is-saving="isSaving" @save="handleSave" @reset="handleReset" />
            <ApplicationSettings v-else-if="activeTab === 'application'" v-model="settings.application" :is-saving="isSaving" @save="handleSave" @reset="handleReset" />
            <WhatsappSettings v-else-if="activeTab === 'whatsapp'" v-model="settings.whatsapp" :is-saving="isSaving" @save="handleSave" @reset="handleReset" />
          </div>
        </Transition>
      </div>

    </div>
  </AppPage>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

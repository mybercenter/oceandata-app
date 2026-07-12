<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import MessageTemplateFormModal from '../components/MessageTemplateFormModal.vue'
import MessageTemplateDetailModal from '../components/MessageTemplateDetailModal.vue'
import WhatsappPreview from '../components/WhatsappPreview.vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import { useMessageTemplate } from '../composables/useMessageTemplate'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import type { MessageTemplate } from '../types/message-template.types'
import { areaService } from '../../area/services/area.service'
import type { Area } from '../../area/types/area.types'
import { EyeIcon } from '@heroicons/vue/24/outline'

const {
  templates,
  pagination,
  filters,
  sort,
  isLoading,
  isSubmitting,
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  deleteSelected
} = useMessageTemplate()

const confirm = useConfirmDialog()

const areas = ref<Area[]>([])
onMounted(async () => {
  areas.value = await areaService.getAreas()
  fetchTemplates()
})

const areaOptions = computed(() => {
  return [
    { label: 'All Areas', value: '' },
    ...areas.value.map(a => ({ label: a.name, value: a.id }))
  ]
})

const dedicateOptions = [
  { label: 'All Dedicate', value: '' },
  { label: 'AV', value: 'AV' },
  { label: 'HA', value: 'HA' }
]

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const columns: TableColumn[] = [
  { key: 'area', label: 'Area', type: 'text', sortable: true },
  { key: 'dedicate', label: 'Dedicate', type: 'text', sortable: true },
  { key: 'preview', label: 'Template Preview', type: 'text', sortable: false },
  { key: 'status', label: 'Status', type: 'status', align: 'center' },
  { key: 'updatedAt', label: 'Updated At', type: 'date', sortable: true },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isPreviewModalOpen = ref(false)
const selectedTemplate = ref<MessageTemplate | null>(null)
const previewMessages = ref<string[]>([])

const handleSort = (key: string, order: 'asc'|'desc') => {
  sort.value = { key, order }
  fetchTemplates()
}

const handleCreateNew = () => {
  selectedTemplate.value = null
  isFormModalOpen.value = true
}

const handleView = (template: MessageTemplate) => {
  selectedTemplate.value = template
  isDetailModalOpen.value = true
}

const handleEdit = (template: MessageTemplate) => {
  selectedTemplate.value = template
  isDetailModalOpen.value = false
  isFormModalOpen.value = true
}

const handleQuickPreview = (template: MessageTemplate) => {
  const msgs = []
  if (template.template1) msgs.push(template.template1)
  if (template.template2) msgs.push(template.template2)
  if (template.template3) msgs.push(template.template3)
  previewMessages.value = msgs
  isPreviewModalOpen.value = true
}

const handleDelete = (template: MessageTemplate) => {
  confirm.confirm({
    title: 'Delete Template',
    message: 'Are you sure you want to delete the template for ' + (template.area?.name || '') + '?',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      await deleteTemplate(template.id)
      if (selectedTemplate.value?.id === template.id) {
        isDetailModalOpen.value = false
      }
    }
  })
}

const handleDeleteSelected = (ids: string[]) => {
  confirm.confirm({
    title: 'Delete Selected Templates',
    message: 'Are you sure you want to delete ' + ids.length + ' selected templates?',
    confirmText: 'Delete All',
    type: 'danger',
    onConfirm: async () => {
      await deleteSelected(ids)
    }
  })
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  if (selectedTemplate.value) {
    success = await updateTemplate(selectedTemplate.value.id, data)
  } else {
    success = await createTemplate(data)
  }

  if (success) {
    if (!createAnother) {
      isFormModalOpen.value = false
    } else {
      selectedTemplate.value = null
    }
  }
}

watch(filters, () => {
  pagination.value.page = 1
  fetchTemplates()
}, { deep: true })

const truncateText = (text?: string) => {
  if (!text) return '-'
  return text.length > 80 ? text.substring(0, 80) + '...' : text
}
</script>

<template>
  <AppPage 
    title="Message Template" 
    subtitle="Manage WhatsApp follow-up templates for every operational area and dedicate category."
  >
    <AppDataTable 
      :columns="columns"
      :data="templates"
      :loading="isLoading"
      :total="pagination.total"
      :filters="filters"
      showAdd
      showExport
      emptyTitle="No Templates Found"
      @update:filters="filters = $event"
      @update:pagination="fetchTemplates"
      @sort="handleSort"
      @refresh="fetchTemplates"
      @add="handleCreateNew"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
    >
      <template #filters>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
          <AppSelect v-model="filters.areaId" :options="areaOptions" />
          <AppSelect v-model="filters.dedicate" :options="dedicateOptions" />
          <AppSelect v-model="filters.status" :options="statusOptions" />
        </div>
      </template>

      <template #area="{ row }">
        <span class="font-medium text-gray-900">{{ row.area?.name || '-' }}</span>
      </template>

      <template #preview="{ row }">
        <div 
          class="max-w-xs truncate text-gray-600" 
          :title="row.template1 || row.template2 || row.template3"
        >
          {{ truncateText(row.template1 || row.template2 || row.template3) }}
        </div>
      </template>
      
      <!-- Custom Row Action: Preview -->
      <template #actions-prepend="{ row }">
        <button 
          @click="handleQuickPreview(row)"
          class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          <EyeIcon class="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
          Preview WhatsApp
        </button>
      </template>

    </AppDataTable>

    <!-- Modals and Modals -->
    <MessageTemplateFormModal 
      :is-open="isFormModalOpen"
      :initial-data="selectedTemplate"
      :loading="isSubmitting"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <MessageTemplateDetailModal 
      :is-open="isDetailModalOpen"
      :template="selectedTemplate"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />
    
    <!-- Quick Preview Modal -->
    <AppModal
      :is-open="isPreviewModalOpen"
      title="WhatsApp Preview"
      @close="isPreviewModalOpen = false"
    >
      <WhatsappPreview :messages="previewMessages" />
    </AppModal>
    
  </AppPage>
</template>


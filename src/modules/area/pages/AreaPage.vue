<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import AreaFormModal from '../components/AreaFormModal.vue'
import AreaDetailModal from '../components/AreaDetailModal.vue'
import { useArea } from '../composables/useArea'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import type { Area } from '../types/area.types'

const {
  areas,
  pagination,
  filters,
  sort,
  isLoading,
  isSubmitting,
  fetchAreas,
  createArea,
  updateArea,
  deleteArea,
  deleteSelected
} = useArea()

const confirm = useConfirmDialog()

// Columns Configuration
const columns: TableColumn[] = [
  { key: 'code', label: 'Area Code', type: 'text', sortable: true },
  { key: 'name', label: 'Area Name', type: 'text', sortable: true },
  { key: 'status', label: 'Status', type: 'status', align: 'center' },
  { key: 'createdAt', label: 'Created At', type: 'date', sortable: true },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

// Modal State
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedArea = ref<Area | null>(null)

onMounted(() => {
  fetchAreas()
})

// Handlers
const handleSort = (key: string, order: 'asc'|'desc') => {
  sort.value = { key, order }
  fetchAreas()
}

const handleCreateNew = () => {
  selectedArea.value = null
  isFormModalOpen.value = true
}

const handleView = (area: Area) => {
  selectedArea.value = area
  isDetailModalOpen.value = true
}

const handleEdit = (area: Area) => {
  selectedArea.value = area
  isDetailModalOpen.value = false
  isFormModalOpen.value = true
}

const handleDelete = (area: Area) => {
  confirm.confirm({
    title: 'Delete Area',
    message: `Are you sure you want to delete Area '${area.name}'? This action cannot be undone.`,
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      await deleteArea(area.id)
      if (selectedArea.value?.id === area.id) {
        isDetailModalOpen.value = false
      }
    }
  })
}

const handleDeleteSelected = (ids: string[]) => {
  confirm.confirm({
    title: 'Delete Selected Areas',
    message: `Are you sure you want to delete ${ids.length} selected areas? This action cannot be undone.`,
    confirmText: 'Delete All',
    type: 'danger',
    onConfirm: async () => {
      await deleteSelected(ids)
    }
  })
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  if (selectedArea.value) {
    success = await updateArea(selectedArea.value.id, data)
  } else {
    success = await createArea(data)
  }

  if (success) {
    if (!createAnother) {
      isFormModalOpen.value = false
    }
  }
}

// Watch filters to trigger fetch
watch(filters, () => {
  pagination.value.page = 1
  fetchAreas()
}, { deep: true })
</script>

<template>
  <AppPage 
    title="Area Management" 
    subtitle="Manage operational areas used throughout the OceanData system."
  >
    <!-- Integrated Data Table -->
    <AppDataTable 
      :columns="columns"
      :data="areas"
      :loading="isLoading"
      :total="pagination.total"
      :filters="filters"
      showAdd
      showExport
      emptyTitle="No Areas Found"
      @update:filters="filters = $event"
      @update:pagination="fetchAreas"
      @sort="handleSort"
      @refresh="fetchAreas"
      @add="handleCreateNew"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
    />

    <!-- Modals/Modals -->
    <AreaFormModal 
      :is-open="isFormModalOpen"
      :initial-data="selectedArea"
      :loading="isSubmitting"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <AreaDetailModal 
      :is-open="isDetailModalOpen"
      :area="selectedArea"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />
  </AppPage>
</template>


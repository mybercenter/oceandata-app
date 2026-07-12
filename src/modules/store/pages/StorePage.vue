<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import StoreFormModal from '../components/StoreFormModal.vue'
import StoreDetailModal from '../components/StoreDetailModal.vue'
import { useStore } from '../composables/useStore'
import { areaService } from '../../area/services/area.service'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import type { Store } from '../types/store.types'

const {
  stores,
  pagination,
  filters,
  sort,
  isLoading,
  isSubmitting,
  fetchStores,
  createStore,
  updateStore,
  deleteStore,
  deleteSelected
} = useStore()

const confirm = useConfirmDialog()

// Area Data for Filter
const areaOptions = ref<{label: string, value: string}[]>([{ label: 'All Areas', value: '' }])

// Columns Configuration
const columns: TableColumn[] = [
  { key: 'code', label: 'Store Code', type: 'text', sortable: true },
  { key: 'name', label: 'Store Name', type: 'text', sortable: true },
  { key: 'area', label: 'Area', type: 'text', sortable: false },
  { key: 'address', label: 'Address', type: 'text', sortable: false },
  { key: 'status', label: 'Status', type: 'status', align: 'center' },
  { key: 'updatedAt', label: 'Last Updated', type: 'date', sortable: true },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

// Modal State
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedStore = ref<Store | null>(null)

onMounted(async () => {
  fetchStores()
  const areas = await areaService.getAreas()
  areaOptions.value = [
    { label: 'All Areas', value: '' },
    ...areas.map(a => ({ label: a.name, value: a.id }))
  ]
})

// Handlers
const handleSort = (key: string, order: 'asc'|'desc') => {
  sort.value = { key, order }
  fetchStores()
}

const handleCreateNew = () => {
  selectedStore.value = null
  isFormModalOpen.value = true
}

const handleView = (store: Store) => {
  selectedStore.value = store
  isDetailModalOpen.value = true
}

const handleEdit = (store: Store) => {
  selectedStore.value = store
  isDetailModalOpen.value = false
  isFormModalOpen.value = true
}

const handleDelete = (store: Store) => {
  confirm.confirm({
    title: 'Delete Store',
    message: 'Are you sure you want to delete Store ' + store.name + '? This action cannot be undone.',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      await deleteStore(store.id)
      if (selectedStore.value?.id === store.id) {
        isDetailModalOpen.value = false
      }
    }
  })
}

const handleDeleteSelected = (ids: string[]) => {
  confirm.confirm({
    title: 'Delete Selected Stores',
    message: 'Are you sure you want to delete ' + ids.length + ' selected stores? This action cannot be undone.',
    confirmText: 'Delete All',
    type: 'danger',
    onConfirm: async () => {
      await deleteSelected(ids)
    }
  })
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  if (selectedStore.value) {
    success = await updateStore(selectedStore.value.id, data)
  } else {
    success = await createStore(data)
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
  fetchStores()
}, { deep: true })
</script>

<template>
  <AppPage 
    title="Store Management" 
    subtitle="Manage operational stores under each business area."
  >
    <!-- Integrated Data Table -->
    <AppDataTable 
      :columns="columns"
      :data="stores"
      :loading="isLoading"
      :total="pagination.total"
      :filters="filters"
      showAdd
      showExport
      emptyTitle="No Stores Found"
      @update:filters="filters = $event"
      @update:pagination="fetchStores"
      @sort="handleSort"
      @refresh="fetchStores"
      @add="handleCreateNew"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
    >
      <!-- Custom Area Filter Slot -->
      <template #filters>
        <div class="w-full sm:w-48">
          <AppSelect 
            v-model="filters.areaId"
            :options="areaOptions"
          />
        </div>
      </template>

      <!-- Custom Column: Area Name -->
      <template #area="{ row }">
        <span class="text-gray-900">{{ row.area?.name || '-' }}</span>
      </template>

      <!-- Custom Column: Address Truncated -->
      <template #address="{ row }">
        <span class="text-gray-600 truncate max-w-[200px] block" :title="row.address">
          {{ row.address }}
        </span>
      </template>
    </AppDataTable>

    <!-- Modals/Modals -->
    <StoreFormModal 
      :is-open="isFormModalOpen"
      :initial-data="selectedStore"
      :loading="isSubmitting"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <StoreDetailModal 
      :is-open="isDetailModalOpen"
      :store="selectedStore"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />
  </AppPage>
</template>


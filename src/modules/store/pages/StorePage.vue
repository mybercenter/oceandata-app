<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppAsyncSelect from '@/shared/components/AppAsyncSelect.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import StoreFormModal from '../components/StoreFormModal.vue'
import StoreDetailModal from '../components/StoreDetailModal.vue'
import { useStore } from '../composables/useStore'
import { useLookupStore } from '@/stores/lookup.store'
import { storeToRefs } from 'pinia'
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

const lookupStore = useLookupStore()
const { areas } = storeToRefs(lookupStore)

// areaOptions no longer needed since we use AppAsyncSelect

// Columns Configuration
const columns: TableColumn[] = [
  { key: 'code', label: 'Store Code', type: 'text', sortable: true },
  { key: 'name', label: 'Store Name', type: 'text', sortable: true },
  { key: 'area', label: 'Area', type: 'text', sortable: false },
  { key: 'address', label: 'Address', type: 'text', sortable: false },
  { key: 'is_active', label: 'Status', type: 'status', align: 'center' },
  { key: 'updated_at', label: 'Last Updated', type: 'date', sortable: true },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

// Modal State
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedStore = ref<Store | null>(null)

onMounted(async () => {
  await lookupStore.fetchLookups()
  fetchStores()
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

const handleDelete = async (store: Store) => {
  if (window.confirm('Are you sure you want to delete Store ' + store.name + '? This action cannot be undone.')) {
    await deleteStore(store.id)
    if (selectedStore.value?.id === store.id) {
      isDetailModalOpen.value = false
    }
  }
}

const handleDeleteSelected = async (ids: string[]) => {
  if (window.confirm('Are you sure you want to delete ' + ids.length + ' selected stores? This action cannot be undone.')) {
    await deleteSelected(ids)
  }
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
      :filters="(filters as any)"
      showAdd
      showExport
      showEdit
      showDelete
      showView
      emptyTitle="No Stores Found"
      @update:filters="filters = ($event as any)"
      @update:pagination="(p) => { pagination.value.page = p.page; pagination.value.limit = p.limit; fetchStores() }"
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
          <AppAsyncSelect 
            v-model="(filters as any).areaId"
            endpoint="/areas"
            placeholder="All Areas"
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


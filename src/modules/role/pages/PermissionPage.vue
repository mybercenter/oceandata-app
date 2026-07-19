<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import PermissionFormModal from '../components/PermissionFormModal.vue'
import { usePermission } from '../composables/usePermission'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import type { Permission } from '../types/permission.types'

const {
  permissions,
  pagination,
  filters,
  sort,
  isLoading,
  isSubmitting,
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  deleteSelected
} = usePermission()

const confirm = useConfirmDialog()

const moduleOptions = [
  { label: 'All Modules', value: '' },
  ...['Dashboard', 'Area', 'Store', 'Employee', 'Users', 'Roles', 'Message Template', 'Customer', 'Follow Up', 'Report', 'Settings'].map(m => ({ label: m, value: m }))
]

const actionOptions = [
  { label: 'All Actions', value: '' },
  ...['View', 'Create', 'Update', 'Delete', 'Export', 'Approve'].map(a => ({ label: a, value: a }))
]

const columns: TableColumn[] = [
  { key: 'name', label: 'Permission Name', type: 'text', sortable: true },
  { key: 'module', label: 'Module', type: 'text', sortable: true },
  { key: 'action', label: 'Action', type: 'text', sortable: true },
  { key: 'created_at', label: 'Created At', type: 'date', sortable: true },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

const isFormModalOpen = ref(false)
const selectedPermission = ref<Permission | null>(null)

onMounted(() => {
  fetchPermissions()
})

const handleSort = (key: string, order: 'asc'|'desc') => {
  sort.value = { key, order }
  fetchPermissions()
}

const handleCreateNew = () => {
  selectedPermission.value = null
  isFormModalOpen.value = true
}

const handleEdit = (perm: Permission) => {
  selectedPermission.value = perm
  isFormModalOpen.value = true
}

const handleDelete = (perm: Permission) => {
  confirm.confirm({
    title: 'Delete Permission',
    message: 'Are you sure you want to delete permission ' + perm.name + '? This will immediately remove it from all roles.',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      await deletePermission(perm.id)
    }
  })
}

const handleDeleteSelected = (ids: string[]) => {
  confirm.confirm({
    title: 'Delete Selected Permissions',
    message: 'Are you sure you want to delete ' + ids.length + ' selected permissions?',
    confirmText: 'Delete All',
    type: 'danger',
    onConfirm: async () => {
      await deleteSelected(ids)
    }
  })
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  if (selectedPermission.value) {
    success = await updatePermission(selectedPermission.value.id, data)
  } else {
    success = await createPermission(data)
  }

  if (success) {
    if (!createAnother) {
      isFormModalOpen.value = false
    }
  }
}

watch(filters, () => {
  pagination.value.page = 1
  fetchPermissions()
}, { deep: true })

const getActionColor = (action: string) => {
  switch (action) {
    case 'View': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Create': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'Update': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'Delete': return 'bg-red-100 text-red-800 border-red-200'
    case 'Export': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Approve': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
</script>

<template>
  <AppPage 
    title="Permission Management" 
    subtitle="Define fine-grained access control permissions for modules."
  >
    <AppDataTable 
      :columns="columns"
      :data="permissions"
      :loading="isLoading"
      :total="pagination.total"
      :filters="(filters as any)"
      showAdd
      showExport
      showEdit
      showDelete
      emptyTitle="No Permissions Found"
      @update:filters="filters = ($event as any)"
      @update:pagination="(p) => { pagination.page = p.page; pagination.limit = p.limit; fetchPermissions() }"
      @sort="handleSort"
      @refresh="fetchPermissions"
      @add="handleCreateNew"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
    >
      <template #filters>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-64">
          <AppSelect v-model="(filters as any).module" :options="moduleOptions" />
          <AppSelect v-model="(filters as any).action" :options="actionOptions" />
        </div>
      </template>

      <template #module="{ row }">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
          {{ row.module }}
        </span>
      </template>
      
      <template #action="{ row }">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border" :class="getActionColor(row.action)">
          {{ row.action }}
        </span>
      </template>
    </AppDataTable>

    <PermissionFormModal 
      :is-open="isFormModalOpen"
      :initial-data="selectedPermission"
      :loading="isSubmitting"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />
  </AppPage>
</template>

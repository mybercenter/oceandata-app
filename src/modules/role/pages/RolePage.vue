<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import RoleFormModal from '../components/RoleFormModal.vue'
import RoleDetailModal from '../components/RoleDetailModal.vue'
import { useRole } from '../composables/useRole'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import type { Role } from '../types/role.types'
import { useRouter } from 'vue-router'

const {
  roles,
  pagination,
  filters,
  sort,
  isLoading,
  isSubmitting,
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  deleteSelected
} = useRole()

const confirm = useConfirmDialog()
const router = useRouter()

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const columns: TableColumn[] = [
  { key: 'name', label: 'Role Name', type: 'text', sortable: true },
  { key: 'description', label: 'Description', type: 'text', sortable: true },
  { key: 'created_at', label: 'Created At', type: 'date', sortable: true },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedRole = ref<Role | null>(null)

onMounted(() => {
  fetchRoles()
})

const handleSort = (key: string, order: 'asc'|'desc') => {
  sort.value = { key, order }
  fetchRoles()
}

const handleCreateNew = () => {
  selectedRole.value = null
  isFormModalOpen.value = true
}

const handleView = (role: Role) => {
  selectedRole.value = role
  isDetailModalOpen.value = true
}

const handleEdit = (role: Role) => {
  selectedRole.value = role
  isDetailModalOpen.value = false
  isFormModalOpen.value = true
}

const handleDelete = (role: Role) => {
  confirm.confirm({
    title: 'Delete Role',
    message: 'Are you sure you want to delete role ' + role.name + '? This will affect all users assigned to this role.',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      await deleteRole(role.id)
      if (selectedRole.value?.id === role.id) {
        isDetailModalOpen.value = false
      }
    }
  })
}

const handleDeleteSelected = (ids: string[]) => {
  confirm.confirm({
    title: 'Delete Selected Roles',
    message: 'Are you sure you want to delete ' + ids.length + ' selected roles?',
    confirmText: 'Delete All',
    type: 'danger',
    onConfirm: async () => {
      await deleteSelected(ids)
    }
  })
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  if (selectedRole.value) {
    success = await updateRole(selectedRole.value.id, data)
  } else {
    success = await createRole(data)
  }

  if (success) {
    if (!createAnother) {
      isFormModalOpen.value = false
    }
  }
}

watch(filters, () => {
  pagination.value.page = 1
  fetchRoles()
}, { deep: true })
</script>

<template>
  <AppPage 
    title="Role Management" 
    subtitle="Define system roles and basic attributes."
  >
    <template #actions>
      <button 
        @click="router.push('/role/matrix')"
        class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-3"
      >
        View Permission Matrix
      </button>
    </template>

    <AppDataTable 
      :columns="columns"
      :data="roles"
      :loading="isLoading"
      :total="pagination.total"
      :filters="(filters as any)"
      showAdd
      showExport
      showEdit
      showDelete
      showView
      emptyTitle="No Roles Found"
      @update:filters="filters = ($event as any)"
      @update:pagination="fetchRoles"
      @sort="handleSort"
      @refresh="fetchRoles"
      @add="handleCreateNew"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
    >
      <template #filters>
        <div class="w-full sm:w-48">
          <AppSelect v-model="(filters as any).status" :options="statusOptions" />
        </div>
      </template>
    </AppDataTable>

    <RoleFormModal 
      :is-open="isFormModalOpen"
      :initial-data="selectedRole"
      :loading="isSubmitting"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <RoleDetailModal 
      :is-open="isDetailModalOpen"
      :role="selectedRole"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />
  </AppPage>
</template>


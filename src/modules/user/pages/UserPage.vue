<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import UserFormModal from '../components/UserFormModal.vue'
import UserDetailModal from '../components/UserDetailModal.vue'
import ResetPasswordModal from '../components/ResetPasswordModal.vue'
import { useUser } from '../composables/useUser'
import { useLookupStore } from '@/stores/lookup.store'
import { storeToRefs } from 'pinia'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import type { User } from '../types/user.types'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const {
  users,
  pagination,
  filters,
  sort,
  isLoading,
  isSubmitting,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  deleteSelected,
  resetPassword
} = useUser()

const confirm = useConfirmDialog()

// Filter Options
const lookupStore = useLookupStore()
const { roles } = storeToRefs(lookupStore)

onMounted(async () => {
  await lookupStore.fetchLookups()
})

const roleOptions = computed(() => {
  return [{ label: 'All Roles', value: '' }, ...roles.value.map((r: any) => ({ label: r.name, value: r.id }))]
})
const lastLoginOptions = [
  { label: 'All Time', value: '' },
  { label: 'Has Logged In', value: 'has_logged_in' },
  { label: 'Never Logged In', value: 'never' }
]
const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

// Columns Configuration
const columns: TableColumn[] = [
  { key: 'employeeName', label: 'Employee', type: 'text', sortable: true },
  { key: 'employeeCode', label: 'EMP Code', type: 'text', sortable: true },
  { key: 'role', label: 'Role', type: 'text', sortable: false },
  { key: 'username', label: 'Username', type: 'text', sortable: true },
  { key: 'is_active', label: 'Status', type: 'status', align: 'center' },
  { key: 'last_login', label: 'Last Login', type: 'text', align: 'right' },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

// Modal State
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isResetPasswordOpen = ref(false)
const selectedUser = ref<User | null>(null)

onMounted(() => {
  fetchUsers()
})

// Handlers
const handleSort = (key: string, order: 'asc'|'desc') => {
  sort.value = { key, order }
  fetchUsers()
}

const handleCreateNew = () => {
  selectedUser.value = null
  isFormModalOpen.value = true
}

const handleView = (user: User) => {
  selectedUser.value = user
  isDetailModalOpen.value = true
}

const handleEdit = (user: User) => {
  selectedUser.value = user
  isDetailModalOpen.value = false
  isFormModalOpen.value = true
}

const handleOpenResetPassword = (user: User) => {
  selectedUser.value = user
  isResetPasswordOpen.value = true
}

const handleDelete = (user: User) => {
  confirm.confirm({
    title: 'Delete User Account',
    message: 'Are you sure you want to delete account ' + user.username + '? This action cannot be undone.',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      await deleteUser(user.id)
      if (selectedUser.value?.id === user.id) {
        isDetailModalOpen.value = false
      }
    }
  })
}

const handleDeleteSelected = (ids: string[]) => {
  confirm.confirm({
    title: 'Delete Selected Accounts',
    message: 'Are you sure you want to delete ' + ids.length + ' selected accounts? This action cannot be undone.',
    confirmText: 'Delete All',
    type: 'danger',
    onConfirm: async () => {
      await deleteSelected(ids)
    }
  })
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  if (selectedUser.value) {
    success = await updateUser(selectedUser.value.id, data)
  } else {
    success = await createUser(data)
  }

  if (success) {
    if (!createAnother) {
      isFormModalOpen.value = false
    }
  }
}

const handleResetPasswordSubmit = async (newPassword: string) => {
  if (!selectedUser.value) return
  const success = await resetPassword(selectedUser.value.id, newPassword)
  if (success) {
    isResetPasswordOpen.value = false
  }
}

// Watch filters to trigger fetch
watch(filters, () => {
  pagination.value.page = 1
  fetchUsers()
}, { deep: true })

// Formatting Helpers
const formatLastLogin = (isoString?: string) => {
  if (!isoString) return 'Never'
  
  const date = new Date(isoString)
  const today = new Date()
  
  const msDiff = today.getTime() - date.getTime()
  const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Yesterday'
  return daysDiff + ' Days Ago'
}

const getRoleColor = (roleName?: string) => {
  switch(roleName) {
    case 'Administrator': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Manager': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Supervisor': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case 'Trainer': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'Sales': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'Promotor': return 'bg-rose-100 text-rose-800 border-rose-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
</script>

<template>
  <AppPage 
    title="User Management" 
    subtitle="Manage application login accounts and access status."
  >
    <!-- Integrated Data Table -->
    <AppDataTable 
      :columns="columns"
      :data="users"
      :loading="isLoading"
      :total="pagination.total"
      :filters="(filters as any)"
      showAdd
      showExport
      showEdit
      showDelete
      showView
      emptyTitle="No Users Found"
      @update:filters="filters = ($event as any)"
      @update:pagination="fetchUsers"
      @sort="handleSort"
      @refresh="fetchUsers"
      @add="handleCreateNew"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
    >
      <!-- Custom Filters Slot -->
      <template #filters>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full sm:w-auto">
          <AppSelect v-model="(filters as any).roleId" :options="roleOptions" />
          <AppSelect v-model="(filters as any).lastLogin" :options="lastLoginOptions" />
          <AppSelect v-model="(filters as any).status" :options="statusOptions" />
        </div>
      </template>

      <!-- Custom Column: Employee Name -->
      <template #employeeName="{ row }">
        <span class="font-medium text-gray-900">{{ row.employee?.full_name || '-' }}</span>
      </template>
      
      <!-- Custom Column: Employee Code -->
      <template #employeeCode="{ row }">
        <span class="text-gray-500 font-mono text-sm">{{ row.employee?.employee_code || '-' }}</span>
      </template>

      <!-- Custom Column: Role -->
      <template #role="{ row }">
        <span class="px-2 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap" :class="getRoleColor(row.employee?.role?.name)">
          {{ row.employee?.role?.name || '-' }}
        </span>
      </template>
      
      <!-- Custom Column: Last Login -->
      <template #last_login="{ row }">
        <span class="text-gray-600 text-sm">
          {{ formatLastLogin(row.last_login) }}
        </span>
      </template>

      <!-- Prepend Reset Password to row actions -->
      <template #actions-prepend="{ row, close }">
        <button 
          @click="handleOpenResetPassword(row); close()"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          role="menuitem"
        >
          <ArrowPathIcon class="w-4 h-4 mr-3 text-gray-400" />
          Reset Password
        </button>
        <div class="border-t border-gray-100 my-1"></div>
      </template>
      
    </AppDataTable>

    <!-- Modals & Modals -->
    <UserFormModal 
      :is-open="isFormModalOpen"
      :initial-data="selectedUser"
      :loading="isSubmitting"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <UserDetailModal 
      :is-open="isDetailModalOpen"
      :user="selectedUser"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />

    <ResetPasswordModal
      :is-open="isResetPasswordOpen"
      :user-id="selectedUser?.id || ''"
      :loading="isSubmitting"
      @close="isResetPasswordOpen = false"
      @submit="handleResetPasswordSubmit"
    />
  </AppPage>
</template>



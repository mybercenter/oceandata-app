<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppDataTable from '@/shared/components/table/AppDataTable.vue'
import AppSelect from '@/shared/components/AppSelect.vue'
import type { TableColumn } from '@/shared/components/table/table.types'
import EmployeeFormModal from '../components/EmployeeFormModal.vue'
import EmployeeDetailModal from '../components/EmployeeDetailModal.vue'
import { useEmployee } from '../composables/useEmployee'
import { areaService } from '../../area/services/area.service'
import { storeService } from '../../store/services/store.service'
import { mockRoles } from '../../role/mock/role.mock'
import { useConfirmDialog } from '@/shared/composables/useConfirmDialog'
import type { Employee } from '../types/employee.types'

const {
  employees,
  pagination,
  filters,
  sort,
  isLoading,
  isSubmitting,
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  deleteSelected
} = useEmployee()

const confirm = useConfirmDialog()

// Filter Options
const roleOptions = ref([{ label: 'All Roles', value: '' }, ...mockRoles.map(r => ({ label: r.name, value: r.id }))])
const areaOptions = ref<{label: string, value: string}[]>([{ label: 'All Areas', value: '' }])
const storeOptions = ref<{label: string, value: string}[]>([{ label: 'All Stores', value: '' }])
const dedicateOptions = [
  { label: 'All Dedicate', value: '' },
  { label: 'AV', value: 'AV' },
  { label: 'HA', value: 'HA' },
  { label: 'Hybrid', value: 'Hybrid' }
]

// Columns Configuration
const columns: TableColumn[] = [
  { key: 'employeeCode', label: 'EMP ID', type: 'text', sortable: true },
  { key: 'fullName', label: 'Employee Name', type: 'text', sortable: true },
  { key: 'role', label: 'Role', type: 'text', sortable: false },
  { key: 'areas', label: 'Area(s)', type: 'text', sortable: false },
  { key: 'store', label: 'Store', type: 'text', sortable: false },
  { key: 'dedicate', label: 'Dedicate', type: 'text', align: 'center' },
  { key: 'status', label: 'Status', type: 'status', align: 'center' },
  { key: 'actions', label: 'Actions', type: 'actions', align: 'right' }
]

// Modal State
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedEmployee = ref<Employee | null>(null)

onMounted(async () => {
  fetchEmployees()
  const [areas, stores] = await Promise.all([
    areaService.getAreas(),
    storeService.getStores()
  ])
  areaOptions.value = [
    { label: 'All Areas', value: '' },
    ...areas.map(a => ({ label: a.name, value: a.id }))
  ]
  storeOptions.value = [
    { label: 'All Stores', value: '' },
    ...stores.map(s => ({ label: s.name, value: s.id }))
  ]
})

// Handlers
const handleSort = (key: string, order: 'asc'|'desc') => {
  sort.value = { key, order }
  fetchEmployees()
}

const handleCreateNew = () => {
  selectedEmployee.value = null
  isFormModalOpen.value = true
}

const handleView = (employee: Employee) => {
  selectedEmployee.value = employee
  isDetailModalOpen.value = true
}

const handleEdit = (employee: Employee) => {
  selectedEmployee.value = employee
  isDetailModalOpen.value = false
  isFormModalOpen.value = true
}

const handleDelete = (employee: Employee) => {
  confirm.confirm({
    title: 'Delete Employee',
    message: 'Are you sure you want to delete Employee ' + employee.fullName + '? This action cannot be undone.',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      await deleteEmployee(employee.id)
      if (selectedEmployee.value?.id === employee.id) {
        isDetailModalOpen.value = false
      }
    }
  })
}

const handleDeleteSelected = (ids: string[]) => {
  confirm.confirm({
    title: 'Delete Selected Employees',
    message: 'Are you sure you want to delete ' + ids.length + ' selected employees? This action cannot be undone.',
    confirmText: 'Delete All',
    type: 'danger',
    onConfirm: async () => {
      await deleteSelected(ids)
    }
  })
}

const handleFormSubmit = async (data: any, createAnother: boolean) => {
  let success = false
  if (selectedEmployee.value) {
    success = await updateEmployee(selectedEmployee.value.id, data)
  } else {
    success = await createEmployee(data)
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
  fetchEmployees()
}, { deep: true })

// Formatting Helpers
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

const getDedicateColor = (dedicate?: string) => {
  if (dedicate === 'AV') return 'bg-indigo-100 text-indigo-800'
  if (dedicate === 'HA') return 'bg-teal-100 text-teal-800'
  return 'bg-fuchsia-100 text-fuchsia-800'
}
</script>

<template>
  <AppPage 
    title="Employee Management" 
    subtitle="Manage all employees including Managers, Supervisors, Trainers, Sales, and Promotors."
  >
    <!-- Integrated Data Table -->
    <AppDataTable 
      :columns="columns"
      :data="employees"
      :loading="isLoading"
      :total="pagination.total"
      :filters="filters"
      showAdd
      showExport
      emptyTitle="No Employees Found"
      @update:filters="filters = $event"
      @update:pagination="fetchEmployees"
      @sort="handleSort"
      @refresh="fetchEmployees"
      @add="handleCreateNew"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @delete-selected="handleDeleteSelected"
    >
      <!-- Custom Filters Slot -->
      <template #filters>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          <AppSelect v-model="filters.roleId" :options="roleOptions" />
          <AppSelect v-model="filters.areaId" :options="areaOptions" />
          <AppSelect v-model="filters.storeId" :options="storeOptions" />
          <AppSelect v-model="filters.dedicate" :options="dedicateOptions" />
        </div>
      </template>

      <!-- Custom Column: Role -->
      <template #role="{ row }">
        <span class="px-2 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap" :class="getRoleColor(row.role?.name)">
          {{ row.role?.name || '-' }}
        </span>
      </template>

      <!-- Custom Column: Areas -->
      <template #areas="{ row }">
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          <template v-if="row.areas && row.areas.length > 0">
            <span 
              v-for="area in row.areas.slice(0, 2)" 
              :key="area.id"
              class="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium border border-gray-200 whitespace-nowrap"
            >
              {{ area.name }}
            </span>
            <span 
              v-if="row.areas.length > 2"
              class="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[11px] font-medium border border-gray-300"
              :title="row.areas.slice(2).map((a: any) => a.name).join(', ')"
            >
              +{{ row.areas.length - 2 }} More
            </span>
          </template>
          <span v-else class="text-gray-400">-</span>
        </div>
      </template>

      <!-- Custom Column: Store -->
      <template #store="{ row }">
        <span class="text-gray-900 truncate max-w-[150px] block" :title="row.store?.name">
          {{ row.store?.name || '-' }}
        </span>
      </template>

      <!-- Custom Column: Dedicate -->
      <template #dedicate="{ row }">
        <span v-if="row.dedicate" class="px-2 py-0.5 rounded text-xs font-medium" :class="getDedicateColor(row.dedicate)">
          {{ row.dedicate }}
        </span>
        <span v-else class="text-gray-400">-</span>
      </template>
      
    </AppDataTable>

    <!-- Modals/Modals -->
    <EmployeeFormModal 
      :is-open="isFormModalOpen"
      :initial-data="selectedEmployee"
      :loading="isSubmitting"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <EmployeeDetailModal 
      :is-open="isDetailModalOpen"
      :employee="selectedEmployee"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />
  </AppPage>
</template>



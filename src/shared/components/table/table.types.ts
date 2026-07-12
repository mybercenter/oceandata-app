export type TableColumnType = 'text' | 'badge' | 'avatar' | 'date' | 'number' | 'status' | 'actions'

export interface TableColumn {
  key: string
  label: string
  type: TableColumnType
  sortable?: boolean
  visible?: boolean // Default is true if undefined
  align?: 'left' | 'center' | 'right'
}

export interface TablePagination {
  page: number
  limit: number
  total: number
}

export interface TableFilters {
  search: string
  status: string
}

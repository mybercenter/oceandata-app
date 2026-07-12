import type { Area } from '../../area/types/area.types'

export type TemplateStatus = 'active' | 'inactive'
export type DedicateType = 'AV' | 'HA'

export interface MessageTemplate {
  id: string
  areaId: string
  area?: Area
  dedicate: DedicateType
  template1: string
  template2?: string
  template3?: string
  status: TemplateStatus
  createdAt: string
  updatedAt: string
}

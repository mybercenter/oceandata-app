import type { Area } from '../../area/types/area.types'

export type DedicateType = 'AV' | 'HA'

export interface MessageTemplate {
  id: string
  area_id: string
  area?: Area
  dedicate: DedicateType
  template_1: string
  template_2?: string
  template_3?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

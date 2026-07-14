import type { MessageTemplate } from '../types/message-template.types'
import { mockAreas } from '../../area/mock/area.mock'

export const mockMessageTemplates: MessageTemplate[] = []

const targetAreas = ['Jatim 1', 'Jatim 2', 'Semarang', 'Jakarta', 'Bali']
const filteredAreas = mockAreas.filter(a => targetAreas.includes(a.name))

const dedicates: ('AV'|'HA')[] = ['AV', 'HA']

let idCounter = 1

filteredAreas.forEach(area => {
  dedicates.forEach(dedicate => {
    mockMessageTemplates.push({
      id: 'mt' + idCounter++,
      area_id: area.id,
      area: area,
      dedicate,
      template_1: 'Halo {{customer_name}}, terima kasih telah berbelanja produk {{product}} di toko {{store_name}}. Apakah barang sudah diterima dengan baik? - {{employee_name}}, {{area_name}}',
      template_2: 'Halo {{customer_name}}, kami dari {{store_name}}. Kami ingin mengingatkan tentang jadwal service produk {{product}} Anda. Mohon konfirmasinya ya!',
      template_3: 'Terima kasih {{customer_name}} atas kepercayaannya. Jangan lupa kunjungi cabang kami kembali di {{area_name}} untuk promo menarik bulan ini.',
      is_active: true,
      created_at: new Date('2024-01-01T10:00:00Z').toISOString(),
      updated_at: new Date('2024-01-01T10:00:00Z').toISOString()
    })
  })
})

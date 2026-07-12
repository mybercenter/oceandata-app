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
      areaId: area.id,
      area: area,
      dedicate,
      template1: 'Halo {{customer_name}}, terima kasih telah berbelanja produk {{product}} di toko {{store_name}}. Apakah barang sudah diterima dengan baik? - {{employee_name}}, {{area_name}}',
      template2: 'Halo {{customer_name}}, kami dari {{store_name}}. Kami ingin mengingatkan tentang jadwal service produk {{product}} Anda. Mohon konfirmasinya ya!',
      template3: 'Terima kasih {{customer_name}} atas kepercayaannya. Jangan lupa kunjungi cabang kami kembali di {{area_name}} untuk promo menarik bulan ini.',
      status: 'active',
      createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-01T10:00:00Z').toISOString()
    })
  })
})

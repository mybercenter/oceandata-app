import type { Store } from '../types/store.types'
import { mockAreas } from '../../area/mock/area.mock'

const generateDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const generateStores = (count: number): Store[] => {
  const stores: Store[] = []
  
  const brandNames = ['Hartono', 'UFO', 'Electronic City', 'Informa', 'Ace Hardware', 'Erafone', 'iBox', 'Mitra10', 'Transmart', 'Lotte Mart']
  const statuses = ['active', 'active', 'active', 'active', 'inactive', 'maintenance']
  
  for (let i = 1; i <= count; i++) {
    // Pick random area
    const area = mockAreas[Math.floor(Math.random() * mockAreas.length)]
    
    // Pick random brand
    const brand = brandNames[Math.floor(Math.random() * brandNames.length)]
    
    // Generate name
    const city = area.name.split(' (')[1]?.replace(')', '') || area.name
    const name = `${brand} ${city} ${Math.floor(Math.random() * 3) + 1}`
    
    // Generate code
    const code = `${brand.substring(0, 3).toUpperCase()}-${area.code}-${String(i).padStart(3, '0')}`
    
    const is_active = statuses[Math.floor(Math.random() * statuses.length)] === 'active'
    
    stores.push({
      id: `s${i}`,
      code,
      name,
      area_id: area.id,
      area: { ...area }, // Hydrated for display
      address: `Jl. Jend. Sudirman No. ${Math.floor(Math.random() * 200) + 1}, ${city}`,
      is_active,
      created_at: generateDate(Math.floor(Math.random() * 200) + 10),
      updated_at: generateDate(Math.floor(Math.random() * 10)),
      stats: {
        totalEmployees: Math.floor(Math.random() * 50) + 5,
        totalCustomers: Math.floor(Math.random() * 1000) + 100
      }
    })
  }
  
  return stores
}

export const mockStores: Store[] = generateStores(50)

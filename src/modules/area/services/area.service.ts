import type { Area } from '../types/area.types'
import { mockAreas } from '../mock/area.mock'

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class AreaService {
  private areas: Area[] = [...mockAreas]

  async getAreas(): Promise<Area[]> {
    await delay(600)
    return [...this.areas]
  }

  async getArea(id: string): Promise<Area | undefined> {
    await delay(400)
    return this.areas.find(a => a.id === id)
  }

  async createArea(data: Omit<Area, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): Promise<Area> {
    await delay(800)
    
    // Simulate unique validation
    if (this.areas.some(a => a.code.toLowerCase() === data.code.toLowerCase())) {
      throw new Error(`Area code ${data.code} already exists`)
    }

    const newArea: Area = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalStores: 0,
        totalEmployees: 0,
        totalCustomers: 0
      }
    }
    
    this.areas.unshift(newArea)
    return newArea
  }

  async updateArea(id: string, data: Partial<Area>): Promise<Area> {
    await delay(800)
    const index = this.areas.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Area not found')

    // Simulate unique validation
    if (data.code && this.areas.some(a => a.id !== id && a.code.toLowerCase() === data.code?.toLowerCase())) {
      throw new Error(`Area code ${data.code} already exists`)
    }

    this.areas[index] = {
      ...this.areas[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    return this.areas[index]
  }

  async deleteArea(id: string): Promise<void> {
    await delay(600)
    const index = this.areas.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Area not found')
    this.areas.splice(index, 1)
  }
}

export const areaService = new AreaService()

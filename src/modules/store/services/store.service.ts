import type { Store } from '../types/store.types'
import { mockStores } from '../mock/store.mock'

class StoreService {
  private stores: Store[] = [...mockStores]

  // Simulate network delay
  private delay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getStores(): Promise<Store[]> {
    await this.delay()
    return [...this.stores]
  }

  async getStore(id: string): Promise<Store> {
    await this.delay(400)
    const store = this.stores.find(s => s.id === id)
    if (!store) throw new Error('Store not found')
    return { ...store }
  }

  async createStore(data: Omit<Store, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): Promise<Store> {
    await this.delay(1000)
    
    // Simulate validation
    const existingCode = this.stores.find(s => s.code.toLowerCase() === data.code.toLowerCase())
    if (existingCode) {
      throw new Error('Store code already exists')
    }

    const newStore: Store = {
      ...data,
      id: s + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalEmployees: 0,
        totalCustomers: 0
      }
    }
    
    this.stores.unshift(newStore)
    return { ...newStore }
  }

  async updateStore(id: string, data: Partial<Store>): Promise<Store> {
    await this.delay(1000)
    
    const index = this.stores.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Store not found')

    if (data.code) {
      const existingCode = this.stores.find(s => s.code.toLowerCase() === data.code?.toLowerCase() && s.id !== id)
      if (existingCode) {
        throw new Error('Store code already exists')
      }
    }

    this.stores[index] = {
      ...this.stores[index],
      ...data,
      updatedAt: new Date().toISOString()
    }

    return { ...this.stores[index] }
  }

  async deleteStore(id: string): Promise<void> {
    await this.delay(800)
    const index = this.stores.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Store not found')
    this.stores.splice(index, 1)
  }
}

export const storeService = new StoreService()

import type { MessageTemplate } from '../types/message-template.types'
import { mockMessageTemplates } from '../mock/message-template.mock'
import { mockAreas } from '../../area/mock/area.mock'

class MessageTemplateService {
  private templates: MessageTemplate[] = [...mockMessageTemplates]

  private delay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getTemplates(): Promise<MessageTemplate[]> {
    await this.delay()
    return [...this.templates]
  }

  async getTemplate(id: string): Promise<MessageTemplate> {
    await this.delay(400)
    const tpl = this.templates.find(t => t.id === id)
    if (!tpl) throw new Error('Template not found')
    return { ...tpl }
  }

  async createTemplate(data: Partial<MessageTemplate>): Promise<MessageTemplate> {
    await this.delay(1000)
    
    // Validation
    if (!data.areaId) throw new Error('Area is required')
    if (!data.dedicate) throw new Error('Dedicate is required')
    if (!data.template1 && !data.template2 && !data.template3) {
      throw new Error('At least one template message must be filled')
    }

    // Check duplicate Area + Dedicate
    const exists = this.templates.find(t => t.areaId === data.areaId && t.dedicate === data.dedicate)
    if (exists) {
      throw new Error('A template for this Area and Dedicate already exists. Please edit the existing one.')
    }

    const area = mockAreas.find(a => a.id === data.areaId)

    const newTpl: MessageTemplate = {
      ...data,
      id: 'mt' + Date.now(),
      areaId: data.areaId,
      area: area,
      dedicate: data.dedicate as 'AV' | 'HA',
      template1: data.template1 || '',
      template2: data.template2 || '',
      template3: data.template3 || '',
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.templates.unshift(newTpl)
    return { ...newTpl }
  }

  async updateTemplate(id: string, data: Partial<MessageTemplate>): Promise<MessageTemplate> {
    await this.delay(1000)
    const index = this.templates.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Template not found')

    if (!data.template1 && !data.template2 && !data.template3) {
      throw new Error('At least one template message must be filled')
    }

    // Check duplicate if area or dedicate changed
    if (data.areaId || data.dedicate) {
      const areaId = data.areaId || this.templates[index].areaId
      const dedicate = data.dedicate || this.templates[index].dedicate
      
      const exists = this.templates.find(t => t.areaId === areaId && t.dedicate === dedicate && t.id !== id)
      if (exists) {
        throw new Error('A template for this Area and Dedicate already exists.')
      }
    }

    const area = data.areaId ? mockAreas.find(a => a.id === data.areaId) : this.templates[index].area
    
    this.templates[index] = {
      ...this.templates[index],
      ...data,
      area,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.templates[index] }
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.delay(800)
    const index = this.templates.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Template not found')
    this.templates.splice(index, 1)
  }
}

export const messageTemplateService = new MessageTemplateService()

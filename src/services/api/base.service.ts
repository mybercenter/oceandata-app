import http from '@/shared/services/http'

export class BaseApiService<T = any> {
  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async index(params = {}): Promise<{ data: T[], meta: any }> {
    const response = await http.get(this.endpoint, { params })
    const inner = response.data.data
    if (inner && Array.isArray(inner.data) && inner.meta !== undefined) {
      return {
        data: inner.data,
        meta: inner.meta
      }
    }
    return {
      data: inner || [],
      meta: response.data.meta || {}
    }
  }

  async show(id: string | number): Promise<T> {
    const response = await http.get(`${this.endpoint}/${id}`)
    const inner = response.data.data
    return inner && inner.data ? inner.data : inner
  }

  async store(data: any): Promise<T> {
    const response = await http.post(this.endpoint, data)
    const inner = response.data.data
    return inner && inner.data ? inner.data : inner
  }

  async update(id: string | number, data: any): Promise<T> {
    // Some Laravel APIs use PUT or PATCH for updates.
    // By convention, PUT replaces, PATCH updates partial. Let's use PUT/PATCH properly or standard POST with _method=PUT.
    // Typically Axios standard PUT works nicely with Laravel.
    const response = await http.put(`${this.endpoint}/${id}`, data)
    const inner = response.data.data
    return inner && inner.data ? inner.data : inner
  }

  async destroy(id: string | number): Promise<void> {
    await http.delete(`${this.endpoint}/${id}`)
  }

  async toggleStatus(id: string | number): Promise<T> {
    const response = await http.patch(`${this.endpoint}/${id}/status`)
    const inner = response.data.data
    return inner && inner.data ? inner.data : inner
  }
}

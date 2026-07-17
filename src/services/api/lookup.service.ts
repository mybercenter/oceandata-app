import http from '@/shared/services/http'

export const lookupService = {
  async fetchLookups() {
    const response = await http.get('/lookups')
    let data = response.data.data !== undefined ? response.data.data : response.data
    // Handle nested data wrapper from Laravel Resource Collections
    if (data && data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      data = data.data
    }
    return data
  }
}

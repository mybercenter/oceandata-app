import http from '@/shared/services/http'

export const lookupService = {
  async fetchLookups() {
    const response = await http.get('/lookups')
    return response.data.data
  }
}

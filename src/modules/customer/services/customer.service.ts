import http from '@/shared/services/http'
import type { Customer, FollowUpHistory } from '../types/customer.types'

class CustomerService {
  async index(params: any = {}) {
    const response = await http.get('/customers', { params })
    return response.data
  }

  async show(id: string | number): Promise<Customer> {
    const response = await http.get(`/customers/${id}`)
    return response.data.data
  }

  async getHistory(customerId: string | number): Promise<FollowUpHistory[]> {
    try {
      const response = await http.get(`/customers/${customerId}/follow-ups`)
      return response.data.data || response.data || []
    } catch (e) {
      return []
    }
  }

  async store(data: Partial<Customer>): Promise<Customer> {
    const response = await http.post('/customers', data)
    return response.data.data
  }

  async update(id: string | number, data: Partial<Customer>): Promise<Customer> {
    const response = await http.put(`/customers/${id}`, data)
    return response.data.data
  }

  async destroy(id: string | number): Promise<void> {
    await http.delete(`/customers/${id}`)
  }

  async updateStatus(id: string | number): Promise<Customer> {
    const response = await http.patch(`/customers/${id}/status`)
    return response.data.data
  }

  async updateConversion(id: string | number, conversion: string): Promise<Customer> {
    const response = await http.patch(`/customers/${id}/conversion`, { current_conversion: conversion })
    return response.data.data
  }
}

export const customerService = new CustomerService()

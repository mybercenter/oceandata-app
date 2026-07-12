import type { Customer, FollowUpHistory, CustomerStatus, Conversion, Gender } from '../types/customer.types'
import { mockEmployees } from '../../employee/mock/employee.mock'

export const mockCustomers: Customer[] = []
export const mockFollowUpHistory: FollowUpHistory[] = []

const firstNames = ['Budi', 'Siti', 'Agus', 'Dewi', 'Joko', 'Rini', 'Eko', 'Fitri', 'Bambang', 'Lestari', 'Andi', 'Ayu', 'Wahyu', 'Putri', 'Hendra', 'Sari', 'Iwan', 'Nina', 'Rizky', 'Maya', 'Ahmad', 'Dina', 'Irfan', 'Rina', 'Fajar', 'Tari', 'Dedi', 'Lia', 'Rudi', 'Wati']
const lastNames = ['Santoso', 'Wijaya', 'Kusuma', 'Gunawan', 'Hidayat', 'Saputra', 'Pratama', 'Wibowo', 'Nugroho', 'Setiawan', 'Susanto', 'Hartono', 'Purnama', 'Wahyudi', 'Syahputra', 'Siregar', 'Lubis', 'Simanjuntak', 'Nasution', 'Gultom']
const products = ['Kulkas 2 Pintu', 'AC 1 PK', 'Mesin Cuci Front Load', 'TV LED 50 Inch', 'Microwave', 'Air Purifier', 'Vacuum Cleaner', 'Water Heater', 'Kipas Angin', 'Blender']
const statuses: CustomerStatus[] = ['Inquiry', 'Purchased']
const conversions: Conversion[] = ['Potential', 'Prospect', 'Hot Prospect']

// Generate Dates spanning last 30 days
const now = new Date()
const past30Days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(now.getDate() - i)
  return d
})

let historyIdCounter = 1

for (let i = 1; i <= 500; i++) {
  const gender: Gender = Math.random() > 0.5 ? 'Male' : 'Female'
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const fullName = firstName + ' ' + lastName
  
  const empIndex = Math.floor(Math.random() * mockEmployees.length)
  const employee = mockEmployees[empIndex]

  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  // If Purchased, it's mostly Hot Prospect. Otherwise random.
  let conversion: Conversion
  if (status === 'Purchased') {
    conversion = 'Hot Prospect'
  } else {
    conversion = conversions[Math.floor(Math.random() * conversions.length)]
  }

  const dateObj = past30Days[Math.floor(Math.random() * past30Days.length)]
  const customerDate = dateObj.toISOString().split('T')[0]

  const customer: Customer = {
    id: 'c' + i,
    employeeId: employee.id,
    employee: employee,
    customerDate,
    fullName,
    gender,
    phone: '0812' + Math.floor(10000000 + Math.random() * 90000000),
    socialMedia: '@' + firstName.toLowerCase() + '_' + lastName.toLowerCase(),
    product: Math.random() > 0.2 ? products[Math.floor(Math.random() * products.length)] : undefined,
    quantity: Math.random() > 0.2 ? Math.floor(1 + Math.random() * 3) : undefined,
    currentConversion: conversion,
    customerStatus: status,
    isActive: true,
    createdAt: dateObj.toISOString(),
    updatedAt: new Date(dateObj.getTime() + 86400000).toISOString()
  }

  // Generate mock history
  const historyCount = Math.floor(Math.random() * 4) // 0 to 3 history records
  if (historyCount > 0) {
    let lastFollowUpDate = dateObj
    for (let h = 0; h < historyCount; h++) {
      lastFollowUpDate = new Date(lastFollowUpDate.getTime() + 86400000 * (h + 1)) // add some days
      if (lastFollowUpDate > now) lastFollowUpDate = now // clamp to now

      mockFollowUpHistory.push({
        id: 'h' + historyIdCounter++,
        customerId: customer.id,
        employeeId: employee.id,
        employee,
        date: lastFollowUpDate.toISOString(),
        conversion: conversions[Math.floor(Math.random() * conversions.length)], // historical conversion
        notes: 'Follow up ke-' + (h+1) + '. Pelanggan menanyakan spesifikasi detail produk.',
      })
      customer.lastFollowUp = lastFollowUpDate.toISOString()
    }
  }

  mockCustomers.push(customer)
}

// Sort newest first
mockCustomers.sort((a, b) => new Date(b.customerDate).getTime() - new Date(a.customerDate).getTime())
mockFollowUpHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

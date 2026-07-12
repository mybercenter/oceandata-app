import type { Area } from '../types/area.types'

const generateDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

export const mockAreas: Area[] = [
  { id: 'a1', code: 'JATIM1', name: 'Jawa Timur 1 (Surabaya)', status: 'active', createdAt: generateDate(120), updatedAt: generateDate(2), stats: { totalStores: 45, totalEmployees: 120, totalCustomers: 1540 } },
  { id: 'a2', code: 'JATIM2', name: 'Jawa Timur 2 (Malang)', status: 'active', createdAt: generateDate(118), updatedAt: generateDate(5), stats: { totalStores: 32, totalEmployees: 85, totalCustomers: 920 } },
  { id: 'a3', code: 'JATENG1', name: 'Jawa Tengah 1 (Semarang)', status: 'active', createdAt: generateDate(115), updatedAt: generateDate(10), stats: { totalStores: 38, totalEmployees: 110, totalCustomers: 1250 } },
  { id: 'a4', code: 'JATENG2', name: 'Jawa Tengah 2 (Solo)', status: 'active', createdAt: generateDate(110), updatedAt: generateDate(1), stats: { totalStores: 25, totalEmployees: 70, totalCustomers: 850 } },
  { id: 'a5', code: 'JABAR1', name: 'Jawa Barat 1 (Bandung)', status: 'active', createdAt: generateDate(105), updatedAt: generateDate(20), stats: { totalStores: 55, totalEmployees: 150, totalCustomers: 2100 } },
  { id: 'a6', code: 'JABAR2', name: 'Jawa Barat 2 (Cirebon)', status: 'active', createdAt: generateDate(100), updatedAt: generateDate(15), stats: { totalStores: 28, totalEmployees: 75, totalCustomers: 780 } },
  { id: 'a7', code: 'DKI1', name: 'DKI Jakarta 1 (Pusat/Utara)', status: 'active', createdAt: generateDate(95), updatedAt: generateDate(2), stats: { totalStores: 65, totalEmployees: 200, totalCustomers: 3500 } },
  { id: 'a8', code: 'DKI2', name: 'DKI Jakarta 2 (Selatan/Timur)', status: 'active', createdAt: generateDate(90), updatedAt: generateDate(5), stats: { totalStores: 72, totalEmployees: 215, totalCustomers: 3800 } },
  { id: 'a9', code: 'BANTEN', name: 'Banten (Tangerang)', status: 'active', createdAt: generateDate(85), updatedAt: generateDate(12), stats: { totalStores: 42, totalEmployees: 130, totalCustomers: 1650 } },
  { id: 'a10', code: 'DIY', name: 'DI Yogyakarta', status: 'active', createdAt: generateDate(80), updatedAt: generateDate(8), stats: { totalStores: 20, totalEmployees: 55, totalCustomers: 650 } },
  { id: 'a11', code: 'BALI', name: 'Bali', status: 'active', createdAt: generateDate(75), updatedAt: generateDate(1), stats: { totalStores: 35, totalEmployees: 95, totalCustomers: 1100 } },
  { id: 'a12', code: 'NTB', name: 'Nusa Tenggara Barat', status: 'inactive', createdAt: generateDate(70), updatedAt: generateDate(25), stats: { totalStores: 12, totalEmployees: 35, totalCustomers: 420 } },
  { id: 'a13', code: 'NTT', name: 'Nusa Tenggara Timur', status: 'inactive', createdAt: generateDate(65), updatedAt: generateDate(30), stats: { totalStores: 8, totalEmployees: 25, totalCustomers: 280 } },
  { id: 'a14', code: 'SULSEL', name: 'Sulawesi Selatan', status: 'active', createdAt: generateDate(60), updatedAt: generateDate(4), stats: { totalStores: 28, totalEmployees: 85, totalCustomers: 890 } },
  { id: 'a15', code: 'SULUT', name: 'Sulawesi Utara', status: 'active', createdAt: generateDate(55), updatedAt: generateDate(11), stats: { totalStores: 18, totalEmployees: 50, totalCustomers: 610 } },
  { id: 'a16', code: 'KALTIM', name: 'Kalimantan Timur', status: 'active', createdAt: generateDate(50), updatedAt: generateDate(6), stats: { totalStores: 24, totalEmployees: 70, totalCustomers: 750 } },
  { id: 'a17', code: 'KALBAR', name: 'Kalimantan Barat', status: 'active', createdAt: generateDate(45), updatedAt: generateDate(18), stats: { totalStores: 15, totalEmployees: 45, totalCustomers: 520 } },
  { id: 'a18', code: 'KALSEL', name: 'Kalimantan Selatan', status: 'active', createdAt: generateDate(40), updatedAt: generateDate(9), stats: { totalStores: 19, totalEmployees: 55, totalCustomers: 590 } },
  { id: 'a19', code: 'SUMUT1', name: 'Sumatera Utara 1 (Medan)', status: 'active', createdAt: generateDate(35), updatedAt: generateDate(2), stats: { totalStores: 48, totalEmployees: 140, totalCustomers: 1750 } },
  { id: 'a20', code: 'SUMUT2', name: 'Sumatera Utara 2', status: 'active', createdAt: generateDate(30), updatedAt: generateDate(14), stats: { totalStores: 22, totalEmployees: 65, totalCustomers: 810 } },
  { id: 'a21', code: 'SUMBAR', name: 'Sumatera Barat', status: 'active', createdAt: generateDate(28), updatedAt: generateDate(5), stats: { totalStores: 26, totalEmployees: 75, totalCustomers: 920 } },
  { id: 'a22', code: 'RIAU', name: 'Riau', status: 'active', createdAt: generateDate(25), updatedAt: generateDate(7), stats: { totalStores: 31, totalEmployees: 90, totalCustomers: 1050 } },
  { id: 'a23', code: 'KEPRI', name: 'Kepulauan Riau', status: 'inactive', createdAt: generateDate(22), updatedAt: generateDate(20), stats: { totalStores: 14, totalEmployees: 40, totalCustomers: 480 } },
  { id: 'a24', code: 'SUMSEL', name: 'Sumatera Selatan', status: 'active', createdAt: generateDate(20), updatedAt: generateDate(3), stats: { totalStores: 29, totalEmployees: 80, totalCustomers: 980 } },
  { id: 'a25', code: 'LAMPUNG', name: 'Lampung', status: 'active', createdAt: generateDate(18), updatedAt: generateDate(1), stats: { totalStores: 27, totalEmployees: 78, totalCustomers: 950 } },
  { id: 'a26', code: 'JAMBI', name: 'Jambi', status: 'active', createdAt: generateDate(15), updatedAt: generateDate(10), stats: { totalStores: 16, totalEmployees: 48, totalCustomers: 550 } },
  { id: 'a27', code: 'BENGKULU', name: 'Bengkulu', status: 'inactive', createdAt: generateDate(12), updatedAt: generateDate(12), stats: { totalStores: 10, totalEmployees: 30, totalCustomers: 320 } },
  { id: 'a28', code: 'BABEL', name: 'Bangka Belitung', status: 'inactive', createdAt: generateDate(10), updatedAt: generateDate(10), stats: { totalStores: 11, totalEmployees: 32, totalCustomers: 350 } },
  { id: 'a29', code: 'PAPUA', name: 'Papua', status: 'active', createdAt: generateDate(8), updatedAt: generateDate(4), stats: { totalStores: 15, totalEmployees: 45, totalCustomers: 480 } },
  { id: 'a30', code: 'MALUKU', name: 'Maluku', status: 'inactive', createdAt: generateDate(5), updatedAt: generateDate(5), stats: { totalStores: 9, totalEmployees: 25, totalCustomers: 290 } },
]

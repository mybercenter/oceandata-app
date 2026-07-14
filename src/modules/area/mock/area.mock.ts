import type { Area } from '../types/area.types'

const generateDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

export const mockAreas: Area[] = [
  { id: 'a1', code: 'JATIM1', name: 'Jawa Timur 1 (Surabaya)', is_active: true, created_at: generateDate(120), updated_at: generateDate(2), stats: { totalStores: 45, totalEmployees: 120, totalCustomers: 1540 } },
  { id: 'a2', code: 'JATIM2', name: 'Jawa Timur 2 (Malang)', is_active: true, created_at: generateDate(118), updated_at: generateDate(5), stats: { totalStores: 32, totalEmployees: 85, totalCustomers: 920 } },
  { id: 'a3', code: 'JATENG1', name: 'Jawa Tengah 1 (Semarang)', is_active: true, created_at: generateDate(115), updated_at: generateDate(10), stats: { totalStores: 38, totalEmployees: 110, totalCustomers: 1250 } },
  { id: 'a4', code: 'JATENG2', name: 'Jawa Tengah 2 (Solo)', is_active: true, created_at: generateDate(110), updated_at: generateDate(1), stats: { totalStores: 25, totalEmployees: 70, totalCustomers: 850 } },
  { id: 'a5', code: 'JABAR1', name: 'Jawa Barat 1 (Bandung)', is_active: true, created_at: generateDate(105), updated_at: generateDate(20), stats: { totalStores: 55, totalEmployees: 150, totalCustomers: 2100 } },
  { id: 'a6', code: 'JABAR2', name: 'Jawa Barat 2 (Cirebon)', is_active: true, created_at: generateDate(100), updated_at: generateDate(15), stats: { totalStores: 28, totalEmployees: 75, totalCustomers: 780 } },
  { id: 'a7', code: 'DKI1', name: 'DKI Jakarta 1 (Pusat/Utara)', is_active: true, created_at: generateDate(95), updated_at: generateDate(2), stats: { totalStores: 65, totalEmployees: 200, totalCustomers: 3500 } },
  { id: 'a8', code: 'DKI2', name: 'DKI Jakarta 2 (Selatan/Timur)', is_active: true, created_at: generateDate(90), updated_at: generateDate(5), stats: { totalStores: 72, totalEmployees: 215, totalCustomers: 3800 } },
  { id: 'a9', code: 'BANTEN', name: 'Banten (Tangerang)', is_active: true, created_at: generateDate(85), updated_at: generateDate(12), stats: { totalStores: 42, totalEmployees: 130, totalCustomers: 1650 } },
  { id: 'a10', code: 'DIY', name: 'DI Yogyakarta', is_active: true, created_at: generateDate(80), updated_at: generateDate(8), stats: { totalStores: 20, totalEmployees: 55, totalCustomers: 650 } },
  { id: 'a11', code: 'BALI', name: 'Bali', is_active: true, created_at: generateDate(75), updated_at: generateDate(1), stats: { totalStores: 35, totalEmployees: 95, totalCustomers: 1100 } },
  { id: 'a12', code: 'NTB', name: 'Nusa Tenggara Barat', is_active: false, created_at: generateDate(70), updated_at: generateDate(25), stats: { totalStores: 12, totalEmployees: 35, totalCustomers: 420 } },
  { id: 'a13', code: 'NTT', name: 'Nusa Tenggara Timur', is_active: false, created_at: generateDate(65), updated_at: generateDate(30), stats: { totalStores: 8, totalEmployees: 25, totalCustomers: 280 } },
  { id: 'a14', code: 'SULSEL', name: 'Sulawesi Selatan', is_active: true, created_at: generateDate(60), updated_at: generateDate(4), stats: { totalStores: 28, totalEmployees: 85, totalCustomers: 890 } },
  { id: 'a15', code: 'SULUT', name: 'Sulawesi Utara', is_active: true, created_at: generateDate(55), updated_at: generateDate(11), stats: { totalStores: 18, totalEmployees: 50, totalCustomers: 610 } },
  { id: 'a16', code: 'KALTIM', name: 'Kalimantan Timur', is_active: true, created_at: generateDate(50), updated_at: generateDate(6), stats: { totalStores: 24, totalEmployees: 70, totalCustomers: 750 } },
  { id: 'a17', code: 'KALBAR', name: 'Kalimantan Barat', is_active: true, created_at: generateDate(45), updated_at: generateDate(18), stats: { totalStores: 15, totalEmployees: 45, totalCustomers: 520 } },
  { id: 'a18', code: 'KALSEL', name: 'Kalimantan Selatan', is_active: true, created_at: generateDate(40), updated_at: generateDate(9), stats: { totalStores: 19, totalEmployees: 55, totalCustomers: 590 } },
  { id: 'a19', code: 'SUMUT1', name: 'Sumatera Utara 1 (Medan)', is_active: true, created_at: generateDate(35), updated_at: generateDate(2), stats: { totalStores: 48, totalEmployees: 140, totalCustomers: 1750 } },
  { id: 'a20', code: 'SUMUT2', name: 'Sumatera Utara 2', is_active: true, created_at: generateDate(30), updated_at: generateDate(14), stats: { totalStores: 22, totalEmployees: 65, totalCustomers: 810 } },
  { id: 'a21', code: 'SUMBAR', name: 'Sumatera Barat', is_active: true, created_at: generateDate(28), updated_at: generateDate(5), stats: { totalStores: 26, totalEmployees: 75, totalCustomers: 920 } },
  { id: 'a22', code: 'RIAU', name: 'Riau', is_active: true, created_at: generateDate(25), updated_at: generateDate(7), stats: { totalStores: 31, totalEmployees: 90, totalCustomers: 1050 } },
  { id: 'a23', code: 'KEPRI', name: 'Kepulauan Riau', is_active: false, created_at: generateDate(22), updated_at: generateDate(20), stats: { totalStores: 14, totalEmployees: 40, totalCustomers: 480 } },
  { id: 'a24', code: 'SUMSEL', name: 'Sumatera Selatan', is_active: true, created_at: generateDate(20), updated_at: generateDate(3), stats: { totalStores: 29, totalEmployees: 80, totalCustomers: 980 } },
  { id: 'a25', code: 'LAMPUNG', name: 'Lampung', is_active: true, created_at: generateDate(18), updated_at: generateDate(1), stats: { totalStores: 27, totalEmployees: 78, totalCustomers: 950 } },
  { id: 'a26', code: 'JAMBI', name: 'Jambi', is_active: true, created_at: generateDate(15), updated_at: generateDate(10), stats: { totalStores: 16, totalEmployees: 48, totalCustomers: 550 } },
  { id: 'a27', code: 'BENGKULU', name: 'Bengkulu', is_active: false, created_at: generateDate(12), updated_at: generateDate(12), stats: { totalStores: 10, totalEmployees: 30, totalCustomers: 320 } },
  { id: 'a28', code: 'BABEL', name: 'Bangka Belitung', is_active: false, created_at: generateDate(10), updated_at: generateDate(10), stats: { totalStores: 11, totalEmployees: 32, totalCustomers: 350 } },
  { id: 'a29', code: 'PAPUA', name: 'Papua', is_active: true, created_at: generateDate(8), updated_at: generateDate(4), stats: { totalStores: 15, totalEmployees: 45, totalCustomers: 480 } },
  { id: 'a30', code: 'MALUKU', name: 'Maluku', is_active: false, created_at: generateDate(5), updated_at: generateDate(5), stats: { totalStores: 9, totalEmployees: 25, totalCustomers: 290 } },
]

export const mockSettings = {
  general: {
    appName: 'OceanData CRM',
    timezone: 'Asia/Jakarta',
    language: 'English',
    dateFormat: 'DD/MM/YYYY'
  },
  company: {
    name: 'OceanData Corporation',
    address: 'Jl. Sudirman Kav 52-53, SCBD, Jakarta Selatan',
    phone: '+62 812 3456 7890',
    email: 'hello@oceandata.id',
    website: 'https://oceandata.id'
  },
  profile: {
    fullName: 'Admin Super User',
    username: 'admin',
    phone: '081222333444',
    email: 'admin@oceandata.id'
  },
  security: {
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: false
  },
  application: {
    rowsPerPage: 10,
    defaultDashboard: 'Admin',
    defaultTheme: 'Light',
    emailNotifications: true,
    pushNotifications: false
  },
  whatsapp: {
    businessNumber: '+62 811 1111 2222',
    webhookUrl: 'https://api.oceandata.id/webhooks/whatsapp',
    isConnected: true,
    lastSync: new Date().toISOString()
  },
  audit: {
    createdBy: 'System Installer',
    updatedBy: 'Admin Super User',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
}

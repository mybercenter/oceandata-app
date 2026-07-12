import type { KpiMetric, ActivityTimelineItem, RecentCustomer, RecentFollowUp, TopPromotor } from '../types/dashboard.types'

// Reusable mock avatar generators
const getAvatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`

// Mock KPIs
export const adminKpis: KpiMetric[] = [
  { title: 'Total Areas', value: '5', trend: 'up', percentage: 0, icon: 'MapIcon', color: 'primary' },
  { title: 'Total Stores', value: '12', trend: 'up', percentage: 20, icon: 'BuildingStorefrontIcon', color: 'info' },
  { title: 'Total Employees', value: '45', trend: 'up', percentage: 12.5, icon: 'UsersIcon', color: 'warning' },
  { title: 'Total Customers', value: '1,284', trend: 'up', percentage: 8.2, icon: 'UserGroupIcon', color: 'success' },
]

export const statusKpis: KpiMetric[] = [
  { title: 'Inquiry', value: '450', trend: 'down', percentage: -2.4, icon: 'QuestionMarkCircleIcon', color: 'info' },
  { title: 'Potential', value: '320', trend: 'up', percentage: 5.1, icon: 'LightBulbIcon', color: 'warning' },
  { title: 'Prospect', value: '180', trend: 'up', percentage: 12.3, icon: 'ChartBarIcon', color: 'primary' },
  { title: 'Hot Prospect', value: '85', trend: 'up', percentage: 24.5, icon: 'FireIcon', color: 'danger' },
  { title: 'Purchased', value: '249', trend: 'up', percentage: 18.2, icon: 'CheckBadgeIcon', color: 'success' },
]

export const promotorKpis: KpiMetric[] = [
  { title: 'Today\'s Customer', value: '12', trend: 'up', percentage: 15, icon: 'UserPlusIcon', color: 'primary' },
  { title: 'Today\'s Follow Up', value: '24', trend: 'neutral', percentage: 0, icon: 'ChatBubbleLeftRightIcon', color: 'info' },
  { title: 'Purchased', value: '5', trend: 'up', percentage: 20, icon: 'CheckBadgeIcon', color: 'success' },
  { title: 'Hot Prospect', value: '8', trend: 'up', percentage: 12, icon: 'FireIcon', color: 'danger' },
]

// Mock Recent Customers
export const recentCustomers: RecentCustomer[] = [
  { id: 'C001', name: 'John Doe', avatar: getAvatar('John'), product: 'Premium Plan', status: 'Purchased', promotor: 'Sarah Smith', date: '2026-07-12' },
  { id: 'C002', name: 'Alice Johnson', avatar: getAvatar('Alice'), product: 'Basic Plan', status: 'Hot Prospect', promotor: 'Mike Brown', date: '2026-07-12' },
  { id: 'C003', name: 'Robert Fox', avatar: getAvatar('Robert'), product: 'Enterprise', status: 'Prospect', promotor: 'Sarah Smith', date: '2026-07-11' },
  { id: 'C004', name: 'Eleanor Pena', avatar: getAvatar('Eleanor'), product: 'Premium Plan', status: 'Potential', promotor: 'Jenny Wilson', date: '2026-07-11' },
  { id: 'C005', name: 'Wade Warren', avatar: getAvatar('Wade'), product: 'Basic Plan', status: 'Inquiry', promotor: 'Mike Brown', date: '2026-07-10' },
]

// Mock Recent Follow Ups
export const recentFollowUps: RecentFollowUp[] = [
  { id: 'F001', customerName: 'John Doe', templateUsed: 'Greeting Day 1', conversionStatus: 'Positive', hasEvidence: true, followUpDate: '2026-07-12' },
  { id: 'F002', customerName: 'Alice Johnson', templateUsed: 'Promo Follow Up', conversionStatus: 'Neutral', hasEvidence: false, followUpDate: '2026-07-12' },
  { id: 'F003', customerName: 'Robert Fox', templateUsed: 'Technical Support', conversionStatus: 'Positive', hasEvidence: true, followUpDate: '2026-07-11' },
]

// Mock Top Promotors
export const topPromotors: TopPromotor[] = [
  { id: 'P001', name: 'Sarah Smith', avatar: getAvatar('Sarah'), store: 'Grand Mall', area: 'Jakarta', conversionRate: 68, progress: 68 },
  { id: 'P002', name: 'Mike Brown', avatar: getAvatar('Mike'), store: 'Plaza Center', area: 'Surabaya', conversionRate: 54, progress: 54 },
  { id: 'P003', name: 'Jenny Wilson', avatar: getAvatar('Jenny'), store: 'City Square', area: 'Bandung', conversionRate: 42, progress: 42 },
]

// Mock Timeline
export const activityTimeline: ActivityTimelineItem[] = [
  { id: 'T1', type: 'purchased', title: 'Plan Upgraded', description: 'John Doe upgraded to Premium', timestamp: '10 mins ago', user: 'Sarah' },
  { id: 'T2', type: 'follow_up', title: 'Follow Up Completed', description: 'Called Alice regarding promo', timestamp: '2 hours ago', user: 'Mike' },
  { id: 'T3', type: 'customer_added', title: 'New Customer', description: 'Robert Fox registered via Web', timestamp: '5 hours ago', user: 'System' },
  { id: 'T4', type: 'reminder', title: 'Task Reminder', description: 'Follow up with Eleanor', timestamp: '1 day ago', user: 'Jenny' },
]

// Mock Chart Data
export const chartData = {
  customerTrend: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    series: [
      { name: 'New Customers', data: [31, 40, 28, 51, 42, 109, 100] },
      { name: 'Purchased', data: [11, 32, 45, 32, 34, 52, 41] }
    ]
  },
  conversionDistribution: {
    labels: ['Inquiry', 'Potential', 'Prospect', 'Hot Prospect', 'Purchased'],
    series: [450, 320, 180, 85, 249]
  },
  performanceByArea: {
    categories: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bali'],
    series: [
      { name: 'Target', data: [400, 300, 200, 150, 100] },
      { name: 'Achieved', data: [350, 310, 180, 120, 95] }
    ]
  }
}

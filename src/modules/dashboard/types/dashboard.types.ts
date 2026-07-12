export interface KpiMetric {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  percentage: number;
  icon: string; // we'll use a string to represent the HeroIcon component name
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface ActivityTimelineItem {
  id: string;
  type: 'customer_added' | 'follow_up' | 'purchased' | 'reminder';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface RecentCustomer {
  id: string;
  name: string;
  avatar: string;
  product: string;
  status: 'Inquiry' | 'Potential' | 'Prospect' | 'Hot Prospect' | 'Purchased';
  promotor: string;
  date: string;
}

export interface RecentFollowUp {
  id: string;
  customerName: string;
  templateUsed: string;
  conversionStatus: string;
  hasEvidence: boolean;
  followUpDate: string;
}

export interface TopPromotor {
  id: string;
  name: string;
  avatar: string;
  store: string;
  area: string;
  conversionRate: number;
  progress: number;
}

export type DashboardRole = 'admin' | 'manager' | 'supervisor' | 'trainer' | 'sales' | 'promotor';

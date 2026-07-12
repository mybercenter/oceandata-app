export interface NavigationItem {
  title: string
  route?: string
  icon?: any // Heroicon component
  children?: NavigationItem[]
  permissions?: string[] // Future-proofing
}

export interface NavigationGroup {
  name: string
  items: NavigationItem[]
}

import {
  HomeIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneArrowUpRightIcon,
  ChartPieIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

export const navigationConfig: NavigationGroup[] = [
  {
    name: 'Dashboard',
    items: [
      {
        title: 'Dashboard',
        route: '/dashboard',
        icon: HomeIcon,
      }
    ]
  },
  {
    name: 'Master',
    items: [
      {
        title: 'Area',
        route: '/area',
        icon: MapPinIcon,
      },
      {
        title: 'Store',
        route: '/store',
        icon: BuildingStorefrontIcon,
      },
      {
        title: 'Employee',
        route: '/employee',
        icon: UserGroupIcon,
      },
      {
        title: 'User',
        route: '/user',
        icon: UsersIcon,
        children: [
          {
            title: 'Users',
            route: '/user/users',
            icon: UserCircleIcon
          },
          {
            title: 'Roles',
            route: '/user/roles',
            icon: ShieldCheckIcon
          },
          {
            title: 'Permissions',
            route: '/user/permissions',
            icon: ShieldCheckIcon
          }
        ]
      },
      {
        title: 'Customer',
        route: '/customer',
        icon: UserCircleIcon,
      },
      {
        title: 'Message Template',
        route: '/message-template',
        icon: ChatBubbleLeftRightIcon,
      }
    ]
  },
  {
    name: 'Operations',
    items: [
      {
        title: 'Customers',
        route: '/operations/customers',
        icon: UserCircleIcon,
      },
      {
        title: 'Follow Up',
        route: '/follow-up',
        icon: PhoneArrowUpRightIcon,
      }
    ]
  },
  {
    name: 'Reports',
    items: [
      {
        title: 'Dashboard Report',
        route: '/report/dashboard',
        icon: ChartPieIcon,
      },
      {
        title: 'Customer Report',
        route: '/report/customer',
        icon: ChartBarIcon,
      },
      {
        title: 'Follow Up Report',
        route: '/report/follow-up',
        icon: ChartBarIcon,
      }
    ]
  },
  {
    name: 'System',
    items: [
      {
        title: 'Settings',
        route: '/settings',
        icon: Cog6ToothIcon,
      }
    ]
  }
]

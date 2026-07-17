export interface NavigationItem {
  title: string
  route?: string
  icon?: any // Heroicon component
  children?: NavigationItem[]
  permissions?: string[] // Future-proofing
  roles?: string[] // Roles allowed to see this menu
}

export interface NavigationGroup {
  name: string
  roles?: string[] // Roles allowed to see this group
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
        permissions: ['dashboard.view']
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
        permissions: ['area.view']
      },
      {
        title: 'Store',
        route: '/store',
        icon: BuildingStorefrontIcon,
        permissions: ['store.view']
      },
      {
        title: 'Employee',
        route: '/employee',
        icon: UserGroupIcon,
        permissions: ['employee.view']
      },
      {
        title: 'User',
        route: '/user',
        icon: UsersIcon,
        children: [
          {
            title: 'Users',
            route: '/user/users',
            icon: UserCircleIcon,
            permissions: ['user.view']
          },
          {
            title: 'Roles',
            route: '/user/roles',
            icon: ShieldCheckIcon,
            permissions: ['role.view']
          },
          {
            title: 'Permissions',
            route: '/user/permissions',
            icon: ShieldCheckIcon,
            permissions: ['permission.view']
          }
        ]
      },
      {
        title: 'Message Template',
        route: '/message-template',
        icon: ChatBubbleLeftRightIcon,
        permissions: ['message_template.view']
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
        permissions: ['customer.view']
      },
      {
        title: 'Follow Up',
        route: '/follow-up',
        icon: PhoneArrowUpRightIcon,
        permissions: ['follow_up.view']
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
        permissions: ['report_dashboard.view']
      },
      {
        title: 'Customer Report',
        route: '/report/customer',
        icon: ChartBarIcon,
        permissions: ['report_customer.view']
      },
      {
        title: 'Follow Up Report',
        route: '/report/follow-up',
        icon: ChartBarIcon,
        permissions: ['report_follow_up.view']
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
        permissions: ['setting.view']
      }
    ]
  }
]

import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/app/layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: { name: 'dashboard' }
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/modules/dashboard/pages/DashboardPage.vue'),
          meta: { 
            title: 'Dashboard',
            breadcrumbs: [{ title: 'Dashboard' }]
          }
        },
        {
          path: 'area',
          name: 'area',
          component: () => import('@/modules/area/pages/AreaPage.vue'),
          meta: { title: 'Area', breadcrumbs: [{ title: 'Master' }, { title: 'Area' }] }
        },
        {
          path: 'store',
          name: 'store',
          component: () => import('@/modules/store/pages/StorePage.vue'),
          meta: { title: 'Store', breadcrumbs: [{ title: 'Master' }, { title: 'Store' }] }
        },
        {
          path: 'employee',
          name: 'employee',
          component: () => import('@/modules/employee/pages/EmployeePage.vue'),
          meta: { title: 'Employee', breadcrumbs: [{ title: 'Master' }, { title: 'Employee' }] }
        },
        {
          path: 'user/users',
          name: 'users',
          component: () => import('@/modules/user/pages/UserPage.vue'),
          meta: { title: 'Users', breadcrumbs: [{ title: 'Master' }, { title: 'User' }, { title: 'Users' }] }
        },
        {
          path: 'user/roles',
          name: 'roles',
          component: () => import('@/modules/role/pages/RolePage.vue'),
          meta: { title: 'Roles', breadcrumbs: [{ title: 'Master' }, { title: 'User' }, { title: 'Roles' }] }
        },
        {
          path: 'user/permissions',
          name: 'permissions',
          component: () => import('@/modules/role/pages/PermissionPage.vue'),
          meta: { title: 'Permissions', breadcrumbs: [{ title: 'Master' }, { title: 'User' }, { title: 'Permissions' }] }
        },
        {
          path: 'role/matrix',
          name: 'role-matrix',
          component: () => import('@/modules/role/pages/RolePermissionMatrixPage.vue'),
          meta: { title: 'Permission Matrix', breadcrumbs: [{ title: 'Master' }, { title: 'User' }, { title: 'Roles' }, { title: 'Matrix' }] }
        },
        {
          path: 'customer',
          name: 'customer',
          component: () => import('@/modules/customer/pages/CustomerPage.vue'),
          meta: { title: 'Customer', breadcrumbs: [{ title: 'Master' }, { title: 'Customer' }] }
        },
        {
          path: 'message-template',
          name: 'message-template',
          component: () => import('@/modules/message-template/pages/MessageTemplatePage.vue'),
          meta: { title: 'Message Template', breadcrumbs: [{ title: 'Master' }, { title: 'Message Template' }] }
        },
        {
          path: 'operations/customers',
          name: 'operations-customers',
          component: () => import('@/modules/customer/pages/CustomerPage.vue'),
          meta: { title: 'Customers', breadcrumbs: [{ title: 'Operations' }, { title: 'Customers' }] }
        },
        {
          path: 'follow-up',
          name: 'follow-up',
          component: () => import('@/modules/customer-follow-up/pages/FollowUpPage.vue'),
          meta: { title: 'Follow Up', breadcrumbs: [{ title: 'Operations' }, { title: 'Follow Up' }] }
        },
        {
          path: 'report/dashboard',
          name: 'report-dashboard',
          component: () => import('@/modules/report/pages/ReportDashboardPage.vue'),
          meta: { title: 'Dashboard Report', breadcrumbs: [{ title: 'Reports' }, { title: 'Dashboard Report' }] }
        },
        {
          path: 'report/customer',
          name: 'report-customer',
          component: () => import('@/modules/report/pages/ReportCustomerPage.vue'),
          meta: { title: 'Customer Report', breadcrumbs: [{ title: 'Reports' }, { title: 'Customer Report' }] }
        },
        {
          path: 'report/follow-up',
          name: 'report-follow-up',
          component: () => import('@/modules/report/pages/ReportFollowUpPage.vue'),
          meta: { title: 'Follow Up Report', breadcrumbs: [{ title: 'Reports' }, { title: 'Follow Up Report' }] }
        },
        {
          path: 'report/employee',
          name: 'report-employee',
          component: () => import('@/modules/report/pages/ReportEmployeePage.vue'),
          meta: { title: 'Employee Performance', breadcrumbs: [{ title: 'Reports' }, { title: 'Employee Performance' }] }
        },
        {
          path: 'report/area',
          name: 'report-area',
          component: () => import('@/modules/report/pages/ReportAreaPage.vue'),
          meta: { title: 'Area Performance', breadcrumbs: [{ title: 'Reports' }, { title: 'Area Performance' }] }
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/modules/profile/pages/ProfilePage.vue'),
          meta: { title: 'My Profile', breadcrumbs: [{ title: 'Profile' }] }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/modules/settings/pages/SettingsPage.vue'),
          meta: { title: 'Settings', breadcrumbs: [{ title: 'System' }, { title: 'Settings' }] }
        }
      ]
    },
    
    // Auth Routes
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/modules/auth/pages/LoginPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/auth/forgot-password',
      name: 'forgot-password',
      component: () => import('@/modules/auth/pages/ForgotPasswordPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/auth/reset-password',
      name: 'reset-password',
      component: () => import('@/modules/auth/pages/ResetPasswordPage.vue'),
      meta: { requiresGuest: true }
    },

    // Error Routes
    {
      path: '/401',
      name: 'error-401',
      component: () => import('@/modules/error/pages/Error401Page.vue')
    },
    {
      path: '/403',
      name: 'error-403',
      component: () => import('@/modules/error/pages/Error403Page.vue')
    },
    {
      path: '/500',
      name: 'error-500',
      component: () => import('@/modules/error/pages/Error500Page.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error-404',
      component: () => import('@/modules/error/pages/Error404Page.vue')
    }
  ]
})

// Navigation Guard for Authentication
router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()
  
  const isAuthenticated = await authStore.checkAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if trying to access a protected route without being authenticated
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect to dashboard if trying to access guest routes (like login) while authenticated
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router


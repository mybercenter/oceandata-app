import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()
  const { user, employee, permissions, areas, isAuthenticated, loading } = storeToRefs(store)

  return {
    // State
    user,
    employee,
    permissions,
    areas,
    isAuthenticated,
    loading,

    // Actions
    login: store.login,
    logout: store.logout,
    fetchProfile: store.fetchProfile,
    checkAuth: store.checkAuth,
    
    // Helpers
    hasPermission(permission: string): boolean {
      return store.permissions.includes(permission)
    },
    
    hasAnyPermission(requiredPermissions: string[]): boolean {
      return requiredPermissions.some(permission => store.permissions.includes(permission))
    },
    
    hasAllPermissions(requiredPermissions: string[]): boolean {
      return requiredPermissions.every(permission => store.permissions.includes(permission))
    }
  }
}

import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface BreadcrumbItem {
  title: string
  route?: string
}

export function useBreadcrumbs() {
  const route = useRoute()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const routeBreadcrumbs = route.meta.breadcrumbs as BreadcrumbItem[] | undefined
    if (routeBreadcrumbs) {
      return routeBreadcrumbs
    }
    
    // Fallback if no meta is provided, construct simple one from matched routes
    return route.matched
      .filter(record => record.meta && record.meta.title)
      .map(record => ({
        title: record.meta.title as string,
        route: record.path
      }))
  })

  return {
    breadcrumbs
  }
}

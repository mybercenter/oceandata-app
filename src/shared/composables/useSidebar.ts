import { ref, computed } from 'vue'

const isExpanded = ref(true)
const isMobileDrawerOpen = ref(false)

export function useSidebar() {
  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
  }

  const setExpanded = (value: boolean) => {
    isExpanded.value = value
  }

  const toggleMobileDrawer = () => {
    isMobileDrawerOpen.value = !isMobileDrawerOpen.value
  }

  const setMobileDrawer = (value: boolean) => {
    isMobileDrawerOpen.value = value
  }

  return {
    isExpanded: computed(() => isExpanded.value),
    isMobileDrawerOpen: computed(() => isMobileDrawerOpen.value),
    toggleExpanded,
    setExpanded,
    toggleMobileDrawer,
    setMobileDrawer
  }
}

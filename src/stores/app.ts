import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const drawer = ref(true)
  const loading = ref(false)
  const breadcrumbs = ref<Array<{ title: string; to?: string }>>([])

  const toggleDrawer = () => {
    drawer.value = !drawer.value
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setBreadcrumbs = (items: Array<{ title: string; to?: string }>) => {
    breadcrumbs.value = items
  }

  return {
    drawer,
    loading,
    breadcrumbs,
    toggleDrawer,
    setLoading,
    setBreadcrumbs
  }
})

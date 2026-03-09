import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: true,
    loading: false,
    breadcrumbs: [] as Array<{ title: string; to?: string }>,
  }),

  getters: {
    isDrawerOpen(): boolean {
      return this.drawer
    },

    isLoading(): boolean {
      return this.loading
    },
  },

  actions: {
    toggleDrawer(): void {
      this.drawer = !this.drawer
    },

    setLoading(value: boolean): void {
      this.loading = value
    },

    setBreadcrumbs(items: Array<{ title: string; to?: string }>): void {
      this.breadcrumbs = items
    },
  },
})

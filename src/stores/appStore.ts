import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    navigation: true,
    loading: false,
    breadcrumbs: [] as Array<{ title: string; to?: string }>,
  }),

  getters: {
    isNavigationOpen(): boolean {
      return this.navigation;
    },

    isLoading(): boolean {
      return this.loading;
    },
  },

  actions: {
    toggleNavigation(): void {
      this.navigation = !this.navigation;
    },

    setLoading(value: boolean): void {
      this.loading = value;
    },

    setBreadcrumbs(items: Array<{ title: string; to?: string }>): void {
      this.breadcrumbs = items;
    },
  },
});

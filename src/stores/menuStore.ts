import { defineStore } from 'pinia'
import { menuService } from '@/services/menuService'

export interface MenuItem {
  id: string
  title: string
  path: string
  icon?: string
  parentId?: string | null
  children?: MenuItem[]
  order?: number
}

interface MenuState {
  menus: MenuItem[]
  userRole: 'employee' | 'business_owner' | null
  businessOwnerId: string | null
  locationId: string | null
  loading: boolean
  initialized: boolean
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: [],
    userRole: null,
    businessOwnerId: null,
    locationId: null,
    loading: false,
    initialized: false,
  }),

  getters: {
    getUserMenus: state => {
      // Return top-level menus (those without a parentId)
      return state.menus.filter(menu => !menu.parentId)
    },

    getAllMenus: state => {
      return state.menus
    },

    getMenuByPath: state => {
      return (path: string) => {
        return state.menus.find(menu => menu.path === path)
      }
    },

    hasAccessToRoute: state => {
      return (path: string) => {
        return state.menus.some(menu => menu.path === path)
      }
    },
  },

  actions: {
    setMenus(menus: MenuItem[]) {
      this.menus = menus
      this.initialized = true
    },

    setUserRole(
      role: 'employee' | 'business_owner',
      businessOwnerId?: string,
      locationId?: string
    ) {
      this.userRole = role
      this.businessOwnerId = businessOwnerId || null
      this.locationId = locationId || null
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    clearMenus() {
      this.menus = []
      this.userRole = null
      this.businessOwnerId = null
      this.locationId = null
      this.initialized = false
    },

    async fetchUserMenus() {
      if (!this.userRole) {
        console.warn('Cannot fetch menus: user role not set')
        // Set empty menus as fallback
        this.setMenus([])
        return
      }

      this.setLoading(true)
      try {
        // Call API to get user-specific menu based on role and association
        // const response = await menuService.getUserMenus();
        // if (response.success && response.data !== undefined) {
        //   this.setMenus(response.data);
        // } else {
        //   console.error(
        //     "Failed to fetch user menus:",
        //     response.message || "Unknown error",
        //   );
        //   // Fallback to empty menu array
        //   this.setMenus([]);
        // }
      } catch (error) {
        console.error('Error fetching user menus:', error)
        // Fallback to empty menu array
        this.setMenus([])

        // Optionally show user-friendly error notification
        // You can integrate with your notification system here
        console.error('无法加载菜单，请稍后重试') // Log error instead of showing alert
      } finally {
        this.setLoading(false)
      }
    },
  },
})

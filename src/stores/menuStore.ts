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
  businessOwnerId: string | null
  locationId: string | null
  loading: boolean
  initialized: boolean
}

// 从localStorage加载菜单数据
const loadMenusFromStorage = (): MenuItem[] => {
  try {
    const storedMenus = localStorage.getItem('userMenus')
    if (storedMenus) {
      return JSON.parse(storedMenus)
    }
  } catch (error) {
    console.error('Failed to load menus from storage:', error)
  }
  return []
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: loadMenusFromStorage(),
    businessOwnerId: null,
    locationId: null,
    loading: false,
    initialized: localStorage.getItem('userMenus') !== null,
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
      // 保存到localStorage
      try {
        localStorage.setItem('userMenus', JSON.stringify(menus))
      } catch (error) {
        console.error('Failed to save menus to storage:', error)
      }
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    clearMenus() {
      this.menus = []
      this.businessOwnerId = null
      this.locationId = null
      this.initialized = false
      // 清理localStorage中的菜单数据
      localStorage.removeItem('userMenus')
    },

    async fetchUserMenus() {
      this.setLoading(true)
      try {
        const response = await menuService.getUserMenus()
        if (response.success && Array.isArray(response.data)) {
          // 后端已经构建好了树形结构，直接转换为MenuItem格式
          const convertToMenuItem = (menu: any): MenuItem => {
            return {
              id: menu.pk?.toString() || '',
              title: menu.chineseName || menu.englishName || '',
              path: menu.path || '',
              icon: menu.icon || '',
              parentId: menu.parentId && menu.parentId !== 0 ? menu.parentId.toString() : null,
              order: menu.sortOrder || 0,
              children:
                menu.children && Array.isArray(menu.children)
                  ? menu.children.map(convertToMenuItem)
                  : undefined,
            }
          }

          const rootMenus: MenuItem[] = response.data.map(convertToMenuItem)

          this.setMenus(rootMenus)
        } else {
          console.error('Failed to fetch user menus:', response.message || 'Unknown error')
          // Fallback to empty menu array
          this.setMenus([])
        }
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

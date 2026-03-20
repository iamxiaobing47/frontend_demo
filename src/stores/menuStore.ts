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

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: [],
    businessOwnerId: null,
    locationId: null,
    loading: false,
    initialized: false,
  }),

  getters: {
    // 1. 获取顶级菜单项（无父级ID的菜单）
    getUserMenus: state => {
      return state.menus.filter(menu => !menu.parentId)
    },

    // 2. 获取所有菜单项
    getAllMenus: state => {
      return state.menus
    },

    // 3. 根据路径查找菜单项
    getMenuByPath: state => {
      return (path: string) => {
        return state.menus.find(menu => menu.path === path)
      }
    },

    // 4. 检查用户是否有路由访问权限
    hasAccessToRoute: state => {
      return (path: string) => {
        return state.menus.some(menu => menu.path === path)
      }
    },
  },

  actions: {
    // 5. 设置菜单数据并标记为已初始化
    setMenus(menus: MenuItem[]) {
      this.menus = menus
      this.initialized = true
    },

    // 6. 设置菜单加载状态
    setLoading(loading: boolean) {
      this.loading = loading
    },

    // 7. 清除所有菜单数据和状态
    clearMenus() {
      this.menus = []
      this.businessOwnerId = null
      this.locationId = null
      this.initialized = false
    },

    // 8. 从服务获取用户菜单并转换为标准格式
    async fetchUserMenus() {
      this.setLoading(true)
      try {
        const response = await menuService.getUserMenus()
        if (response.success && Array.isArray(response.data)) {
          const convertToMenuItem = (menu: any): MenuItem => {
            return {
              id: menu.pk?.toString() || '',
              title: menu.name || '',
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
          this.setMenus([])
        }
      } catch (error) {
        console.error('Error fetching user menus:', error)
        this.setMenus([])
        console.error('无法加载菜单，请稍后重试')
      } finally {
        this.setLoading(false)
      }
    },
  },

  persist: {
    key: 'menu',
    storage: sessionStorage,
  },
})

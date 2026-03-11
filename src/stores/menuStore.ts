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
      this.setLoading(true)
      try {
        const response = await menuService.getUserMenus()
        if (response.success && Array.isArray(response.data)) {
          // 转换 NavigationDTO 到 MenuItem 格式
          const convertedMenus: MenuItem[] = response.data.map(menu => ({
            id: menu.pk?.toString() || '',
            title: menu.chineseName || menu.englishName || '',
            path: menu.path || '',
            icon: menu.icon || '',
            parentId: menu.parentId ? menu.parentId.toString() : null,
            order: menu.sortOrder || 0,
            children: [],
          }))

          // 构建树形结构
          const menuMap = new Map<string, MenuItem>()
          const rootMenus: MenuItem[] = []

          // 首先将所有菜单放入map中
          convertedMenus.forEach(menu => {
            menuMap.set(menu.id, { ...menu, children: [] })
          })

          // 然后构建父子关系
          convertedMenus.forEach(menu => {
            const currentMenu = menuMap.get(menu.id)!
            if (!menu.parentId || menu.parentId === '0') {
              // 根节点
              rootMenus.push(currentMenu)
            } else {
              // 找到父节点
              const parent = menuMap.get(menu.parentId)
              if (parent) {
                if (!parent.children) {
                  parent.children = []
                }
                parent.children.push(currentMenu)
              }
            }
          })

          // Note: Backend already handles sorting via sortOrder field
          // The tree structure is built correctly based on parentId relationships
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

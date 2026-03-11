import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Eager load all pages
const modules = import.meta.glob('@/pages/**/*.vue', { eager: true })

// Title mapping remains for fallback
const titleMap: Record<string, string> = {
  HomePage: '首页',
  ProcessResultPage: '处理结果',
  ProjectListPage: '项目列表',
  UploadPage: '文件上传',
  ResultPage: '处理结果',
  TemplatePage: '模板下载',
}

// Define static routes that don't depend on user permissions
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { title: '登录', showInNav: false },
  },
]

// Main layout route with dynamic children
const mainLayoutRoute: RouteRecordRaw & { children: RouteRecordRaw[] } = {
  path: '/',
  component: () => import('@/layouts/MainLayout.vue'),
  children: [] as RouteRecordRaw[],
  meta: { requiresAuth: true },
}

// Combined routes
const routes: RouteRecordRaw[] = [...staticRoutes, mainLayoutRoute]

// Function to generate routes from menu data
export function generateRoutesFromMenus(menus: any[]) {
  // Clear existing dynamic routes
  mainLayoutRoute.children = []

  // Load all available components
  const pagesDir = modules as Record<string, any>

  // Add routes based on user's menu permissions
  menus.forEach(menu => {
    // Find the corresponding component
    let componentPath = ''
    let componentName = ''

    // Look for a page component that matches the menu path
    for (const path in pagesDir) {
      const fileName = path.split('/').pop()?.replace('.vue', '') || ''
      // Convert filename to lowercase and remove 'Page' to match menu path
      const normalizedFileName = fileName.toLowerCase().replace('page', '')

      if (normalizedFileName === menu.path.replace('/', '')) {
        componentPath = path
        componentName = fileName
        break
      }
    }

    // If we found a matching component, add the route
    if (componentPath && pagesDir[componentPath]) {
      const component = pagesDir[componentPath].default
      const metaTitle = titleMap[componentName] || menu.title || componentName.replace('Page', '')

      const route: RouteRecordRaw = {
        path: menu.path,
        name: componentName.toLowerCase().replace('page', ''),
        component,
        meta: {
          title: metaTitle,
          showInNav: true,
          requiresAuth: true,
        },
      }

      // Add route to main layout
      mainLayoutRoute.children.push(route)
    }
  })

  // Note: Menu items are already sorted by the backend based on sort_order field
  // No additional sorting needed here
}

// Initialize with basic routes (only static ones for now)
// HomePage is always available to all authenticated users
const pagesDir = modules as Record<string, any>

// Always add HomePage route for all users
if (pagesDir['/src/pages/HomePage.vue']) {
  mainLayoutRoute.children!.push({
    path: '/home',
    name: 'home',
    component: pagesDir['/src/pages/HomePage.vue'].default,
    meta: { requiresAuth: true, title: '首页' },
  })
}

// Other pages will be added dynamically based on user permissions via generateRoutesFromMenus

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.path === '/login' && isAuthenticated) {
    next('/home')
    return
  }

  if (to.path === '/') {
    if (isAuthenticated) {
      next('/home')
      return
    } else {
      next('/login')
      return
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  document.title = (to.meta.title as string) || 'Frontend Demo'
  next()
})

export default router

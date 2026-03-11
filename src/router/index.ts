import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Eager load all pages
const modules = import.meta.glob('@/pages/**/*.vue', { eager: true })

// No title mapping needed - use filename directly as title

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

// Initialize with all possible page routes
// Menu permissions are handled by the navigation display, not by route existence
const pagesDir = modules as Record<string, any>

// Add all available page routes
for (const path in pagesDir) {
  const fileName = path.split('/').pop()?.replace('.vue', '') || ''
  // Convert filename to path (remove 'Page' suffix and convert to lowercase)
  const routePath = '/' + fileName.replace(/Page$/, '').toLowerCase()

  // Skip login page as it's already defined in static routes
  if (fileName === 'LoginPage') continue

  const route: RouteRecordRaw = {
    path: routePath,
    name: fileName.toLowerCase().replace('page', ''),
    component: pagesDir[path].default,
    meta: {
      title: fileName.replace('Page', ''),
      showInNav: fileName !== 'HomePage' && fileName !== 'ResultPage',
      requiresAuth: true,
    },
  }

  mainLayoutRoute.children.push(route)
}

// Sort routes by a predefined order
mainLayoutRoute.children.sort((a, b) => {
  const order: Record<string, number> = {
    '/home': 0,
    '/template': 1,
    '/upload': 2,
    '/projectlist': 3,
    '/result': 4,
    '/usermanagement': 5,
    '/processresult': 6,
    '/styletest': 7,
  }
  return (order[a.path] ?? 99) - (order[b.path] ?? 99)
})

// Function to generate routes from menu data - NO LONGER NEEDED
// Menu permissions are now handled purely by navigation display logic
export function generateRoutesFromMenus(_menus: any[]) {
  // This function is kept for compatibility but does nothing
  // All routes are pre-defined, menu only controls visibility in navigation
  console.log('Menu-based route generation is deprecated. Routes are now pre-defined.')
}

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

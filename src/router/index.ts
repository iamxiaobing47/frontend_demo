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

// Predefine all page routes - menu only controls navigation display, not route existence
const pagesDir = modules as Record<string, any>

// Add all available page routes
for (const path in pagesDir) {
  const fileName = path.split('/').pop()?.replace('.vue', '') || ''
  if (fileName === 'LoginPage') continue // Skip login page (already defined)

  const route: RouteRecordRaw = {
    path: '/' + fileName.replace(/Page$/, '').toLowerCase(),
    name: fileName.toLowerCase().replace('page', ''),
    component: pagesDir[path].default,
    meta: { requiresAuth: true },
  }
  mainLayoutRoute.children.push(route)
}

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

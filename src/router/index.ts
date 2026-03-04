import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const modules = import.meta.glob('@/pages/**/*.vue', { eager: true })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [] as RouteRecordRaw[],
    meta: { requiresAuth: true }
  }
]

const pagesDir = modules as Record<string, any>

for (const path in pagesDir) {
  const component = pagesDir[path].default
  const fileName = path.split('/').pop()?.replace('.vue', '') || ''
  
  if (fileName === 'LoginIndexPage') {
    routes.push({
      path: '/login-index',
      name: 'login-index',
      component,
      meta: { title: '首页' }
    })
    continue
  }
  
  if (fileName === 'DashboardPage') {
    routes[0].children!.push({
      path: '/dashboard',
      name: 'dashboard',
      component,
      meta: { requiresAuth: true, title: '控制台' }
    })
    continue
  }
  
  let routePath = '/' + fileName.toLowerCase().replace('page', '')
  let routeName = fileName.toLowerCase().replace('page', '')
  let metaTitle = fileName.replace('Page', '')
  
  if (fileName === 'index') {
    routePath = '/'
    routeName = 'index'
    metaTitle = '首页'
  }
  
  if (fileName.startsWith('[') && fileName.endsWith(']')) {
    const param = fileName.slice(1, -1)
    routePath = `/${param}`
    routeName = param
    metaTitle = param
  }

  const route: RouteRecordRaw = {
    path: routePath,
    name: routeName,
    component,
    meta: { title: metaTitle }
  }
  
  if (!routes[0].children!.some(r => r.path === routePath)) {
    routes[0].children!.push(route)
  }
}

routes[0].children!.sort((a, b) => {
  if (a.path === '/') return -1
  if (b.path === '/') return 1
  return a.path.localeCompare(b.path)
})

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated()
  
  if (to.path === '/login-index' && isAuthenticated) {
    next('/dashboard')
    return
  }
  
  if (to.path === '/' && isAuthenticated) {
    next('/dashboard')
    return
  }
  
  if (to.path === '/' && !isAuthenticated) {
    next('/login-index')
    return
  }
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login-index')
    return
  }
  
  document.title = (to.meta.title as string) || 'Frontend Demo'
  next()
})

export default router

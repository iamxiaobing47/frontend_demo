import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// 1. 预加载所有页面组件
const modules = import.meta.glob('@/pages/**/*.vue', { eager: true })

// 2. 定义静态路由（不依赖用户权限）
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { title: '登录', showInNav: false },
  },
]

// 3. 定义主布局路由及其动态子路由
const mainLayoutRoute: RouteRecordRaw & { children: RouteRecordRaw[] } = {
  path: '/',
  component: () => import('@/layouts/MainLayout.vue'),
  children: [] as RouteRecordRaw[],
  meta: { requiresAuth: true },
}

// 4. 合并所有路由
const routes: RouteRecordRaw[] = [...staticRoutes, mainLayoutRoute]

// 5. 动态添加所有页面路由（菜单仅控制导航显示，不影响路由存在性）
const pagesDir = modules as Record<string, any>

for (const path in pagesDir) {
  const fileName = path.split('/').pop()?.replace('.vue', '') || ''
  if (fileName === 'LoginPage') continue

  const route: RouteRecordRaw = {
    path: '/' + fileName.replace(/Page$/, '').toLowerCase(),
    name: fileName.toLowerCase().replace('page', ''),
    component: pagesDir[path].default,
    meta: { requiresAuth: true },
  }
  mainLayoutRoute.children.push(route)
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 6. 路由守卫：处理认证和重定向逻辑
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

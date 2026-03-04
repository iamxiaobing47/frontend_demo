import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('@/pages/**/*.vue', { eager: true })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [] as RouteRecordRaw[]
  }
]

const pagesDir = modules as Record<string, any>

for (const path in pagesDir) {
  const component = pagesDir[path].default
  const fileName = path.split('/').pop()?.replace('.vue', '') || ''
  
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
  
  routes[0].children!.push(route)
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
  document.title = (to.meta.title as string) || 'Frontend Demo'
  next()
})

export default router

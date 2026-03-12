import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './assets/styles/global.scss'
import { useAuthStore } from '@/stores/authStore'
import { useMenuStore } from '@/stores/menuStore'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(vuetify)

// 1. 挂载应用实例
app.mount('#app')

// 2. 检查用户是否已登录并重新获取菜单
const authStore = useAuthStore()
const menuStore = useMenuStore()

if (authStore.isAuthenticated) {
  menuStore.fetchUserMenus()
}

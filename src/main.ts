import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './assets/styles/global.scss'
import { useAuthStore } from '@/stores/authStore'
import { useMenuStore } from '@/stores/menuStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vuetify)

// Initialize auth and menu stores after app is ready
app.mount('#app')

// Check if user is already logged in (has token in localStorage)
const authStore = useAuthStore()
const menuStore = useMenuStore()

if (authStore.isAuthenticated) {
  // Re-fetch user menus on app initialization
  menuStore.fetchUserMenus()
}

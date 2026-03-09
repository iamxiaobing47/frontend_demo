<template>
  <v-app>
    <v-app-bar elevation="1" color="white">
      <v-app-bar-nav-icon @click="appStore.toggleDrawer" />
      <v-toolbar-title>Frontend Demo</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="goHome">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="32" color="primary">
              <span class="text-white">U</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-account" title="Profile" />
          <v-list-item prepend-icon="mdi-cog" title="Settings" />
          <v-divider />
          <v-list-item prepend-icon="mdi-logout" title="Logout" @click="handleLogout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="appStore.drawer" permanent>
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          color="primary"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const authStore = useAuthStore()
const router = useRouter()

const menuItems = computed(() => {
  const routes = router
    .getRoutes()
    .filter(r => r.path !== '' && r.meta?.title && r.meta?.showInNav !== false)
  return routes.map(r => ({
    title: (r.meta.title as string) || (r.name as string),
    to: r.path || '/',
    value: r.name as string,
    icon: getIcon(r.name as string),
  }))
})

const getIcon = (name: string) => {
  const iconMap: Record<string, string> = {
    home: 'mdi-home',
    about: 'mdi-information',
    user: 'mdi-account',
    settings: 'mdi-cog',
    dashboard: 'mdi-view-dashboard',
  }
  return iconMap[name.toLowerCase()] || 'mdi-page-next'
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login-index')
}

const goHome = () => {
  appStore.drawer = false
  router.push('/index')
}
</script>

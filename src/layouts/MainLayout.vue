<template>
  <v-app>
    <v-app-bar elevation="1" color="white">
      <v-app-bar-nav-icon @click="appStore.toggleNavigation" />
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

    <v-navigation-drawer v-model="appStore.navigation" permanent>
      <v-list density="compact" nav>
        <!-- Show loading indicator while menus are being fetched -->
        <v-list-item v-if="menuStore.loading">
          <v-list-item-title>
            <v-progress-linear indeterminate></v-progress-linear>
          </v-list-item-title>
        </v-list-item>

        <!-- Show message if no menus are available -->
        <v-list-item v-else-if="menuItems.length === 0 && !menuStore.loading">
          <v-list-item-title class="text-grey"> 无可用菜单 </v-list-item-title>
        </v-list-item>

        <!-- Render menu items when not loading and menus are available -->
        <template v-else>
          <!-- Always show Home page first -->
          <v-list-item
            to="/home"
            prepend-icon="mdi-home"
            title="首页"
            value="home"
            color="primary"
          />
          <!-- Render the menu items -->
          <template v-for="item in menuItems" :key="item.id">
            <v-list-item
              v-if="!item.children || item.children.length === 0"
              :to="item.path"
              :prepend-icon="item.icon || getIcon(item.id)"
              :title="item.title"
              :value="item.id"
              color="primary"
            />
            <v-list-group v-else>
              <template #activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="item.icon || getIcon(item.id)"
                  :title="item.title"
                />
              </template>
              <v-list-item
                v-for="child in item.children"
                :key="child.id"
                :to="child.path"
                :prepend-icon="child.icon || getIcon(child.id)"
                :title="child.title"
                :value="child.id"
                color="primary"
                style="padding-left: 40px"
              />
            </v-list-group>
          </template>
        </template>
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
import { useMenuStore } from '@/stores/menuStore'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const authStore = useAuthStore()
const menuStore = useMenuStore()
const router = useRouter()

// Use dynamic menu from store instead of router-based menu
const menuItems = computed(() => {
  return menuStore.getUserMenus
})

const getIcon = (id: string) => {
  const iconMap: Record<string, string> = {
    home: 'mdi-home',
    about: 'mdi-information',
    user: 'mdi-account',
    settings: 'mdi-cog',
    dashboard: 'mdi-view-dashboard',
    projectlist: 'mdi-folder-multiple',
    template: 'mdi-download',
    upload: 'mdi-upload',
    result: 'mdi-file-document',
  }
  return iconMap[id.toLowerCase()] || 'mdi-page-next'
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const goHome = () => {
  appStore.navigation = false
  router.push('/home')
}
</script>

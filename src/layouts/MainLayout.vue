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
              <span class="text-white">{{
                userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U'
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">{{ userInfo.username }}</v-list-item-title>
            <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
          </v-list-item>
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
          <!-- Render the menu items (Home page is excluded from menu) -->
          <template v-for="item in menuItems" :key="item.id">
            <v-list-item
              v-if="!item.children || item.children.length === 0"
              :to="item.path"
              :prepend-icon="item.icon"
              :title="item.title"
              :value="item.id"
              color="primary"
            />
            <v-list-group v-else :value="item.id">
              <template #activator="{ props }">
                <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title" />
              </template>
              <v-list-item
                v-for="child in item.children"
                :key="child.id"
                :to="child.path"
                :prepend-icon="child.icon"
                :title="child.title"
                :value="child.id"
                color="primary"
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
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { useMenuStore } from '@/stores/menuStore'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const authStore = useAuthStore()
const menuStore = useMenuStore()
const router = useRouter()

// 用户信息
const userInfo = ref({
  username: '',
  email: '',
})

// Use dynamic menu from store instead of router-based menu
const menuItems = computed(() => {
  return menuStore.getUserMenus
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    // 从authStore获取用户信息
    const user = await authStore.fetchCurrentUser()
    userInfo.value = {
      username: user.username || 'Unknown User',
      email: user.email || 'No email',
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    // 如果获取失败，重置用户信息
    userInfo.value = {
      username: 'Unknown User',
      email: 'No email',
    }
  }
}

onMounted(() => {
  fetchUserInfo()
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const goHome = () => {
  appStore.navigation = false
  router.push('/home')
}
</script>

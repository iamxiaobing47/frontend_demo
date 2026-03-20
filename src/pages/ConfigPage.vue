<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-map" class="me-2" color="primary"></v-icon>
      配置数据管理
    </v-card-title>

    <v-tabs v-model="currentTab" class="mb-4">
      <v-tab value="chiiki">地域管理</v-tab>
      <v-tab value="kuni">国家管理</v-tab>
      <v-tab value="hinmoku">品目管理</v-tab>
      <v-tab value="youshiki">申请书模板</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="currentTab">
        <!-- 地域管理 -->
        <v-window-item value="chiiki">
          <ChiikiTab />
        </v-window-item>

        <!-- 国家管理 -->
        <v-window-item value="kuni">
          <KuniTab />
        </v-window-item>

        <!-- 品目管理 -->
        <v-window-item value="hinmoku">
          <HinmokuTab />
        </v-window-item>

        <!-- 申请书模板 -->
        <v-window-item value="youshiki">
          <YoushikiTab />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import ChiikiTab from '@/components/config/ChiikiTab.vue'
import KuniTab from '@/components/config/KuniTab.vue'
import HinmokuTab from '@/components/config/HinmokuTab.vue'
import YoushikiTab from '@/components/config/YoushikiTab.vue'

const appStore = useAppStore()
const currentTab = ref('chiiki')

onMounted(() => {
  appStore.setBreadcrumbs([{ title: '配置数据管理' }])
})
</script>

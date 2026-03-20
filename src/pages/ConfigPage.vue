<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-map" class="me-2" color="primary"></v-icon>
      配置データ管理
    </v-card-title>

    <v-tabs v-model="currentTab" class="mb-4">
      <v-tab value="region">地域管理</v-tab>
      <v-tab value="country">国家管理</v-tab>
      <v-tab value="product">品目管理</v-tab>
      <v-tab value="template">申請書テンプレート</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="currentTab">
        <!-- 地域管理 -->
        <v-window-item value="region">
          <RegionTab />
        </v-window-item>

        <!-- 国家管理 -->
        <v-window-item value="country">
          <CountryTab />
        </v-window-item>

        <!-- 品目管理 -->
        <v-window-item value="product">
          <ProductTab />
        </v-window-item>

        <!-- 申請書テンプレート -->
        <v-window-item value="template">
          <ApplicationTemplateTab />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import RegionTab from '@/components/config/RegionTab.vue'
import CountryTab from '@/components/config/CountryTab.vue'
import ProductTab from '@/components/config/ProductTab.vue'
import ApplicationTemplateTab from '@/components/config/ApplicationTemplateTab.vue'

const appStore = useAppStore()
const currentTab = ref('region')

onMounted(() => {
  appStore.setBreadcrumbs([{ title: '配置データ管理' }])
})
</script>

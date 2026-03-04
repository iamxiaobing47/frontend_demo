<template>
  <div>
    <h1 class="text-h4 mb-4">关于</h1>
    <v-card>
      <v-card-text>
        <p>Frontend Demo 是一个使用现代前端技术栈构建的管理系统模板。</p>
        <v-list class="mt-4">
          <v-list-item title="Vue 3" subtitle="渐进式JavaScript框架" />
          <v-list-item title="Vuetify 3" subtitle="Material Design UI组件库" />
          <v-list-item title="Pinia" subtitle="Vue的状态管理解决方案" />
          <v-list-item title="Axios" subtitle="基于Promise的HTTP客户端" />
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(() => {
  appStore.setBreadcrumbs([
    { title: '首页', to: '/' },
    { title: '关于' }
  ])
})
</script>

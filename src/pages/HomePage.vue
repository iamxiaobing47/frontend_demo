<template>
  <div>
    <h1 class="text-h4 mb-4">首页</h1>
    <v-card>
      <v-card-text>
        <p>欢迎使用 Frontend Demo 项目</p>
        <p class="mt-2">技术栈：Vue 3 + Vite + Vuetify + Pinia + Axios</p>
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
    { title: '首页', to: '/' }
  ])
})
</script>

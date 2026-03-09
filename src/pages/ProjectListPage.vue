<template>
  <div>
    <h1 class="text-h4 mb-4">项目列表</h1>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="items" :items-per-page="10" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

const headers = [
  { title: 'ID', key: 'id' },
  { title: '项目名称', key: 'name' },
  { title: '状态', key: 'status' },
  { title: '创建时间', key: 'createdAt' },
]

const items = [
  { id: 1, name: '项目A', status: '进行中', createdAt: '2024-01-01' },
  { id: 2, name: '项目B', status: '已完成', createdAt: '2024-01-02' },
]

onMounted(() => {
  appStore.setBreadcrumbs([{ title: '首页', to: '/home' }, { title: '项目列表' }])
})
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">首页</h1>
    <v-card>
      <v-card-text>
        <p>欢迎使用系统</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(() => {
  appStore.setBreadcrumbs([])
})
</script>

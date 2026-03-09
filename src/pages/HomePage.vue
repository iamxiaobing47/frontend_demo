<template>
  <div>
    <h1 class="text-h4 mb-4">首页</h1>
    <v-card>
      <v-card-text>
        <p>欢迎使用系统</p>
        <v-btn color="primary" class="mt-4" :loading="homeStore.loading" @click="handleFetchTest">
          测试API
        </v-btn>
        <v-alert v-if="homeStore.result" type="success" variant="tonal" class="mt-4">
          {{ homeStore.result }}
        </v-alert>
        <v-alert v-if="homeStore.error" type="error" variant="tonal" class="mt-4">
          {{ homeStore.error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useHomeStore } from '@/stores/homeStore'

const appStore = useAppStore()
const homeStore = useHomeStore()

console.log('HomePage - homeStore:', homeStore)
console.log('HomePage - homeStore.result:', homeStore.result, 'Type:', typeof homeStore.result)

onMounted(() => {
  appStore.setBreadcrumbs([])
})

// 添加按钮点击的调试
const handleFetchTest = async () => {
  await homeStore.fetchTest()
  await nextTick()
}
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">首页</h1>
    <v-card>
      <v-card-text>
        <p>欢迎使用系统</p>
        <v-btn color="primary" class="mt-4" :loading="indexStore.loading" @click="handleFetchTest">
          测试API
        </v-btn>
        <v-alert v-if="indexStore.result" type="success" variant="tonal" class="mt-4">
          {{ indexStore.result }}
        </v-alert>
        <v-alert v-if="indexStore.error" type="error" variant="tonal" class="mt-4">
          {{ indexStore.error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useIndexStore } from '@/stores/indexStore'

const appStore = useAppStore()
const indexStore = useIndexStore()

console.log('IndexPage - indexStore:', indexStore)
console.log('IndexPage - indexStore.result:', indexStore.result, 'Type:', typeof indexStore.result)

onMounted(() => {
  appStore.setBreadcrumbs([])
})

// 添加按钮点击的调试
const handleFetchTest = async () => {
  await indexStore.fetchTest()
  await nextTick()
}
</script>

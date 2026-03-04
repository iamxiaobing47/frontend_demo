<template>
  <div>
    <h1 class="text-h4 mb-4">首页</h1>
    <v-card>
      <v-card-text>
        <p>欢迎使用系统</p>
        <v-btn color="primary" class="mt-4" @click="testApi">测试API</v-btn>
        <v-alert v-if="result" type="success" variant="tonal" class="mt-4">
          {{ result }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useTestApi } from '@/composables/useTestApi'

const appStore = useAppStore()
const { result, testApi } = useTestApi()

onMounted(() => {
  appStore.setBreadcrumbs([])
})
</script>

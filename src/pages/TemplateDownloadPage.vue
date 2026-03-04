<template>
  <div>
    <h1 class="text-h4 mb-4">文件模板下载</h1>
    <v-card>
      <v-card-text>
        <p>请下载模板文件并按照格式填写</p>
        <v-btn color="primary" class="mt-4" prepend-icon="mdi-download">
          下载模板
        </v-btn>
      </v-card-text>
    </v-card>
  </div>

  <div>
    <v-btn
      type="button"
              color="primary"
              size="large"
              block
             @click="doTestClick">
      TEST
    </v-btn>
    {{ result }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { DefaultApi } from '@/api/generated'

const appStore = useAppStore()

onMounted(() => {
  appStore.setBreadcrumbs([
    { title: '首页', to: '/index' },
    { title: '文件模板下载' }
  ])
})


const result = ref("")
const doTestClick = async () => {
 const api = new DefaultApi()
  const response = await api.test()

  response = JSON.stringify(response.data, null, 2)

  result.value = response.data
}
</script>

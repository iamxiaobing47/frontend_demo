<template>
  <div>
    <h1 class="text-h4 mb-4">文件处理结果</h1>
    <v-card>
      <v-card-text>
        <v-alert type="success" variant="tonal" class="mb-4"> 文件处理完成 </v-alert>
        <v-table>
          <thead>
            <tr>
              <th>文件名</th>
              <th>状态</th>
              <th>处理时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>example.xlsx</td>
              <td>成功</td>
              <td>2024-01-01 10:00:00</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

onMounted(() => {
  appStore.setBreadcrumbs([{ title: '首页', to: '/home' }, { title: '文件处理结果' }])
})
</script>

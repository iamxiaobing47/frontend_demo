<template>
  <v-app>
    <router-view />
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const snackbar = ref({
  show: false,
  text: '',
  color: 'error' as 'success' | 'error' | 'info' | 'warning',
  timeout: 3000,
})

// 1. 设置全局消息提示函数，用于显示API错误和其他通知
window.showSnackbar = (
  message: string,
  color: 'success' | 'error' | 'info' | 'warning' = 'error',
  timeout: number = 3000
) => {
  snackbar.value = {
    show: true,
    text: message,
    color,
    timeout,
  }
}
</script>

<style>
#app {
  height: 100%;
}
</style>

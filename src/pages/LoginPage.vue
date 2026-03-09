<template>
  <v-app>
    <v-app-bar color="white" elevation="1">
      <v-toolbar-title>Frontend Demo</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" variant="flat" @click="showLoginDialog = true">登录</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-icon icon="mdi-rocket-launch" size="100" color="primary" class="mb-6" />
            <h1 class="text-h3 mb-4">欢迎使用 Frontend Demo</h1>
            <p class="text-h6 text-grey mb-8">基于 Vue 3 + Vuetify + Pinia 的管理系统</p>
            <v-btn color="primary" size="large" @click="showLoginDialog = true">
              <v-icon start>mdi-login</v-icon>
              立即登录
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showLoginDialog" max-width="400">
      <v-card>
        <v-card-title class="text-center py-4">
          <h2 class="text-h5">登录</h2>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleLogin">
            <!-- 错误消息显示 -->
            <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
              {{ errorMessage }}
            </v-alert>

            <v-text-field
              v-model="email"
              label="邮箱"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              :error-messages="getFieldError('email')"
              class="mb-4"
            />
            <v-text-field
              v-model="password"
              label="密码"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :error-messages="getFieldError('password')"
              class="mb-4"
            />
            <v-btn type="submit" color="primary" size="large" block :loading="loading">
              登录
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useValidation } from '@/composables/useValidation'
import { getMessageTextWithDefault } from '@/utils/messageTexts'

const router = useRouter()
const authStore = useAuthStore()
const { getFieldError, clearErrors } = useValidation()

const showLoginDialog = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('') // 添加错误消息状态

// 清除之前的错误
onMounted(() => {
  clearErrors()
})

const handleLogin = async () => {
  clearErrors()
  errorMessage.value = '' // 清空之前错误消息
  loading.value = true

  try {
    // 直接使用authStore的登录方法，它会处理完整的登录流程
    const loginResult = await authStore.login(email.value, password.value)

    if (loginResult.success) {
      loading.value = false
      showLoginDialog.value = false
      router.push('/home')
    } else {
      // 处理登录失败
      errorMessage.value = loginResult.message || '登录失败，请检查您的凭据'
      loading.value = false
    }
  } catch (error: any) {
    // 处理网络错误或其他异常
    console.error('Login error:', error)

    // 显示错误消息而不是自动跳转
    if (error.response) {
      // 服务器返回了错误响应
      const messageCode = error.response.data?.messageCode
      if (messageCode) {
        errorMessage.value =
          error.response.data?.message || getMessageTextWithDefault(messageCode, '登录失败，请重试')
      } else {
        errorMessage.value = error.response.data?.message || '登录失败，请重试' // 尝试使用服务器提供的消息
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage.value = '网络错误，请检查您的连接'
    } else {
      // 其他错误
      errorMessage.value = '发生未知错误，请重试'
    }

    loading.value = false
  }
}
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}
</style>

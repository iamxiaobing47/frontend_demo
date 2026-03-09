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

const router = useRouter()
const authStore = useAuthStore()
const { getFieldError, clearErrors } = useValidation()

const showLoginDialog = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

// 清除之前的错误
onMounted(() => {
  clearErrors()
})

const handleLogin = async () => {
  clearErrors()
  loading.value = true

  // 直接使用authStore的登录方法，它会处理完整的登录流程
  // 错误处理已经在 httpClient 中统一处理，成功时会直接返回
  await authStore.login(email.value, password.value)

  // 执行到这里说明登录成功
  loading.value = false
  showLoginDialog.value = false
  router.push('/home')
}
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}
</style>

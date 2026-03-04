import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<any>(null)

  const login = async (_username: string, _password: string) => {
    // Mock login
    token.value = 'mock-token-' + Date.now()
    localStorage.setItem('token', token.value)
  }

  const logout = () => {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => !!token.value

  return {
    token,
    userInfo,
    login,
    logout,
    isAuthenticated
  }
})

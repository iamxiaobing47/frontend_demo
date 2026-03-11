import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { DefaultApi } from '@/services/generated/api'
import apiClient from '@/services/httpClient'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  UserInfo,
  BatchUserQueryRequest,
} from '@/services/generated/api'

// 使用自定义的 httpClient 创建 API 实例
const api = new DefaultApi(undefined, '', apiClient)

export const useUserStore = defineStore('user', () => {
  // 用户列表
  const users = ref<UserInfo[]>([]) as Ref<UserInfo[]>

  // 当前选中的用户（用于编辑）
  const currentUser = ref<UserInfo | null>(null) as Ref<UserInfo | null>

  // 加载状态
  const loading = ref(false)

  // 错误信息
  const error = ref('')

  // 获取所有用户列表
  const fetchUsers = async () => {
    try {
      loading.value = true
      error.value = ''

      // 由于API中没有直接获取所有用户的接口，我们暂时返回空数组
      // 在实际应用中，后端应该提供获取用户列表的API
      users.value = []
      loading.value = false
    } catch (err: any) {
      error.value = err.message || '获取用户列表失败'
      loading.value = false
    }
  }

  // 根据用户ID获取单个用户
  const fetchUserById = async (userId: string) => {
    const response = await api.getUser(userId)
    return response.data.data
  }

  // 批量获取用户
  const batchGetUsers = async (userIds: string[]) => {
    const request: BatchUserQueryRequest = { userIds }
    const response = await api.batchGetUsers(request)
    return response.data.data
  }

  // 创建用户
  const createUser = async (userData: CreateUserRequest) => {
    const response = await api.createUser(userData)
    return response.data.data
  }

  // 更新用户
  const updateUser = async (userData: UpdateUserRequest) => {
    const response = await api.updateUser(userData)
    return response.data.data
  }

  // 删除用户
  const deleteUser = async (userId: string, userType?: string) => {
    const request: DeleteUserRequest = { userId, userType }
    const response = await api.deleteUser(request)
    return response.data.data
  }

  // 重置当前用户
  const resetCurrentUser = () => {
    currentUser.value = null
  }

  // 设置当前用户（用于编辑）
  const setCurrentUser = (user: UserInfo | null) => {
    currentUser.value = user
  }

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    batchGetUsers,
    createUser,
    updateUser,
    deleteUser,
    resetCurrentUser,
    setCurrentUser,
  }
})

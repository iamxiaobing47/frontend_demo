import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { DefaultApi } from '@/services/generated/api'
import apiClient from '@/services/httpClient'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  UserInfo,
  PageUserQueryRequest,
  IPageUserInfo,
} from '@/services/generated/api'

// 使用自定义的 httpClient 创建 API 实例
const api = new DefaultApi(undefined, '', apiClient)

export const useUserStore = defineStore('user', () => {
  // 用户列表
  const users = ref<UserInfo[]>([]) as Ref<UserInfo[]>

  // 分页数据
  const pagination = ref({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    pages: 0,
    hasPrevious: false,
    hasNext: false,
  })

  // 当前选中的用户（用于编辑）
  const currentUser = ref<UserInfo | null>(null) as Ref<UserInfo | null>

  // 加载状态
  const loading = ref(false)

  // 错误信息
  const error = ref('')

  // 搜索条件
  const searchCriteria = ref({
    userType: '',
    email: '',
    userName: '',
  })

  // 分页查询用户列表
  const fetchUsers = async (pageNum: number = 1, pageSize: number = 10) => {
    try {
      loading.value = true
      error.value = ''

      const request: PageUserQueryRequest = {
        pageNum,
        pageSize,
        userType: searchCriteria.value.userType || undefined,
        email: searchCriteria.value.email || undefined,
        userName: searchCriteria.value.userName || undefined,
      }

      const response = await api.pageUsers(request)
      const pageResult = response.data.data as IPageUserInfo

      console.log('PageResult:', pageResult)
      console.log('Total:', pageResult?.total)

      users.value = pageResult?.records || []

      // 使用 Object.assign 确保响应式更新
      Object.assign(pagination.value, {
        pageNum: Number(pageResult.current) || 1,
        pageSize: Number(pageResult.size) || 10,
        total: Number(pageResult.total) || 0,
        pages: Number(pageResult.pages) || 0,
        hasPrevious: (Number(pageResult.current) || 1) > 1,
        hasNext: (Number(pageResult.current) || 1) < Math.ceil((Number(pageResult.total) || 0) / (Number(pageResult.size) || 10)),
      })

      loading.value = false
    } catch (err: any) {
      error.value = err.message || '获取用户列表失败'
      loading.value = false
    }
  }

  // 根据用户 ID 获取单个用户
  const fetchUserById = async (userId: string) => {
    const response = await api.getUser(userId)
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

  // 设置搜索条件
  const setSearchCriteria = (criteria: {
    userType?: string
    email?: string
    userName?: string
  }) => {
    searchCriteria.value = {
      userType: criteria.userType || '',
      email: criteria.email || '',
      userName: criteria.userName || '',
    }
  }

  // 重置搜索条件
  const resetSearchCriteria = () => {
    searchCriteria.value = {
      userType: '',
      email: '',
      userName: '',
    }
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
    pagination,
    currentUser,
    loading,
    error,
    searchCriteria,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    setSearchCriteria,
    resetSearchCriteria,
    resetCurrentUser,
    setCurrentUser,
  }
})

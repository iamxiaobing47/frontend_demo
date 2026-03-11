import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { DefaultApiFactory } from '@/services/generated/api'
import { useRequest } from '@/composables/useRequest'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  UserInfo,
  BatchUserQueryRequest,
} from '@/services/generated/api'

const api = DefaultApiFactory()

export const useUserStore = defineStore('user', () => {
  // 用户列表
  const users = ref<UserInfo[]>([]) as Ref<UserInfo[]>

  // 当前选中的用户（用于编辑）
  const currentUser = ref<UserInfo | null>(null) as Ref<UserInfo | null>

  // 加载状态
  const loading = ref(false)

  // 错误信息
  const error = ref('')

  // 使用useRequest处理API请求
  const {
    execute: executeList,
    data: listData,
    error: listError,
    loading: listLoading,
  } = useRequest<any>()
  const {
    execute: executeCreate,
    data: createData,
    error: createError,
    loading: createLoading,
  } = useRequest<any>()
  const {
    execute: executeUpdate,
    data: updateData,
    error: updateError,
    loading: updateLoading,
  } = useRequest<any>()
  const {
    execute: executeDelete,
    data: deleteData,
    error: deleteError,
    loading: deleteLoading,
  } = useRequest<any>()
  const {
    execute: executeGet,
    data: getData,
    error: getError,
    loading: getLoading,
  } = useRequest<any>()

  // 获取所有用户列表
  const fetchUsers = async () => {
    try {
      loading.value = true
      error.value = ''

      // 这里假设我们有一个获取所有用户的API，如果没有，我们可以使用批量查询
      // 但根据API文档，我们可能需要先获取用户ID列表，然后批量查询
      // 作为临时方案，我们可以模拟一个空列表，或者在后端添加获取所有用户的API

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
    return await executeGet(api.getUser(userId))
  }

  // 批量获取用户
  const batchGetUsers = async (userIds: string[]) => {
    const request: BatchUserQueryRequest = { userIds }
    return await executeList(api.batchGetUsers(request))
  }

  // 创建用户
  const createUser = async (userData: CreateUserRequest) => {
    return await executeCreate(api.createUser(userData))
  }

  // 更新用户
  const updateUser = async (userData: UpdateUserRequest) => {
    return await executeUpdate(api.updateUser(userData))
  }

  // 删除用户
  const deleteUser = async (userId: string, userType?: string) => {
    const request: DeleteUserRequest = { userId, userType }
    return await executeDelete(api.deleteUser(request))
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
    listLoading,
    listError,
    createLoading,
    createError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    getLoading,
    getError,
    fetchUsers,
    fetchUserById,
    batchGetUsers,
    createUser,
    updateUser,
    deleteUser,
    resetCurrentUser,
    setCurrentUser,
    listData,
    createData,
    updateData,
    deleteData,
    getData,
  }
})

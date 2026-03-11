<template>
  <div>
    <h1 class="text-h4 mb-4">用户管理</h1>

    <!-- 创建/编辑用户表单 -->
    <v-card class="mb-6">
      <v-card-title>
        {{ editing ? '编辑用户' : '创建用户' }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="邮箱 *"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                :disabled="editing"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="!editing">
              <v-text-field
                v-model="form.password"
                label="密码 *"
                type="password"
                :rules="[rules.required, rules.password]"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.userId"
                label="用户ID"
                variant="outlined"
                :disabled="editing"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.userName"
                label="用户名"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.userType"
                label="用户类型"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.orgId" label="组织ID" variant="outlined"></v-text-field>
            </v-col>
          </v-row>

          <v-card-actions>
            <v-btn color="primary" type="submit" :loading="userStore.loading">
              {{ editing ? '更新用户' : '创建用户' }}
            </v-btn>
            <v-btn v-if="editing" color="secondary" @click="cancelEdit" class="ml-2">
              取消编辑
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 查询用户 -->
    <v-card class="mb-6">
      <v-card-title>查询用户</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="queryUserId"
              label="用户ID"
              variant="outlined"
              placeholder="输入用户ID查询"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-end">
            <v-btn
              color="primary"
              @click="fetchUser"
              :loading="userStore.loading"
              :disabled="!queryUserId"
            >
              查询用户
            </v-btn>
          </v-col>
        </v-row>

        <!-- 批量查询 -->
        <v-row class="mt-4">
          <v-col cols="12" md="8">
            <v-textarea
              v-model="batchQueryIds"
              label="批量用户ID (用逗号分隔)"
              variant="outlined"
              placeholder="输入多个用户ID，用逗号分隔"
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-end">
            <v-btn
              color="primary"
              @click="batchFetchUsers"
              :loading="userStore.loading"
              :disabled="!batchQueryIds"
            >
              批量查询
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 用户信息显示 -->
    <v-card v-if="displayedUser" class="mb-6">
      <v-card-title>用户信息</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6"> <strong>用户ID:</strong> {{ displayedUser.userId }} </v-col>
          <v-col cols="12" md="6"> <strong>邮箱:</strong> {{ displayedUser.email }} </v-col>
          <v-col cols="12" md="6"> <strong>用户名:</strong> {{ displayedUser.userName }} </v-col>
          <v-col cols="12" md="6"> <strong>用户类型:</strong> {{ displayedUser.userType }} </v-col>
          <v-col cols="12" md="6"> <strong>组织ID:</strong> {{ displayedUser.orgId }} </v-col>
          <v-col cols="12" md="6"> <strong>组织名称:</strong> {{ displayedUser.orgName }} </v-col>
        </v-row>

        <v-card-actions>
          <v-btn color="warning" @click="startEdit(displayedUser)" class="mr-2"> 编辑 </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete(displayedUser.userId!)"
            :disabled="!displayedUser.userId"
          >
            删除
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <!-- 批量查询结果 -->
    <v-card v-if="batchUsers.length > 0">
      <v-card-title>批量查询结果</v-card-title>
      <v-card-text>
        <v-data-table :headers="batchHeaders" :items="batchUsers" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-btn icon color="warning" size="small" @click="startEdit(item)" class="mr-2">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              size="small"
              @click="confirmDelete(item.userId!)"
              :disabled="!item.userId"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- 错误提示 -->
    <v-alert v-if="userStore.error" type="error" variant="tonal" class="mt-4">
      {{ userStore.error }}
    </v-alert>

    <!-- 成功提示 -->
    <v-alert
      v-if="operationSuccess"
      type="success"
      variant="tonal"
      class="mt-4"
      :closable="true"
      @update:closable="operationSuccess = false"
    >
      操作成功！
    </v-alert>

    <!-- 确认删除对话框 -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">确认删除</v-card-title>
        <v-card-text>确定要删除此用户吗？此操作无法撤销。</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="showDeleteDialog = false">取消</v-btn>
          <v-btn color="error" @click="handleDelete" :loading="userStore.loading">删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useUserStore } from '@/stores/userStore'
import type { UserInfo, CreateUserRequest, UpdateUserRequest } from '@/services/generated/api'

const appStore = useAppStore()
const userStore = useUserStore()

// 表单数据
const form = ref<CreateUserRequest & UpdateUserRequest>({
  email: '',
  password: '',
  userId: '',
  userName: '',
  userType: '',
  orgId: '',
})

// 查询相关
const queryUserId = ref('')
const batchQueryIds = ref('')
const displayedUser = ref<UserInfo | null>(null)
const batchUsers = ref<UserInfo[]>([])

// 状态管理
const editing = ref(false)
const operationSuccess = ref(false)
const showDeleteDialog = ref(false)
const userToDelete = ref<string | null>(null)

// 表头定义
const batchHeaders = [
  { title: '用户ID', key: 'userId' },
  { title: '邮箱', key: 'email' },
  { title: '用户名', key: 'userName' },
  { title: '用户类型', key: 'userType' },
  { title: '组织ID', key: 'orgId' },
  { title: '操作', key: 'actions' },
]

// 验证规则
const rules = {
  required: (value: any) => !!value || '此字段为必填项',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || '请输入有效的邮箱地址'
  },
  password: (value: string) => value.length >= 6 || '密码至少需要6个字符',
}

// 计算属性：检查表单是否有效
const isFormValid = computed(() => {
  if (!form.value.email || !form.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return false
  }
  if (!editing.value && (!form.value.password || form.value.password.length < 6)) {
    return false
  }
  return true
})

// 初始化
onMounted(() => {
  appStore.setBreadcrumbs([{ title: '用户管理' }])
})

// 监听store中的数据变化 - REMOVED because userStore no longer exposes these properties
// The API calls now return data directly, so we handle it in the calling functions

// 监听操作成功状态 - REMOVED because userStore no longer exposes these properties

// 处理表单提交
const handleSubmit = async () => {
  if (!isFormValid.value) return

  if (editing.value) {
    // 更新用户
    const updateData: UpdateUserRequest = {
      userId: form.value.userId,
      userType: form.value.userType,
      name: form.value.userName,
      orgId: form.value.orgId,
    }
    await userStore.updateUser(updateData)
  } else {
    // 创建用户
    const createData: CreateUserRequest = {
      email: form.value.email,
      password: form.value.password,
      userId: form.value.userId,
      userName: form.value.userName,
      userType: form.value.userType,
      orgId: form.value.orgId,
    }
    await userStore.createUser(createData)
  }
}

// 查询单个用户
const fetchUser = async () => {
  if (!queryUserId.value) return

  try {
    const response = await userStore.fetchUserById(queryUserId.value)
    if (response.data?.data) {
      displayedUser.value = response.data.data
    }
  } catch (error) {
    // Error is handled by httpClient interceptor
    console.error('Failed to fetch user:', error)
  }
}

// 批量查询用户
const batchFetchUsers = async () => {
  if (!batchQueryIds.value) return
  const userIds = batchQueryIds.value
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0)
  if (userIds.length > 0) {
    try {
      const response = await userStore.batchGetUsers(userIds)
      if (response.data?.data) {
        batchUsers.value = response.data.data
      }
    } catch (error) {
      // Error is handled by httpClient interceptor
      console.error('Failed to batch fetch users:', error)
    }
  }
}

// 开始编辑用户
const startEdit = (user: UserInfo) => {
  editing.value = true
  form.value = {
    email: user.email || '',
    password: '', // 密码在编辑时不显示
    userId: user.userId || '',
    userName: user.userName || '',
    userType: user.userType || '',
    orgId: user.orgId?.toString() || '',
  }
  displayedUser.value = user
}

// 取消编辑
const cancelEdit = () => {
  editing.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.value = {
    email: '',
    password: '',
    userId: '',
    userName: '',
    userType: '',
    orgId: '',
  }
}

// 确认删除
const confirmDelete = (userId: string) => {
  userToDelete.value = userId
  showDeleteDialog.value = true
}

// 处理删除
const handleDelete = async () => {
  if (userToDelete.value) {
    try {
      await userStore.deleteUser(userToDelete.value)
      // If no error is thrown, assume success
      showDeleteDialog.value = false
      userToDelete.value = null
      displayedUser.value = null
      // 从批量列表中移除已删除的用户
      batchUsers.value = batchUsers.value.filter(user => user.userId !== userToDelete.value)
      operationSuccess.value = true
    } catch (error) {
      // Error is handled by httpClient interceptor
      console.error('Failed to delete user:', error)
    }
  }
}
</script>

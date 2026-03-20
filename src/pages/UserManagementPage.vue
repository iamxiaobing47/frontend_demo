<template>
  <v-sheet border rounded>
    <v-data-table-server
      :headers="headers"
      :items="userStore.users"
      :loading="userStore.loading"
      :items-per-page="userStore.pagination.pageSize"
      :page="userStore.pagination.pageNum"
      :items-length="userStore.pagination.total"
      @update:options="loadUsers"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-account-multiple"
              size="x-small"
              start
            ></v-icon>

            用户管理
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <!-- 搜索框 -->
          <v-text-field
            v-model="searchEmail"
            label="搜索邮箱"
            class="me-2"
            style="max-width: 200px"
            density="compact"
            hide-details
            clearable
            @keyup.enter="handleSearch"
          ></v-text-field>

          <v-btn
            class="me-2"
            prepend-icon="mdi-magnify"
            rounded="lg"
            text="搜索"
            border
            @click="handleSearch"
          ></v-btn>

          <v-btn prepend-icon="mdi-plus" rounded="lg" text="添加用户" border @click="add"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.userId="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-account" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.userType="{ value }">
        <v-chip
          :text="
            value === 'BUSINESS_USER' ? '企业用户' : value === 'STAFF_USER' ? '政府职员' : value
          "
          :color="
            value === 'BUSINESS_USER' ? 'primary' : value === 'STAFF_USER' ? 'success' : 'default'
          "
          size="small"
        ></v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="edit(item)"
          ></v-icon>

          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="confirmDelete(item)"
          ></v-icon>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn
          prepend-icon="mdi-refresh"
          rounded="lg"
          text="刷新数据"
          variant="text"
          border
          @click="loadUsers"
        ></v-btn>
      </template>
    </v-data-table-server>
  </v-sheet>

  <!-- 添加/编辑用户对话框 -->
  <v-dialog v-model="dialog" max-width="600">
    <v-card
      :subtitle="`${isEditing ? '更新' : '创建'}用户信息`"
      :title="`${isEditing ? '编辑' : '添加'}用户`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.email"
              label="邮箱 *"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" v-if="!isEditing">
            <v-text-field
              v-model="formModel.password"
              label="密码 *"
              type="password"
              :rules="[rules.required, rules.password]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.userId"
              label="用户 ID"
              :disabled="isEditing"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.userName" label="用户名"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="formModel.userType"
              label="用户类型 *"
              :items="[
                { title: '企业用户', value: 'BUSINESS_USER' },
                { title: '政府职员', value: 'STAFF_USER' },
              ]"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.orgId" label="组织 ID"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="保存" :loading="saving" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 删除确认对话框 -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card title="确认删除">
      <template v-slot:text>
        确定要删除用户
        <span class="font-weight-bold">{{ deleteUserEmail }}</span> 吗？此操作不可恢复。
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="deleteDialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="删除" color="error" :loading="deleting" @click="doDelete"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, shallowRef, toRef, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useUserStore } from '@/stores/userStore'
import type { UserInfo, CreateUserRequest, UpdateUserRequest } from '@/services/generated/api'

const appStore = useAppStore()
const userStore = useUserStore()

// 验证规则
const rules = {
  required: (value: any) => !!value || '此字段为必填项',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || '请输入有效的邮箱地址'
  },
  password: (value: string) => value.length >= 6 || '密码至少需要 6 个字符',
}

interface FormModel {
  id: number
  userId: string
  email: string
  password: string
  userName: string
  userType: string
  orgId: string
}

function createNewRecord(): FormModel {
  return {
    id: 0,
    userId: '',
    email: '',
    password: '',
    userName: '',
    userType: '',
    orgId: '',
  }
}

const formModel = ref<FormModel>(createNewRecord())
const dialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)
const saving = ref(false)
const deleting = ref(false)
const deleteUserEmail = ref('')
const deleteUserItem = ref<UserInfo | null>(null)
const searchEmail = ref('')

// 分页表头
const headers = [
  { title: '用户 ID', key: 'userId', align: 'start' as const },
  { title: '邮箱', key: 'email' },
  { title: '用户名', key: 'userName' },
  { title: '用户类型', key: 'userType' },
  { title: '组织 ID', key: 'orgId' },
  { title: '操作', key: 'actions', align: 'end' as const, sortable: false },
]

// 加载用户数据（分页）
const loadUsers = async (options: { page?: number; itemsPerPage?: number }) => {
  const page = options.page || 1
  const pageSize = options.itemsPerPage || 10
  await userStore.fetchUsers(page, pageSize)
}

// 搜索
const handleSearch = async () => {
  userStore.setSearchCriteria({
    email: searchEmail.value || undefined,
  })
  await userStore.fetchUsers(1, userStore.pagination.pageSize)
}

// 添加用户
const add = () => {
  formModel.value = createNewRecord()
  dialog.value = true
}

// 编辑用户
const edit = (item: UserInfo) => {
  formModel.value = {
    id: 1, // 标记为编辑模式
    userId: item.userId || '',
    email: item.email || '',
    password: '',
    userName: item.userName || '',
    userType: item.userType || '',
    orgId: item.orgId || '',
  }
  dialog.value = true
}

// 确认删除
const confirmDelete = (item: UserInfo) => {
  deleteUserItem.value = item
  deleteUserEmail.value = item.email || ''
  deleteDialog.value = true
}

// 执行删除
const doDelete = async () => {
  if (!deleteUserItem.value) return

  deleting.value = true
  try {
    await userStore.deleteUser(
      deleteUserItem.value.userId || '',
      deleteUserItem.value.userType || ''
    )
    await loadUsers({
      page: userStore.pagination.pageNum,
      itemsPerPage: userStore.pagination.pageSize,
    })
    deleteDialog.value = false
  } catch (error: any) {
    console.error('删除失败:', error)
  } finally {
    deleting.value = false
  }
}

// 保存（创建或更新）
const save = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      // 更新用户
      const updateData: UpdateUserRequest = {
        userId: formModel.value.userId,
        userType: formModel.value.userType,
        name: formModel.value.userName,
        orgId: formModel.value.orgId,
      }
      await userStore.updateUser(updateData)
    } else {
      // 创建用户
      const createData: CreateUserRequest = {
        email: formModel.value.email,
        password: formModel.value.password,
        userId: formModel.value.userId,
        userType: formModel.value.userType,
        userName: formModel.value.userName,
        orgId: formModel.value.orgId,
      }
      await userStore.createUser(createData)
    }

    dialog.value = false
    await loadUsers({
      page: userStore.pagination.pageNum,
      itemsPerPage: userStore.pagination.pageSize,
    })
  } catch (error: any) {
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  appStore.setBreadcrumbs([{ title: '用户管理' }])
  loadUsers({ page: 1, itemsPerPage: 10 })
})
</script>

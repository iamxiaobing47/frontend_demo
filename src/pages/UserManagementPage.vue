<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" :hide-default-footer="users.length < 11" :items="users">
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

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="添加用户"
            border
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.userId="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-account" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="edit(item.id)"
          ></v-icon>

          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.id)"
          ></v-icon>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn
          prepend-icon="mdi-backup-restore"
          rounded="lg"
          text="重置数据"
          variant="text"
          border
          @click="reset"
        ></v-btn>
      </template>
    </v-data-table>
  </v-sheet>

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
              label="用户ID"
              :disabled="isEditing"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.userName" label="用户名"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.userType" label="用户类型"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.orgId" label="组织ID"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="保存" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, shallowRef, toRef, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import type { UserInfoEntity } from '@/services/generated/api'

// 扩展用户类型，添加 id 属性用于表格操作
interface UserWithId extends UserInfoEntity {
  id: number
}

// 表单模型类型，包含密码字段（仅用于表单）
interface FormModel extends UserWithId {
  password: string
}

const appStore = useAppStore()

// 验证规则
const rules = {
  required: (value: any) => !!value || '此字段为必填项',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || '请输入有效的邮箱地址'
  },
  password: (value: string) => value.length >= 6 || '密码至少需要6个字符',
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
    orgName: '',
    orgType: '',
  }
}

const users = ref<UserWithId[]>([])
const formModel = ref<FormModel>(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)

const headers = [
  { title: '用户ID', key: 'userId', align: 'start' as const },
  { title: '邮箱', key: 'email' },
  { title: '用户名', key: 'userName' },
  { title: '用户类型', key: 'userType' },
  { title: '组织ID', key: 'orgId' },
  { title: '操作', key: 'actions', align: 'end' as const, sortable: false },
]

onMounted(() => {
  appStore.setBreadcrumbs([{ title: '用户管理' }])
  reset()
})

function add() {
  formModel.value = createNewRecord()
  dialog.value = true
}

function edit(id: number) {
  const found = users.value.find(user => user.id === id)

  if (found) {
    formModel.value = {
      id: found.id,
      userId: found.userId || '',
      email: found.email || '',
      password: '',
      userName: found.userName || '',
      userType: found.userType || '',
      orgId: found.orgId || '',
      orgName: found.orgName || '',
      orgType: found.orgType || '',
    }
  }

  dialog.value = true
}

function remove(id: number) {
  const index = users.value.findIndex(user => user.id === id)
  users.value.splice(index, 1)
}

function save() {
  // 从表单模型中移除 password 字段，创建用户对象
  const { password, ...userWithoutPassword } = formModel.value

  if (isEditing.value) {
    const index = users.value.findIndex(user => user.id === formModel.value.id)
    users.value[index] = {
      ...userWithoutPassword,
      // 保持原始的只读字段
      orgName: users.value[index].orgName,
      orgType: users.value[index].orgType,
    }
  } else {
    // 为新用户分配ID
    const newId = users.value.length > 0 ? Math.max(...users.value.map(u => u.id || 0)) + 1 : 1
    const newUser: UserWithId = {
      ...userWithoutPassword,
      id: newId,
      // 设置默认的只读字段
      orgName: userWithoutPassword.orgName || '默认组织',
      orgType: userWithoutPassword.orgType || '默认类型',
    }
    users.value.push(newUser)
  }

  dialog.value = false
}

function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
  users.value = [
    {
      id: 1,
      userId: 'user001',
      email: 'zhangsan@example.com',
      userName: '张三',
      userType: '管理员',
      orgId: 'org001',
      orgName: '技术部',
      orgType: '部门',
    },
    {
      id: 2,
      userId: 'user002',
      email: 'lisi@example.com',
      userName: '李四',
      userType: '普通用户',
      orgId: 'org002',
      orgName: '市场部',
      orgType: '部门',
    },
    {
      id: 3,
      userId: 'user003',
      email: 'wangwu@example.com',
      userName: '王五',
      userType: '审核员',
      orgId: 'org003',
      orgName: '财务部',
      orgType: '部门',
    },
    {
      id: 4,
      userId: 'user004',
      email: 'zhaoliu@example.com',
      userName: '赵六',
      userType: '普通用户',
      orgId: 'org001',
      orgName: '技术部',
      orgType: '部门',
    },
    {
      id: 5,
      userId: 'user005',
      email: 'sunqi@example.com',
      userName: '孙七',
      userType: '管理员',
      orgId: 'org004',
      orgName: '人事部',
      orgType: '部门',
    },
  ]
}
</script>

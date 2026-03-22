<template>
  <div>
    <!-- 工具栏 -->
    <v-toolbar flat>
      <v-toolbar-title>地域一覧</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        追加
      </v-btn>
    </v-toolbar>

    <!-- 数据表格 -->
    <v-data-table
      :headers="headers"
      :items="configStore.regionList"
      :loading="configStore.regionLoading"
      hover
    >
      <template v-slot:item.regionCd="{ item }">
        <v-chip color="primary" size="small">{{ item.regionCd }}</v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon icon="mdi-pencil" size="small" class="me-2" @click="openDialog(item)"></v-icon>
        <v-icon icon="mdi-delete" size="small" color="error" @click="confirmDelete(item)"></v-icon>
      </template>
    </v-data-table>

    <!-- 编辑对话框 -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEditing ? '地域編集' : '地域追加'">
        <v-card-text>
          <v-text-field
            v-model="form.regionCd"
            label="地域コード"
            type="number"
            variant="outlined"
            density="comfortable"
            required
            :rules="[v => v !== undefined && v !== null && v !== '' ? true : '地域コードは必須です']"
            :error-messages="getErrorMessages('regionCd')"
            :disabled="isEditing"
          />
          <v-text-field
            v-model="form.regionNm"
            label="地域名"
            variant="outlined"
            density="comfortable"
            required
            :rules="[v => !!v || '地域名は必須です']"
            :error-messages="getErrorMessages('regionNm')"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">キャンセル</v-btn>
          <v-btn color="primary" @click="save" :loading="saving">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card title="削除確認">
        <v-card-text>
          地域「<span class="font-weight-bold">{{ deleteItem?.regionNm }}</span>」を削除してもよろしいですか？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">キャンセル</v-btn>
          <v-btn color="error" @click="doDelete" :loading="deleting">削除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue'
import { useConfigStore, type Region } from '@/stores/configStore'

const configStore = useConfigStore()

const headers = [
  { title: '地域コード', key: 'regionCd', align: 'center' as const },
  { title: '地域名', key: 'regionNm' },
  { title: '操作', key: 'actions', align: 'end' as const, sortable: false },
]

const dialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const saving = ref(false)
const deleting = ref(false)
// 编辑模式标志：true=编辑，false=新增
const isEditing = ref(false)

// 验证错误状态
const validationErrors = ref<Record<string, string>>({})

const clearErrors = () => {
  validationErrors.value = {}
}

const getErrorMessages = (field: string): string[] => {
  const error = validationErrors.value[field]
  return error ? [error] : []
}

const defaultForm = (): Region => ({
  regionCd: undefined,
  regionNm: '',
})

const form = ref<Region>(defaultForm())
const deleteItem = ref<Region | null>(null)

const openDialog = (item?: Region) => {
  clearErrors()
  if (item) {
    form.value = { ...item }
    isEditing.value = true
  } else {
    form.value = defaultForm()
    isEditing.value = false
  }
  dialog.value = true
}

const save = async () => {
  clearErrors()
  let hasError = false

  // 表单验证：地域コード必須
  if (!form.value.regionCd) {
    validationErrors.value.regionCd = '地域コードは必須です'
    hasError = true
  }
  // 表单验证：地域名必須
  if (!form.value.regionNm) {
    validationErrors.value.regionNm = '地域名は必須です'
    hasError = true
  }

  if (hasError) return

  saving.value = true
  try {
    if (isEditing.value) {
      // 更新時は pathVariable の ID を使用
      await configStore.updateRegion(form.value.regionCd, form.value)
    } else {
      // 新規作成時はフォームデータをそのまま送信
      await configStore.createRegion(form.value)
    }
    dialog.value = false
  } catch (error: any) {
    console.error('保存エラー:', error)
    // 后端验证错误处理：error.data 包含字段级错误
    if (error.data && typeof error.data === 'object') {
      validationErrors.value = error.data
    }
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: Region) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deleteItem.value?.regionCd) return

  deleting.value = true
  try {
    await configStore.deleteRegion(deleteItem.value.regionCd)
    deleteDialog.value = false
  } catch (error) {
    console.error('削除エラー:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  configStore.fetchRegion()
})
</script>

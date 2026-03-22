<template>
  <div>
    <!-- 工具栏 -->
    <v-toolbar flat>
      <v-toolbar-title>国家一覧</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        追加
      </v-btn>
    </v-toolbar>

    <!-- 数据表格 -->
    <v-data-table
      :headers="headers"
      :items="configStore.countryList"
      :loading="configStore.countryLoading"
      hover
    >
      <template v-slot:item.countryCd="{ item }">
        <v-chip color="primary" size="small">{{ item.countryCd }}</v-chip>
      </template>

      <template v-slot:item.regionCd="{ item }">
        <v-chip color="secondary" size="small">
          {{ getRegionName(item.regionCd) }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon icon="mdi-pencil" size="small" class="me-2" @click="openDialog(item)"></v-icon>
        <v-icon icon="mdi-delete" size="small" color="error" @click="confirmDelete(item)"></v-icon>
      </template>
    </v-data-table>

    <!-- 编辑对话框 -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEditing ? '国家編集' : '国家追加'">
        <v-card-text>
          <v-text-field
            v-model="form.countryCd"
            label="国コード"
            type="number"
            variant="outlined"
            density="comfortable"
            required
            :rules="[v => v !== undefined && v !== null && v !== '' ? true : '国コードは必須です']"
            :error-messages="getErrorMessages('countryCd')"
            :disabled="isEditing"
          />
          <v-select
            v-model="form.regionCd"
            :items="regionOptions"
            item-title="regionNm"
            item-value="regionCd"
            label="所属地域"
            variant="outlined"
            density="comfortable"
            required
            :rules="[v => !!v || '所属地域は必須です']"
            :error-messages="getErrorMessages('regionCd')"
          />
          <v-text-field
            v-model="form.countryNm"
            label="国名"
            variant="outlined"
            density="comfortable"
            required
            :rules="[v => !!v || '国名は必須です']"
            :error-messages="getErrorMessages('countryNm')"
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
          国「<span class="font-weight-bold">{{ deleteItem?.countryNm }}</span>」を削除してもよろしいですか？
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
import { useConfigStore, type Country } from '@/stores/configStore'

const configStore = useConfigStore()

const headers = [
  { title: '国コード', key: 'countryCd', align: 'center' as const },
  { title: '所属地域', key: 'regionCd' },
  { title: '国名', key: 'countryNm' },
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

const defaultForm = (): Country => ({
  countryCd: undefined,
  regionCd: 0,
  countryNm: '',
})

const form = ref<Country>(defaultForm())
const deleteItem = ref<Country | null>(null)

const regionOptions = computed(() => configStore.regionList)

const getRegionName = (regionCd: number) => {
  const region = configStore.regionList.find(r => r.regionCd === regionCd)
  return region?.regionNm || String(regionCd)
}

const openDialog = (item?: Country) => {
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

  // 表单验证：国コード必須
  if (!form.value.countryCd) {
    validationErrors.value.countryCd = '国コードは必須です'
    hasError = true
  }
  // 表单验证：所属地域必須
  if (!form.value.regionCd) {
    validationErrors.value.regionCd = '所属地域は必須です'
    hasError = true
  }
  // 表单验证：国名必須
  if (!form.value.countryNm) {
    validationErrors.value.countryNm = '国名は必須です'
    hasError = true
  }

  if (hasError) return

  saving.value = true
  try {
    if (isEditing.value) {
      // 更新時は pathVariable の ID を使用
      await configStore.updateCountry(form.value.countryCd, form.value)
    } else {
      // 新規作成時はフォームデータをそのまま送信
      await configStore.createCountry(form.value)
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

const confirmDelete = (item: Country) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deleteItem.value?.countryCd) return

  deleting.value = true
  try {
    await configStore.deleteCountry(deleteItem.value.countryCd)
    deleteDialog.value = false
  } catch (error) {
    console.error('削除エラー:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  configStore.fetchRegion()
  configStore.fetchCountry()
})
</script>

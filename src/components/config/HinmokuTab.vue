<template>
  <div>
    <!-- 工具栏 -->
    <v-toolbar flat>
      <v-toolbar-title>品目一覧</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        追加
      </v-btn>
    </v-toolbar>

    <!-- 数据表格 -->
    <v-data-table
      :headers="headers"
      :items="configStore.hinmokuList"
      :loading="configStore.hinmokuLoading"
      hover
    >
      <template v-slot:item.hinmokuCd="{ item }">
        <v-chip color="primary" size="small">{{ item.hinmokuCd }}</v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon icon="mdi-pencil" size="small" class="me-2" @click="openDialog(item)"></v-icon>
        <v-icon icon="mdi-delete" size="small" color="error" @click="confirmDelete(item)"></v-icon>
      </template>
    </v-data-table>

    <!-- 编辑对话框 -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEditing ? '品目編集' : '品目追加'">
        <v-card-text>
          <v-text-field
            v-model="form.hinmokuNm"
            label="品目名"
            required
            :rules="[v => !!v || '品目名は必須です']"
          />
          <v-text-field
            v-model="form.hinmokuEn"
            label="品目英語名"
            hint="任意入力"
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
          品目「<span class="font-weight-bold">{{ deleteItem?.hinmokuNm }}</span>」を削除してもよろしいですか？
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
import { useConfigStore, type Hinmoku } from '@/stores/configStore'

const configStore = useConfigStore()

const headers = [
  { title: '品目コード', key: 'hinmokuCd', align: 'center' },
  { title: '品目名', key: 'hinmokuNm' },
  { title: '英語名', key: 'hinmokuEn' },
  { title: '操作', key: 'actions', align: 'end', sortable: false },
]

const dialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = computed(() => !!form.value.hinmokuCd)

const defaultForm = (): Hinmoku => ({
  hinmokuNm: '',
  hinmokuEn: '',
})

const form = ref<Hinmoku>(defaultForm())
const deleteItem = ref<Hinmoku | null>(null)

const openDialog = (item?: Hinmoku) => {
  if (item) {
    form.value = { ...item }
  } else {
    form.value = defaultForm()
  }
  dialog.value = true
}

const save = async () => {
  if (!form.value.hinmokuNm) return

  saving.value = true
  try {
    if (isEditing.value) {
      await configStore.updateHinmoku(form.value.hinmokuCd!, form.value)
    } else {
      await configStore.createHinmoku(form.value)
    }
    dialog.value = false
  } catch (error) {
    console.error('保存エラー:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: Hinmoku) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deleteItem.value?.hinmokuCd) return

  deleting.value = true
  try {
    await configStore.deleteHinmoku(deleteItem.value.hinmokuCd)
    deleteDialog.value = false
  } catch (error) {
    console.error('削除エラー:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  configStore.fetchHinmoku()
})
</script>

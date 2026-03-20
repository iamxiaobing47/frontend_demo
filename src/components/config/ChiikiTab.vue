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
      :items="configStore.chiikiList"
      :loading="configStore.chiikiLoading"
      hover
    >
      <template v-slot:item.chiikiCd="{ item }">
        <v-chip color="primary" size="small">{{ item.chiikiCd }}</v-chip>
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
            v-model="form.chiikiNm"
            label="地域名"
            required
            :rules="[v => !!v || '地域名は必須です']"
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
          地域「<span class="font-weight-bold">{{ deleteItem?.chiikiNm }}</span>」を削除してもよろしいですか？
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
import { useConfigStore, type Chiiki } from '@/stores/configStore'

const configStore = useConfigStore()

const headers = [
  { title: '地域コード', key: 'chiikiCd', align: 'center' },
  { title: '地域名', key: 'chiikiNm' },
  { title: '操作', key: 'actions', align: 'end', sortable: false },
]

const dialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = computed(() => !!form.value.chiikiCd)

const defaultForm = (): Chiiki => ({
  chiikiNm: '',
})

const form = ref<Chiiki>(defaultForm())
const deleteItem = ref<Chiiki | null>(null)

const openDialog = (item?: Chiiki) => {
  if (item) {
    form.value = { ...item }
  } else {
    form.value = defaultForm()
  }
  dialog.value = true
}

const save = async () => {
  if (!form.value.chiikiNm) return

  saving.value = true
  try {
    if (isEditing.value) {
      await configStore.updateChiiki(form.value.chiikiCd!, form.value)
    } else {
      await configStore.createChiiki(form.value)
    }
    dialog.value = false
  } catch (error) {
    console.error('保存エラー:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: Chiiki) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deleteItem.value?.chiikiCd) return

  deleting.value = true
  try {
    await configStore.deleteChiiki(deleteItem.value.chiikiCd)
    deleteDialog.value = false
  } catch (error) {
    console.error('削除エラー:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  configStore.fetchChiiki()
})
</script>

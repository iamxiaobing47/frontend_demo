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
      :items="configStore.kuniList"
      :loading="configStore.kuniLoading"
      hover
    >
      <template v-slot:item.kuniCd="{ item }">
        <v-chip color="primary" size="small">{{ item.kuniCd }}</v-chip>
      </template>

      <template v-slot:item.chiikiCd="{ item }">
        <v-chip color="secondary" size="small">
          {{ getChiikiName(item.chiikiCd) }}
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
          <v-select
            v-model="form.chiikiCd"
            :items="chiikiOptions"
            item-title="chiikiNm"
            item-value="chiikiCd"
            label="所属地域"
            required
            :rules="[v => !!v || '所属地域は必須です']"
          />
          <v-text-field
            v-model="form.kuniNm"
            label="国名"
            required
            :rules="[v => !!v || '国名は必須です']"
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
          国「<span class="font-weight-bold">{{ deleteItem?.kuniNm }}</span>」を削除してもよろしいですか？
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
import { useConfigStore, type Kuni } from '@/stores/configStore'

const configStore = useConfigStore()

const headers = [
  { title: '国コード', key: 'kuniCd', align: 'center' },
  { title: '所属地域', key: 'chiikiCd' },
  { title: '国名', key: 'kuniNm' },
  { title: '操作', key: 'actions', align: 'end', sortable: false },
]

const dialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = computed(() => !!form.value.kuniCd)

const defaultForm = (): Kuni => ({
  chiikiCd: 0,
  kuniNm: '',
})

const form = ref<Kuni>(defaultForm())
const deleteItem = ref<Kuni | null>(null)

const chiikiOptions = computed(() => configStore.chiikiList)

const getChiikiName = (chiikiCd: number) => {
  const chiiki = configStore.chiikiList.find(c => c.chiikiCd === chiikiCd)
  return chiiki?.chiikiNm || String(chiikiCd)
}

const openDialog = (item?: Kuni) => {
  if (item) {
    form.value = { ...item }
  } else {
    form.value = defaultForm()
  }
  dialog.value = true
}

const save = async () => {
  if (!form.value.kuniNm || !form.value.chiikiCd) return

  saving.value = true
  try {
    if (isEditing.value) {
      await configStore.updateKuni(form.value.kuniCd!, form.value)
    } else {
      await configStore.createKuni(form.value)
    }
    dialog.value = false
  } catch (error) {
    console.error('保存エラー:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: Kuni) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deleteItem.value?.kuniCd) return

  deleting.value = true
  try {
    await configStore.deleteKuni(deleteItem.value.kuniCd)
    deleteDialog.value = false
  } catch (error) {
    console.error('削除エラー:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  configStore.fetchChiiki()
  configStore.fetchKuni()
})
</script>

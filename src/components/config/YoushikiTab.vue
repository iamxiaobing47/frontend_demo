<template>
  <div>
    <!-- 工具栏 -->
    <v-toolbar flat>
      <v-toolbar-title>申請書テンプレート一覧</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        追加
      </v-btn>
    </v-toolbar>

    <!-- 数据表格 -->
    <v-data-table
      :headers="headers"
      :items="configStore.youshikiList"
      :loading="configStore.youshikiLoading"
      hover
    >
      <template v-slot:item.youshikiId="{ item }">
        <v-chip color="primary" size="small">{{ item.youshikiId }}</v-chip>
      </template>

      <template v-slot:item.kuniCd="{ item }">
        <v-chip color="secondary" size="small">
          {{ getKuniName(item.kuniCd) }}
        </v-chip>
      </template>

      <template v-slot:item.hinmokuCd="{ item }">
        <v-chip color="accent" size="small">
          {{ getHinmokuName(item.hinmokuCd) }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon icon="mdi-pencil" size="small" class="me-2" @click="openDialog(item)"></v-icon>
        <v-icon icon="mdi-delete" size="small" color="error" @click="confirmDelete(item)"></v-icon>
      </template>
    </v-data-table>

    <!-- 编辑对话框 -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card :title="isEditing ? 'テンプレート編集' : 'テンプレート追加'">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.kuniCd"
                :items="kuniOptions"
                item-title="kuniNm"
                item-value="kuniCd"
                label="国"
                required
                :rules="[v => !!v || '国は必須です']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.hinmokuCd"
                :items="hinmokuOptions"
                item-title="hinmokuNm"
                item-value="hinmokuCd"
                label="品目"
                required
                :rules="[v => !!v || '品目は必須です']"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.youshikiNm"
                label="様式名"
                required
                :rules="[v => !!v || '様式名は必須です']"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.filePath"
                label="ファイルパス"
                required
                :rules="[v => !!v || 'ファイルパスは必須です']"
                placeholder="/path/to/template.pdf"
              />
            </v-col>
          </v-row>
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
          テンプレート「<span class="font-weight-bold">{{ deleteItem?.youshikiNm }}</span>」
          を削除してもよろしいですか？
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
import { useConfigStore, type Youshiki } from '@/stores/configStore'

const configStore = useConfigStore()

const headers = [
  { title: '様式 ID', key: 'youshikiId', align: 'center' },
  { title: '国', key: 'kuniCd' },
  { title: '品目', key: 'hinmokuCd' },
  { title: '様式名', key: 'youshikiNm' },
  { title: 'ファイルパス', key: 'filePath' },
  { title: '操作', key: 'actions', align: 'end', sortable: false },
]

const dialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = computed(() => !!form.value.youshikiId)

const defaultForm = (): Youshiki => ({
  kuniCd: 0,
  hinmokuCd: 0,
  youshikiNm: '',
  filePath: '',
})

const form = ref<Youshiki>(defaultForm())
const deleteItem = ref<Youshiki | null>(null)

const kuniOptions = computed(() => configStore.kuniList)
const hinmokuOptions = computed(() => configStore.hinmokuList)

const getKuniName = (kuniCd: number) => {
  const kuni = configStore.kuniList.find(k => k.kuniCd === kuniCd)
  return kuni?.kuniNm || String(kuniCd)
}

const getHinmokuName = (hinmokuCd: number) => {
  const hinmoku = configStore.hinmokuList.find(h => h.hinmokuCd === hinmokuCd)
  return hinmoku?.hinmokuNm || String(hinmokuCd)
}

const openDialog = (item?: Youshiki) => {
  if (item) {
    form.value = { ...item }
  } else {
    form.value = defaultForm()
  }
  dialog.value = true
}

const save = async () => {
  if (!form.value.youshikiNm || !form.value.filePath || !form.value.kuniCd || !form.value.hinmokuCd) return

  saving.value = true
  try {
    if (isEditing.value) {
      await configStore.updateYoushiki(form.value.youshikiId!, form.value)
    } else {
      await configStore.createYoushiki(form.value)
    }
    dialog.value = false
  } catch (error) {
    console.error('保存エラー:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: Youshiki) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deleteItem.value?.youshikiId) return

  deleting.value = true
  try {
    await configStore.deleteYoushiki(deleteItem.value.youshikiId)
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
  configStore.fetchHinmoku()
  configStore.fetchYoushiki()
})
</script>

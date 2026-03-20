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
      :items="configStore.productList"
      :loading="configStore.productLoading"
      hover
    >
      <template v-slot:item.productCd="{ item }">
        <v-chip color="primary" size="small">{{ item.productCd }}</v-chip>
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
            v-model="form.productNm"
            label="品目名"
            required
            :rules="[v => !!v || '品目名は必須です']"
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
          品目「<span class="font-weight-bold">{{ deleteItem?.productNm }}</span>」を削除してもよろしいですか？
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
import { useConfigStore, type Product } from '@/stores/configStore'

const configStore = useConfigStore()

const headers = [
  { title: '品目コード', key: 'productCd', align: 'center' as const },
  { title: '品目名', key: 'productNm' },
  { title: '操作', key: 'actions', align: 'end' as const, sortable: false },
]

const dialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = computed(() => !!form.value.productCd)

const defaultForm = (): Product => ({
  productNm: '',
})

const form = ref<Product>(defaultForm())
const deleteItem = ref<Product | null>(null)

const openDialog = (item?: Product) => {
  if (item) {
    form.value = { ...item }
  } else {
    form.value = defaultForm()
  }
  dialog.value = true
}

const save = async () => {
  if (!form.value.productNm) return

  saving.value = true
  try {
    if (isEditing.value) {
      await configStore.updateProduct(form.value.productCd!, form.value)
    } else {
      await configStore.createProduct(form.value)
    }
    dialog.value = false
  } catch (error) {
    console.error('保存エラー:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: Product) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deleteItem.value?.productCd) return

  deleting.value = true
  try {
    await configStore.deleteProduct(deleteItem.value.productCd)
    deleteDialog.value = false
  } catch (error) {
    console.error('削除エラー:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  configStore.fetchProduct()
})
</script>

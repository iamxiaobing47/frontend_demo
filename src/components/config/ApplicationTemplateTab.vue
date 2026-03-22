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
      :items="configStore.templateList"
      :loading="configStore.templateLoading"
      hover
    >
      <template v-slot:item.templateId="{ item }">
        <v-chip color="primary" size="small">{{ item.templateId }}</v-chip>
      </template>

      <template v-slot:item.regionCd="{ item }">
        <v-chip color="blue" size="small">
          {{ getRegionName(item.regionCd) }}
        </v-chip>
      </template>

      <template v-slot:item.countryCd="{ item }">
        <v-chip color="secondary" size="small">
          {{ getCountryName(item.countryCd) }}
        </v-chip>
      </template>

      <template v-slot:item.productCd="{ item }">
        <v-chip color="accent" size="small">
          {{ getProductName(item.productCd) }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon icon="mdi-pencil" size="small" class="me-2" @click="openDialog(item)"></v-icon>
        <v-icon icon="mdi-delete" size="small" color="error" @click="confirmDelete(item)"></v-icon>
      </template>
    </v-data-table>

    <!-- 编辑对话框 -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card :title="isEditing ? 'テンプレート編集' : 'テンプレート追加'">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.regionCd"
                :items="regionOptions"
                item-title="regionNm"
                item-value="regionCd"
                label="地域"
                required
                :rules="[v => !!v || '地域は必須です']"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.countryCd"
                :items="countryOptions"
                item-title="countryNm"
                item-value="countryCd"
                label="国"
                required
                :rules="[v => !!v || '国は必須です']"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.productCd"
                :items="productOptions"
                item-title="productNm"
                item-value="productCd"
                label="品目"
                required
                :rules="[v => !!v || '品目は必須です']"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.templateNm"
                label="テンプレート名"
                required
                :rules="[v => !!v || 'テンプレート名は必須です']"
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
          テンプレート「<span class="font-weight-bold">{{ deleteItem?.templateNm }}</span>」
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
import { useConfigStore, type ApplicationTemplate } from '@/stores/configStore'

const configStore = useConfigStore()

const headers = [
  { title: 'テンプレート ID', key: 'templateId', align: 'center' as const },
  { title: '地域', key: 'regionCd' },
  { title: '国', key: 'countryCd' },
  { title: '品目', key: 'productCd' },
  { title: 'テンプレート名', key: 'templateNm' },
  { title: 'ファイルパス', key: 'filePath' },
  { title: '操作', key: 'actions', align: 'end' as const, sortable: false },
]

const dialog = shallowRef(false)
const deleteDialog = shallowRef(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = computed(() => !!form.value.templateId)

const defaultForm = (): ApplicationTemplate => ({
  regionCd: 0,
  countryCd: 0,
  productCd: 0,
  templateNm: '',
  filePath: '',
})

const form = ref<ApplicationTemplate>(defaultForm())
const deleteItem = ref<ApplicationTemplate | null>(null)

const regionOptions = computed(() => configStore.regionList)
const countryOptions = computed(() => configStore.countryList)
const productOptions = computed(() => configStore.productList)

const getRegionName = (regionCd: number) => {
  const region = configStore.regionList.find(r => r.regionCd === regionCd)
  return region?.regionNm || String(regionCd)
}

const getCountryName = (countryCd: number) => {
  const country = configStore.countryList.find(c => c.countryCd === countryCd)
  return country?.countryNm || String(countryCd)
}

const getProductName = (productCd: number) => {
  const product = configStore.productList.find(p => p.productCd === productCd)
  return product?.productNm || String(productCd)
}

const openDialog = (item?: ApplicationTemplate) => {
  if (item) {
    form.value = { ...item }
  } else {
    form.value = defaultForm()
  }
  dialog.value = true
}

const save = async () => {
  if (!form.value.templateNm || !form.value.filePath || !form.value.regionCd || !form.value.countryCd || !form.value.productCd) return

  saving.value = true
  try {
    if (isEditing.value) {
      await configStore.updateTemplate(form.value.templateId!, form.value)
    } else {
      await configStore.createTemplate(form.value)
    }
    dialog.value = false
  } catch (error: any) {
    console.error('保存エラー:', error)
    console.error('エラー詳細:', error.response?.data)
    alert('保存に失敗しました：' + (error.response?.data?.message || error.message))
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: ApplicationTemplate) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!deleteItem.value?.templateId) return

  deleting.value = true
  try {
    await configStore.deleteTemplate(deleteItem.value.templateId)
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
  configStore.fetchProduct()
  configStore.fetchTemplate()
})
</script>

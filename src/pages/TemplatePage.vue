<template>
  <div class="template-download-page">
    <div class="page-header">
      <h1 class="text-h4">
        <v-icon icon="mdi-file-download" class="me-2" color="primary"></v-icon>
        申請書テンプレートダウンロード
      </h1>
    </div>

    <!-- 筛选条件 -->
    <v-card class="search-card mb-4" elevation="2">
      <v-card-title class="search-title">
        <v-icon icon="mdi-filter-variant" class="me-2"></v-icon>
        テンプレート検索
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedRegion"
              :items="regionList"
              item-title="regionNm"
              item-value="regionCd"
              label="地域を選択"
              clearable
              variant="outlined"
              density="comfortable"
              @update:model-value="onRegionChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedCountry"
              :items="countryList"
              item-title="countryNm"
              item-value="countryCd"
              label="国を選択"
              :disabled="!selectedRegion"
              clearable
              variant="outlined"
              density="comfortable"
              @update:model-value="onCountryChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedProduct"
              :items="productList"
              item-title="productNm"
              item-value="productCd"
              label="品目を選択"
              clearable
              variant="outlined"
              density="comfortable"
              @update:model-value="fetchTemplates"
            />
          </v-col>
        </v-row>
        <v-row justify="end" align="center">
          <v-col cols="auto">
            <v-btn
              color="grey"
              variant="outlined"
              prepend-icon="mdi-refresh"
              @click="resetFilters"
            >
              フィルターリセット
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-magnify"
              @click="fetchTemplates"
              class="search-btn"
            >
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 模板列表 -->
    <v-card class="result-card" elevation="2">
      <v-card-title class="result-title">
        <v-icon icon="mdi-file-table" class="me-2"></v-icon>
        テンプレート一覧
        <v-chip v-if="templateList.length > 0" color="primary" size="small" class="ml-2">
          {{ templateList.length }}件
        </v-chip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="templateList"
          :loading="loading"
          hover
          fixed-header
          height="400"
          no-data-text="テンプレートが見つかりません"
          class="template-table"
        >
          <template v-slot:item.regionCd="{ item }">
            <v-chip color="blue" size="small" variant="tonal">
              {{ getRegionName(item.regionCd) }}
            </v-chip>
          </template>

          <template v-slot:item.countryCd="{ item }">
            <v-chip color="secondary" size="small" variant="tonal">
              {{ getCountryName(item.countryCd) }}
            </v-chip>
          </template>

          <template v-slot:item.productCd="{ item }">
            <v-chip color="accent" size="small" variant="tonal">
              {{ getProductName(item.productCd) }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              color="primary"
              variant="tonal"
              size="small"
              prepend-icon="mdi-download"
              @click="downloadTemplate(item)"
            >
              ダウンロード
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { useConfigStore, type Region, type Country, type Product, type ApplicationTemplate } from '@/stores/configStore'

const appStore = useAppStore()
const configStore = useConfigStore()

const headers = [
  { title: 'テンプレート ID', key: 'templateId', align: 'center' as const },
  { title: '地域', key: 'regionCd' },
  { title: '国', key: 'countryCd' },
  { title: '品目', key: 'productCd' },
  { title: 'テンプレート名', key: 'templateNm' },
  { title: '操作', key: 'actions', align: 'end' as const, sortable: false },
]

// 筛选条件
const selectedRegion = ref<number | null>(null)
const selectedCountry = ref<number | null>(null)
const selectedProduct = ref<number | null>(null)

// 数据 - 使用 configStore 的数据
const regionList = ref<Region[]>([])
const countryList = ref<Country[]>([])
const productList = ref<Product[]>([])
const templateList = ref<ApplicationTemplate[]>([])
const loading = ref(false)

// 获取数据 - 使用 configStore 的方法
const fetchRegion = async () => {
  await configStore.fetchRegion()
  regionList.value = configStore.regionList
}

const fetchCountryByRegion = async (regionCd: number) => {
  const result = await configStore.fetchCountryByRegion(regionCd)
  countryList.value = result
}

const fetchProduct = async () => {
  await configStore.fetchProduct()
  productList.value = configStore.productList
}

const fetchTemplates = async () => {
  loading.value = true
  try {
    // 构建筛选参数
    const params: Record<string, string> = {}
    if (selectedRegion.value) params.regionCd = String(selectedRegion.value)
    if (selectedCountry.value) params.countryCd = String(selectedCountry.value)
    if (selectedProduct.value) params.productCd = String(selectedProduct.value)

    // 使用 apiClient 发送请求（带有认证）
    const queryString = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    const url = `/api/config/template${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${useAuthStore().token}`
      }
    })
    const result = await response.json()
    templateList.value = result.data || []
  } catch (error) {
    console.error('テンプレート取得エラー:', error)
    templateList.value = []
  } finally {
    loading.value = false
  }
}

// 事件处理
const onRegionChange = () => {
  countryList.value = []
  selectedCountry.value = null
  if (selectedRegion.value) {
    fetchCountryByRegion(selectedRegion.value)
  }
  fetchTemplates()
}

const onCountryChange = () => {
  fetchTemplates()
}

const resetFilters = () => {
  selectedRegion.value = null
  selectedCountry.value = null
  selectedProduct.value = null
  countryList.value = []
  fetchTemplates()
}

// 辅助函数
const getRegionName = (regionCd: number) => {
  const region = regionList.value.find(r => r.regionCd === regionCd)
  return region?.regionNm || String(regionCd)
}

const getCountryName = (countryCd: number) => {
  const country = countryList.value.find(c => c.countryCd === countryCd)
  return country?.countryNm || String(countryCd)
}

const getProductName = (productCd: number) => {
  const product = productList.value.find(p => p.productCd === productCd)
  return product?.productNm || String(productCd)
}

// 下载模板
const downloadTemplate = (template: ApplicationTemplate) => {
  console.log('ダウンロードするテンプレート:', template)
  // TODO: 実際のダウンロード処理を実装
  alert(`テンプレート「${template.templateNm}」のダウンロード機能は準備中です。`)
}

onMounted(() => {
  appStore.setBreadcrumbs([{ title: 'ホーム', to: '/home' }, { title: '申請書テンプレートダウンロード' }])
  fetchRegion()
  fetchProduct()
  fetchTemplates()
})
</script>

<style scoped>
.template-download-page {
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin: 0;
}

.search-card {
  border-radius: 12px;
}

.search-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
  padding: 16px 24px;
}

.search-btn {
  min-width: 120px;
}

.result-card {
  border-radius: 12px;
}

.result-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
  padding: 16px 24px;
  display: flex;
  align-items: center;
}

.template-table {
  border-radius: 8px;
}

.template-table :deep(.v-data-table-header) {
  background-color: #f5f5f5;
}

.template-table :deep(.v-data-table-header th) {
  font-weight: 600;
  color: #333;
}
</style>

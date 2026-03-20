<template>
  <div>
    <h1 class="text-h4 mb-4">申請書テンプレートダウンロード</h1>

    <!-- 筛选条件 -->
    <v-card class="mb-4">
      <v-card-title>テンプレート検索</v-card-title>
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
              @update:model-value="fetchTemplates"
            />
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn color="secondary" variant="outlined" @click="resetFilters">
              フィルターリセット
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" @click="fetchTemplates">
              検索
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 模板列表 -->
    <v-card>
      <v-card-title>テンプレート一覧</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="templateList"
          :loading="loading"
          hover
          no-data-text="テンプレートが見つかりません"
        >
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
            <v-btn
              color="primary"
              variant="text"
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
import { ref, shallowRef, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
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

// 数据
const regionList = ref<Region[]>([])
const countryList = ref<Country[]>([])
const productList = ref<Product[]>([])
const templateList = ref<ApplicationTemplate[]>([])
const loading = ref(false)

// 获取数据
const fetchRegion = async () => {
  try {
    const response = await fetch('/api/config/region')
    const result = await response.json()
    regionList.value = result.data || []
  } catch (error) {
    console.error('地域取得エラー:', error)
  }
}

const fetchCountryByRegion = async (regionCd: number) => {
  try {
    const response = await fetch(`/api/config/country/region/${regionCd}`)
    const result = await response.json()
    countryList.value = result.data || []
  } catch (error) {
    console.error('国取得エラー:', error)
    countryList.value = []
  }
}

const fetchProduct = async () => {
  try {
    const response = await fetch('/api/config/product')
    const result = await response.json()
    productList.value = result.data || []
  } catch (error) {
    console.error('品目取得エラー:', error)
  }
}

const fetchTemplates = async () => {
  loading.value = true
  try {
    let url = '/api/config/template'
    const params: string[] = []

    if (selectedRegion.value) params.push(`regionCd=${selectedRegion.value}`)
    if (selectedCountry.value) params.push(`countryCd=${selectedCountry.value}`)
    if (selectedProduct.value) params.push(`productCd=${selectedProduct.value}`)

    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    const response = await fetch(url)
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

// 下载模板（具体实现待定）
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

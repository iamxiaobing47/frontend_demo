import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import apiClient from '@/services/httpClient'

export interface Region {
  regionCd?: number
  regionNm: string
}

export interface Country {
  countryCd?: number
  regionCd: number
  countryNm: string
}

export interface Product {
  productCd?: number
  productNm: string
}

export interface ApplicationTemplate {
  templateId?: number
  regionCd: number
  countryCd: number
  productCd: number
  templateNm: string
  filePath: string
}

const baseUrl = '/api/config'

export const useConfigStore = defineStore('config', () => {
  // ========== 地域データ ==========
  const regionList = ref<Region[]>([]) as Ref<Region[]>
  const regionLoading = ref(false)

  // 地域 CRUD
  const fetchRegion = async () => {
    try {
      regionLoading.value = true
      const response = await apiClient.get(`${baseUrl}/region`)
      regionList.value = response.data.data || []
    } catch (error: any) {
      console.error('地域取得エラー:', error)
    } finally {
      regionLoading.value = false
    }
  }

  const createRegion = async (data: Region) => {
    console.log('Creating region with data:', JSON.stringify(data))
    const response = await apiClient.post(`${baseUrl}/region`, data)
    console.log('Create response:', response.data)
    await fetchRegion()
  }

  const updateRegion = async (id: number, data: Region) => {
    console.log(`Updating region ${id} with data:`, JSON.stringify(data))
    const response = await apiClient.put(`${baseUrl}/region/${id}`, data)
    console.log('Update response:', response.data)
    await fetchRegion()
  }

  const deleteRegion = async (id: number) => {
    await apiClient.delete(`${baseUrl}/region/${id}`)
    await fetchRegion()
  }

  // ========== 国家データ ==========
  const countryList = ref<Country[]>([]) as Ref<Country[]>
  const countryLoading = ref(false)

  const fetchCountry = async () => {
    try {
      countryLoading.value = true
      const response = await apiClient.get(`${baseUrl}/country`)
      countryList.value = response.data.data || []
    } catch (error: any) {
      console.error('国家取得エラー:', error)
    } finally {
      countryLoading.value = false
    }
  }

  const fetchCountryByRegion = async (regionCd: number) => {
    try {
      const response = await apiClient.get(`${baseUrl}/country/region/${regionCd}`)
      return response.data.data || []
    } catch (error: any) {
      console.error('国取得エラー:', error)
      return []
    }
  }

  const createCountry = async (data: Country) => {
    console.log('Creating country with data:', JSON.stringify(data))
    const response = await apiClient.post(`${baseUrl}/country`, data)
    console.log('Create response:', response.data)
    await fetchCountry()
  }

  const updateCountry = async (id: number, data: Country) => {
    console.log(`Updating country ${id} with data:`, JSON.stringify(data))
    const response = await apiClient.put(`${baseUrl}/country/${id}`, data)
    console.log('Update response:', response.data)
    await fetchCountry()
  }

  const deleteCountry = async (id: number) => {
    await apiClient.delete(`${baseUrl}/country/${id}`)
    await fetchCountry()
  }

  // ========== 品目データ ==========
  const productList = ref<Product[]>([]) as Ref<Product[]>
  const productLoading = ref(false)

  const fetchProduct = async () => {
    try {
      productLoading.value = true
      const response = await apiClient.get(`${baseUrl}/product`)
      productList.value = response.data.data || []
    } catch (error: any) {
      console.error('品目取得エラー:', error)
    } finally {
      productLoading.value = false
    }
  }

  const createProduct = async (data: Product) => {
    console.log('Creating product with data:', JSON.stringify(data))
    const response = await apiClient.post(`${baseUrl}/product`, data)
    console.log('Create response:', response.data)
    await fetchProduct()
  }

  const updateProduct = async (id: number, data: Product) => {
    console.log(`Updating product ${id} with data:`, JSON.stringify(data))
    const response = await apiClient.put(`${baseUrl}/product/${id}`, data)
    console.log('Update response:', response.data)
    await fetchProduct()
  }

  const deleteProduct = async (id: number) => {
    await apiClient.delete(`${baseUrl}/product/${id}`)
    await fetchProduct()
  }

  // ========== 申請書テンプレートデータ ==========
  const templateList = ref<ApplicationTemplate[]>([]) as Ref<ApplicationTemplate[]>
  const templateLoading = ref(false)

  const fetchTemplate = async () => {
    try {
      templateLoading.value = true
      const response = await apiClient.get(`${baseUrl}/template`)
      templateList.value = response.data.data || []
    } catch (error: any) {
      console.error('テンプレート取得エラー:', error)
    } finally {
      templateLoading.value = false
    }
  }

  const createTemplate = async (data: ApplicationTemplate) => {
    await apiClient.post(`${baseUrl}/template`, data)
    await fetchTemplate()
  }

  const updateTemplate = async (id: number, data: ApplicationTemplate) => {
    await apiClient.put(`${baseUrl}/template/${id}`, data)
    await fetchTemplate()
  }

  const deleteTemplate = async (id: number) => {
    await apiClient.delete(`${baseUrl}/template/${id}`)
    await fetchTemplate()
  }

  return {
    // 地域
    regionList,
    regionLoading,
    fetchRegion,
    createRegion,
    updateRegion,
    deleteRegion,
    // 国家
    countryList,
    countryLoading,
    fetchCountry,
    fetchCountryByRegion,
    createCountry,
    updateCountry,
    deleteCountry,
    // 品目
    productList,
    productLoading,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    // 申請書テンプレート
    templateList,
    templateLoading,
    fetchTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  }
})

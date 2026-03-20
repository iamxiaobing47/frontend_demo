import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import apiClient from '@/services/httpClient'
import type { AxiosRequestConfig } from 'axios'

export interface Chiiki {
  chiikiCd?: number
  chiikiNm: string
}

export interface Kuni {
  kuniCd?: number
  chiikiCd: number
  kuniNm: string
}

export interface Hinmoku {
  hinmokuCd?: number
  hinmokuNm: string
  hinmokuEn?: string
}

export interface Youshiki {
  youshikiId?: number
  kuniCd: number
  hinmokuCd: number
  youshikiNm: string
  filePath: string
}

const baseUrl = '/api/config'

export const useConfigStore = defineStore('config', () => {
  // ========== 地域数据 ==========
  const chiikiList = ref<Chiiki[]>([]) as Ref<Chiiki[]>
  const chiikiLoading = ref(false)

  // 地城 CRUD
  const fetchChiiki = async () => {
    try {
      chiikiLoading.value = true
      const response = await apiClient.get(`${baseUrl}/chiiki`)
      chiikiList.value = response.data.data || []
    } catch (error: any) {
      console.error('地域取得エラー:', error)
    } finally {
      chiikiLoading.value = false
    }
  }

  const createChiiki = async (data: Chiiki) => {
    await apiClient.post(`${baseUrl}/chiiki`, data)
    await fetchChiiki()
  }

  const updateChiiki = async (id: number, data: Chiiki) => {
    await apiClient.put(`${baseUrl}/chiiki/${id}`, data)
    await fetchChiiki()
  }

  const deleteChiiki = async (id: number) => {
    await apiClient.delete(`${baseUrl}/chiiki/${id}`)
    await fetchChiiki()
  }

  // ========== 国家数据 ==========
  const kuniList = ref<Kuni[]>([]) as Ref<Kuni[]>
  const kuniLoading = ref(false)

  const fetchKuni = async () => {
    try {
      kuniLoading.value = true
      const response = await apiClient.get(`${baseUrl}/kuni`)
      kuniList.value = response.data.data || []
    } catch (error: any) {
      console.error('国家取得エラー:', error)
    } finally {
      kuniLoading.value = false
    }
  }

  const fetchKuniByChiiki = async (chiikiCd: number) => {
    try {
      const response = await apiClient.get(`${baseUrl}/kuni/chiiki/${chiikiCd}`)
      return response.data.data || []
    } catch (error: any) {
      console.error('国取得エラー:', error)
      return []
    }
  }

  const createKuni = async (data: Kuni) => {
    await apiClient.post(`${baseUrl}/kuni`, data)
    await fetchKuni()
  }

  const updateKuni = async (id: number, data: Kuni) => {
    await apiClient.put(`${baseUrl}/kuni/${id}`, data)
    await fetchKuni()
  }

  const deleteKuni = async (id: number) => {
    await apiClient.delete(`${baseUrl}/kuni/${id}`)
    await fetchKuni()
  }

  // ========== 品目数据 ==========
  const hinmokuList = ref<Hinmoku[]>([]) as Ref<Hinmoku[]>
  const hinmokuLoading = ref(false)

  const fetchHinmoku = async () => {
    try {
      hinmokuLoading.value = true
      const response = await apiClient.get(`${baseUrl}/hinmoku`)
      hinmokuList.value = response.data.data || []
    } catch (error: any) {
      console.error('品目取得エラー:', error)
    } finally {
      hinmokuLoading.value = false
    }
  }

  const createHinmoku = async (data: Hinmoku) => {
    await apiClient.post(`${baseUrl}/hinmoku`, data)
    await fetchHinmoku()
  }

  const updateHinmoku = async (id: number, data: Hinmoku) => {
    await apiClient.put(`${baseUrl}/hinmoku/${id}`, data)
    await fetchHinmoku()
  }

  const deleteHinmoku = async (id: number) => {
    await apiClient.delete(`${baseUrl}/hinmoku/${id}`)
    await fetchHinmoku()
  }

  // ========== 申请书模板数据 ==========
  const youshikiList = ref<Youshiki[]>([]) as Ref<Youshiki[]>
  const youshikiLoading = ref(false)

  const fetchYoushiki = async () => {
    try {
      youshikiLoading.value = true
      const response = await apiClient.get(`${baseUrl}/youshiki`)
      youshikiList.value = response.data.data || []
    } catch (error: any) {
      console.error('様式取得エラー:', error)
    } finally {
      youshikiLoading.value = false
    }
  }

  const createYoushiki = async (data: Youshiki) => {
    await apiClient.post(`${baseUrl}/youshiki`, data)
    await fetchYoushiki()
  }

  const updateYoushiki = async (id: number, data: Youshiki) => {
    await apiClient.put(`${baseUrl}/youshiki/${id}`, data)
    await fetchYoushiki()
  }

  const deleteYoushiki = async (id: number) => {
    await apiClient.delete(`${baseUrl}/youshiki/${id}`)
    await fetchYoushiki()
  }

  return {
    // 地域
    chiikiList,
    chiikiLoading,
    fetchChiiki,
    createChiiki,
    updateChiiki,
    deleteChiiki,
    // 国家
    kuniList,
    kuniLoading,
    fetchKuni,
    fetchKuniByChiiki,
    createKuni,
    updateKuni,
    deleteKuni,
    // 品目
    hinmokuList,
    hinmokuLoading,
    fetchHinmoku,
    createHinmoku,
    updateHinmoku,
    deleteHinmoku,
    // 申请书模板
    youshikiList,
    youshikiLoading,
    fetchYoushiki,
    createYoushiki,
    updateYoushiki,
    deleteYoushiki,
  }
})

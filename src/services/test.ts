import { DefaultApi } from '@/api/generated'

const defaultApi = new DefaultApi()

export const testApi = async () => {

    const response = await defaultApi.test()
    return response.data.data || ''
 
}

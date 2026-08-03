import { apiClient } from '@/utils/axios'
import { unwrap } from './client'
import type { ApiMetric } from './types'

export const getMetrics = async (): Promise<ApiMetric[]> => {
  const res = await apiClient.get('/metrics')
  return unwrap<ApiMetric[]>(res.data).data
}

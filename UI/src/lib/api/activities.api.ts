import { apiClient } from '@/utils/axios'
import { unwrap, type PaginationMeta } from './client'
import type { ApiActivity } from './types'

export const getActivities = async (
  query: { page?: number; limit?: number } = {},
): Promise<{ activities: ApiActivity[]; meta?: PaginationMeta }> => {
  const res = await apiClient.get('/activities', { params: query })
  const { data, meta } = unwrap<ApiActivity[]>(res.data)
  return { activities: data, meta }
}

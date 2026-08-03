import { apiClient } from '@/utils/axios'
import { unwrap, type PaginationMeta } from './client'
import type { ApiClearance, ApiClearanceItem, ApiClearanceStep } from './types'

export interface ClearanceQuery {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export const getMyClearance = async (): Promise<{
  clearance: ApiClearance | null
  steps: ApiClearanceStep[]
}> => {
  const res = await apiClient.get('/clearance/me')
  const { data } = unwrap<{ clearance: ApiClearance | null; steps: ApiClearanceStep[] }>(res.data)
  return data
}

export const getClearanceList = async (
  query: ClearanceQuery = {},
): Promise<{ clearances: ApiClearanceItem[]; meta?: PaginationMeta }> => {
  const res = await apiClient.get('/clearance', { params: query })
  const { data, meta } = unwrap<ApiClearanceItem[]>(res.data)
  return { clearances: data, meta }
}

export const clearStudent = async (studentId: string): Promise<void> => {
  const res = await apiClient.patch(`/clearance/${studentId}/clear`)
  unwrap(res.data)
}

import { apiClient } from '@/utils/axios'
import { unwrap, type PaginationMeta } from './client'
import type { ApiAuditLog } from './types'

export interface AuditLogQuery {
  page?: number
  limit?: number
  search?: string
  category?: string
}

export const getAuditLogs = async (
  query: AuditLogQuery = {},
): Promise<{ logs: ApiAuditLog[]; meta?: PaginationMeta }> => {
  const res = await apiClient.get('/audit-logs', { params: query })
  const { data, meta } = unwrap<ApiAuditLog[]>(res.data)
  return { logs: data, meta }
}

export const clearAuditLogs = async (): Promise<void> => {
  const res = await apiClient.delete('/audit-logs')
  unwrap(res.data)
}

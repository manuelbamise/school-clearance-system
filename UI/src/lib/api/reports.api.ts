import { apiClient } from '@/utils/axios'
import { unwrap, type PaginationMeta } from './client'
import type { ApiReport } from './types'

export interface ReportQuery {
  page?: number
  limit?: number
  search?: string
  status?: 'pending' | 'resolved'
}

export const createReport = async (body: { title: string; content: string }): Promise<ApiReport> => {
  const res = await apiClient.post('/reports', body)
  return unwrap<ApiReport>(res.data).data
}

export const getReports = async (
  query: ReportQuery = {},
): Promise<{ reports: ApiReport[]; meta?: PaginationMeta }> => {
  const res = await apiClient.get('/reports', { params: query })
  const { data, meta } = unwrap<ApiReport[]>(res.data)
  return { reports: data, meta }
}

export const updateReportStatus = async (
  id: string,
  body: { status: 'pending' | 'resolved' },
): Promise<ApiReport> => {
  const res = await apiClient.patch(`/reports/${id}`, body)
  return unwrap<ApiReport>(res.data).data
}

export const deleteReport = async (id: string): Promise<void> => {
  const res = await apiClient.delete(`/reports/${id}`)
  unwrap(res.data)
}

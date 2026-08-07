import { apiClient } from '@/utils/axios'
import { unwrap, type PaginationMeta } from './client'
import type { ApiDocument, ApiDocumentStatus } from './types'

export interface DocumentQuery {
  page?: number
  limit?: number
  status?: ApiDocumentStatus
  search?: string
}

export const uploadDocument = async (form: FormData): Promise<ApiDocument> => {
  const res = await apiClient.post('/documents', form)
  return unwrap<ApiDocument>(res.data).data
}

export const getMyDocuments = async (
  query: DocumentQuery = {},
): Promise<{ documents: ApiDocument[]; meta?: PaginationMeta }> => {
  const res = await apiClient.get('/documents', { params: query })
  const { data, meta } = unwrap<ApiDocument[]>(res.data)
  return { documents: data, meta }
}

export const getDocument = async (id: string): Promise<ApiDocument> => {
  const res = await apiClient.get(`/documents/${id}`)
  return unwrap<ApiDocument>(res.data).data
}

export const getInbox = async (
  query: DocumentQuery = {},
): Promise<{ documents: ApiDocument[]; meta?: PaginationMeta }> => {
  const res = await apiClient.get('/documents/inbox', { params: query })
  const { data, meta } = unwrap<ApiDocument[]>(res.data)
  return { documents: data, meta }
}

export const reviewDocument = async (
  id: string,
  body: { status: ApiDocumentStatus; rejectionReason?: string },
): Promise<ApiDocument> => {
  const res = await apiClient.patch(`/documents/${id}/review`, body)
  return unwrap<ApiDocument>(res.data).data
}

export const deleteDocument = async (id: string): Promise<ApiDocument> => {
  const res = await apiClient.delete(`/documents/${id}`)
  return unwrap<ApiDocument>(res.data).data
}

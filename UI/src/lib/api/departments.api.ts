import { apiClient } from '@/utils/axios'
import { unwrap } from './client'
import type { ApiDepartmentRecord } from './types'

export const getDepartments = async (): Promise<ApiDepartmentRecord[]> => {
  const res = await apiClient.get('/departments')
  const { data } = unwrap<ApiDepartmentRecord[]>(res.data)
  return data
}

export const createDepartment = async (name: string): Promise<ApiDepartmentRecord> => {
  const res = await apiClient.post('/departments', { name })
  return unwrap<ApiDepartmentRecord>(res.data).data
}

export const deleteDepartment = async (id: string): Promise<void> => {
  const res = await apiClient.delete(`/departments/${id}`)
  unwrap(res.data)
}

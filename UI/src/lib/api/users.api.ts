import { apiClient } from '@/utils/axios'
import { unwrap, type PaginationMeta } from './client'
import type { ApiRole, ApiUser } from './types'

export interface UserQuery {
  page?: number
  limit?: number
  search?: string
}

export interface CreateUserInput {
  email: string
  password: string
  name: string
  role: ApiRole
  studentId?: string
  staffId?: string
  departmentId?: string | null
}

export const getUsers = async (
  query: UserQuery = {},
): Promise<{ users: ApiUser[]; meta?: PaginationMeta }> => {
  const res = await apiClient.get('/users', { params: query })
  const { data, meta } = unwrap<ApiUser[]>(res.data)
  return { users: data, meta }
}

export const createUser = async (input: CreateUserInput): Promise<ApiUser> => {
  const res = await apiClient.post('/users', input)
  return unwrap<ApiUser>(res.data).data
}

export const updateUser = async (
  id: string,
  input: Partial<CreateUserInput>,
): Promise<ApiUser> => {
  const res = await apiClient.patch(`/users/${id}`, input)
  return unwrap<ApiUser>(res.data).data
}

export const deleteUser = async (id: string): Promise<void> => {
  const res = await apiClient.delete(`/users/${id}`)
  unwrap(res.data)
}

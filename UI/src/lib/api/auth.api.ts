import { apiClient } from '@/utils/axios'
import { unwrap } from './client'
import type { ApiUser } from './types'

export interface LoginResponse {
  user: ApiUser
  token: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await apiClient.post('/auth/login', { email, password })
  return unwrap<LoginResponse>(res.data).data
}

export const getMe = async (): Promise<ApiUser> => {
  const res = await apiClient.get('/auth/me')
  return unwrap<ApiUser>(res.data).data
}

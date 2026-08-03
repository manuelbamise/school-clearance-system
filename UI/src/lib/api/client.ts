import axios from 'axios'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface SuccessEnvelope<T> {
  status: 'success'
  data: T
  message?: string
  meta?: PaginationMeta
}

export interface ErrorEnvelope {
  status: 'error'
  message: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly errors?: Record<string, string[]>

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.errors = errors
  }
}

export function unwrap<T>(
  body: SuccessEnvelope<T> | ErrorEnvelope,
): { data: T; meta?: PaginationMeta } {
  if (body.status !== 'success') {
    const errorBody = body as ErrorEnvelope
    throw new ApiError(errorBody.message || 'Request failed', errorBody.errors)
  }
  return { data: body.data, meta: body.meta }
}

export function errorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (err instanceof ApiError) return err.message
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ErrorEnvelope | undefined
    if (data?.message) return data.message
    if (err.message) return err.message
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}

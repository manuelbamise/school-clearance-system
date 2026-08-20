import { describe, it, expect } from 'vitest'
import { unwrap, errorMessage, ApiError } from '@/lib/api/client'

describe('unwrap', () => {
  it('returns data on success', () => {
    const result = unwrap({ status: 'success', data: 42 })
    expect(result.data).toBe(42)
  })

  it('returns meta when present', () => {
    const result = unwrap({
      status: 'success',
      data: [],
      meta: { page: 1, limit: 10, total: 50, totalPages: 5 },
    })
    expect(result.meta).toEqual({ page: 1, limit: 10, total: 50, totalPages: 5 })
  })

  it('throws ApiError on error status', () => {
    expect(() =>
      unwrap({ status: 'error', message: 'Not found' }),
    ).toThrow('Not found')
  })

  it('preserves validation errors', () => {
    try {
      unwrap({
        status: 'error',
        message: 'Validation failed',
        errors: { email: ['Invalid email'] },
      })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).errors).toEqual({ email: ['Invalid email'] })
    }
  })
})

describe('errorMessage', () => {
  it('extracts ApiError message', () => {
    const err = new ApiError('Bad request')
    expect(errorMessage(err)).toBe('Bad request')
  })

  it('extracts Axios error with response data', () => {
    const err = {
      isAxiosError: true,
      response: { data: { message: 'Server error' } },
      message: 'Request failed',
    }
    expect(errorMessage(err)).toBe('Server error')
  })

  it('uses fallback for unknown error types', () => {
    expect(errorMessage('something')).toBe('Something went wrong')
  })

  it('uses custom fallback', () => {
    expect(errorMessage('something', 'Custom fallback')).toBe('Custom fallback')
  })

  it('returns default fallback when no error', () => {
    expect(errorMessage(undefined)).toBe('Something went wrong')
  })
})

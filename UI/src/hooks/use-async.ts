import { useCallback, useEffect, useRef, useState } from 'react'
import { errorMessage } from '@/lib/api/client'

interface UseAsyncOptions {
  enabled?: boolean
}

export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = [],
  options: UseAsyncOptions = {},
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(options.enabled !== false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const run = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      if (mountedRef.current) setData(result)
    } catch (err) {
      if (mountedRef.current) setError(errorMessage(err))
    } finally {
      if (mountedRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    if (options.enabled === false) {
      setIsLoading(false)
      return () => {
        mountedRef.current = false
      }
    }
    void run()
    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const refetch = useCallback(() => {
    void run()
  }, [run])

  return { data, isLoading, error, refetch }
}

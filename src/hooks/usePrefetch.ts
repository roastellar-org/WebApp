import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function usePrefetch<T>(queryKey: unknown[], queryFn: () => Promise<T>) {
  const queryClient = useQueryClient()

  return useCallback(() => {
    void queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 30_000,
    })
  }, [queryClient, queryKey, queryFn])
}

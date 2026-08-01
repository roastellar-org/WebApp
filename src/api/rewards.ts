import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { NftInfo, Page, Reward } from '../types'

export const rewardsApi = {
  list: (page = 1) => api.get<Page<Reward>>(`/api/rewards${page > 1 ? `?page=${page}` : ''}`),

  detail: (id: string) => api.get<Reward>(`/api/rewards/${id}`),

  retry: (id: string) => api.post<Reward>(`/api/rewards/${id}/retry`),

  nftStatus: (id: string) => api.get<NftInfo>(`/api/rewards/${id}/nft-status`),
}

export function useRewardsQuery(page = 1) {
  return useQuery({
    queryKey: ['rewards', page],
    queryFn: () => rewardsApi.list(page),
    staleTime: 10_000,
  })
}

export function useRetryRewardMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rewardsApi.retry(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rewards'] })
    },
  })
}

export function useNftStatusQuery(id: string | null) {
  return useQuery({
    queryKey: ['rewards', 'nft-status', id],
    queryFn: () => rewardsApi.nftStatus(id as string),
    enabled: Boolean(id),
    staleTime: 15_000,
  })
}

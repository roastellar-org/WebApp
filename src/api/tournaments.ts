import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Page, Tournament, TournamentDetail, TournamentStatus } from '../types'

export interface TournamentFilters {
  status?: TournamentStatus | 'ALL'
  page?: number
}

function buildQueryString(filters: TournamentFilters): string {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'ALL') params.set('status', filters.status)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const tournamentsApi = {
  list: (filters: TournamentFilters = {}) =>
    api.get<Page<Tournament>>(`/api/tournaments${buildQueryString(filters)}`),

  detail: (id: string) => api.get<TournamentDetail>(`/api/tournaments/${id}`),

  join: (id: string) => api.post<void>(`/api/tournaments/${id}/join`),

  leave: (id: string) => api.post<void>(`/api/tournaments/${id}/leave`),
}

export function useTournamentsQuery(filters: TournamentFilters) {
  return useQuery({
    queryKey: ['tournaments', filters],
    queryFn: () => tournamentsApi.list(filters),
    staleTime: 10_000,
  })
}

export function useTournamentQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsApi.detail(id as string),
    enabled: Boolean(id),
  })
}

export function useJoinTournamentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tournamentsApi.join(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      void queryClient.invalidateQueries({ queryKey: ['tournament', id] })
    },
  })
}

export function useLeaveTournamentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tournamentsApi.leave(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      void queryClient.invalidateQueries({ queryKey: ['tournament', id] })
    },
  })
}

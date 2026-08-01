import { useQuery } from '@tanstack/react-query'
import { api } from './client'
import type { LeaderboardEntry, LeaderboardPeriod, MyRank } from '../types'

const DEFAULT_LIMIT = 50

export const leaderboardApi = {
  top: (period: LeaderboardPeriod) =>
    api.get<LeaderboardEntry[]>(`/api/leaderboard/top?period=${period}&limit=${DEFAULT_LIMIT}`),

  me: () => api.get<MyRank>('/api/leaderboard/me'),
}

export function useLeaderboardQuery(period: LeaderboardPeriod) {
  return useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => leaderboardApi.top(period),
  })
}

export function useMyRankQuery() {
  return useQuery({
    queryKey: ['leaderboard', 'me'],
    queryFn: leaderboardApi.me,
  })
}

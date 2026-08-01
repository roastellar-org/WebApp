import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { User } from '../types'

export const usersApi = {
  me: () => api.get<User>('/api/users/me'),

  update: (payload: { username?: string; avatarUrl?: string }) =>
    api.patch<User>('/api/users/me', payload),
}

export function useMeQuery() {
  return useQuery({
    queryKey: ['me'],
    queryFn: usersApi.me,
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { username?: string; avatarUrl?: string }) => usersApi.update(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['me'], updated)
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

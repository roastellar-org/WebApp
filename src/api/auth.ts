import { api } from './client'
import type { AuthSession, ChallengeResponse, VerifyRequest } from '../types'

export const authApi = {
  requestChallenge: (address: string) =>
    api.post<ChallengeResponse>('/api/auth/wallet/challenge', { address }, { auth: false }),

  verify: (payload: VerifyRequest) =>
    api.post<AuthSession>('/api/auth/wallet/verify', payload, { auth: false }),

  refresh: (refreshToken: string) =>
    api.post<AuthSession>('/api/auth/refresh', { refreshToken }, { auth: false }),

  logout: (refreshToken: string) =>
    api.post<void>('/api/auth/logout', { refreshToken }, { auth: false, retryOnUnauthorized: false }),
}

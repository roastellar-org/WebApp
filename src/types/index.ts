export interface User {
  id: string
  username: string
  walletAddress: string
  avatarUrl?: string | null
  createdAt: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: User
}

export interface ChallengeResponse {
  nonce: string
  message: string
  expiresAt: string
}

export interface VerifyRequest {
  address: string
  message: string
  signature: string
}

export interface Page<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

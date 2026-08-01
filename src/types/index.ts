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

export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
export type AssetCategory = 'SKIN' | 'BOOST' | 'CHARM' | 'CRATE'

export interface Asset {
  id: string
  name: string
  category: AssetCategory
  rarity: Rarity
  imageUrl?: string | null
  description?: string
  stats?: Record<string, number>
}

export interface SellerSummary {
  id: string
  username: string
  walletAddress: string
  avatarUrl?: string | null
}

export type ListingStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED'

export interface AssetListing {
  id: string
  asset: Asset
  seller: SellerSummary
  price: number
  currency: 'USDT'
  status: ListingStatus
  listedAt: string
}

export interface InventoryItem {
  asset: Asset
  acquiredAt: string
  listingId?: string | null
  listedAt?: string | null
  price?: number | null
}

export interface PurchaseResult {
  transactionId: string
  asset: Asset
  price: number
}

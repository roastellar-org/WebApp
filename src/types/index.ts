export interface User {
  id: string
  username: string
  walletAddress: string
  avatarUrl?: string | null
  createdAt: string
  stats?: UserStats
}

export interface WeeklyActivity {
  date: string
  matches: number
  wins: number
}

export interface UserStats {
  wins: number
  losses: number
  matchesPlayed: number
  tournamentsPlayed: number
  totalEarnings: number
  bestRank: number | null
  winRate: number
  points: number
  weeklyActivity: WeeklyActivity[]
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

export type TournamentStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type TournamentMode = 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN'

export interface PlayerRef {
  id: string
  username: string
  avatarUrl?: string | null
}

export interface Tournament {
  id: string
  name: string
  game: string
  status: TournamentStatus
  mode: TournamentMode
  entryFee: number
  prizePool: number
  currency: 'USDT'
  maxPlayers: number
  registeredPlayers: number
  startsAt: string
  endsAt: string
  winner?: PlayerRef | null
  joined?: boolean
}

export type MatchStatus = 'PENDING' | 'LIVE' | 'COMPLETED'

export interface Match {
  id: string
  tournamentId: string
  round: number
  playerA?: PlayerRef | null
  playerB?: PlayerRef | null
  winnerId?: string | null
  status: MatchStatus
  scheduledAt?: string | null
}

export interface TournamentDetail extends Tournament {
  rounds: number
  matches: Match[]
}

export type LeaderboardPeriod = 'daily' | 'weekly'

export interface LeaderboardEntry {
  rank: number
  playerId: string
  username: string
  avatarUrl?: string | null
  points: number
  wins: number
  matchesPlayed: number
}

export interface MyRank {
  rank: number | null
  points: number
}

export type RewardStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type RewardType = 'POINTS' | 'TOKEN' | 'NFT'

export interface NftInfo {
  contractAddress: string
  tokenId: string
  imageUrl?: string | null
  metadataUri?: string | null
  mintStatus: 'QUEUED' | 'MINTING' | 'MINTED' | 'FAILED'
}

export interface Reward {
  id: string
  type: RewardType
  status: RewardStatus
  amount: number
  currency?: 'USDT' | 'ARX' | null
  source: string
  nft?: NftInfo | null
  createdAt: string
  completedAt?: string | null
}

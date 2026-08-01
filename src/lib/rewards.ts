import type { BadgeTone } from '../Badge'
import type { NftInfo, RewardStatus, RewardType } from '../types'

export const rewardStatusTone: Record<string, BadgeTone> = {
  COMPLETED: 'success',
  PROCESSING: 'brand',
  PENDING: 'warning',
  FAILED: 'danger',
}

export const rewardStatusLabel: Record<string, string> = {
  COMPLETED: 'Completed',
  PROCESSING: 'Processing',
  PENDING: 'Pending',
  FAILED: 'Failed',
}

export const rewardTypeLabel: Record<RewardType, string> = {
  POINTS: 'Points',
  TOKEN: 'Token',
  NFT: 'NFT',
}

export function normalizeRewardStatus(status: string | undefined | null): RewardStatus {
  if (!status) return 'PENDING'
  const upper = status.toUpperCase()
  if (upper === 'COMPLETED' || upper === 'PROCESSING' || upper === 'PENDING' || upper === 'FAILED') {
    return upper
  }
  return 'PENDING'
}

export function normalizeMintStatus(status: string | undefined | null): NftInfo['mintStatus'] {
  if (!status) return 'QUEUED'
  const upper = status.toUpperCase()
  if (upper === 'QUEUED' || upper === 'MINTING' || upper === 'MINTED' || upper === 'FAILED') {
    return upper
  }
  return 'QUEUED'
}

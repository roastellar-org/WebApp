import type { BadgeTone } from '../Badge'
import type { RewardStatus, RewardType } from '../types'

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

import type { BadgeTone } from '../components/Badge'

export const tournamentStatusTone: Record<string, BadgeTone> = {
  OPEN: 'success',
  IN_PROGRESS: 'brand',
  COMPLETED: 'neutral',
  CANCELLED: 'danger',
  DRAFT: 'warning',
}

export const tournamentStatusLabel: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'Live',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DRAFT: 'Draft',
}

export const tournamentModeLabel: Record<string, string> = {
  SINGLE_ELIMINATION: 'Single elim',
  DOUBLE_ELIMINATION: 'Double elim',
  ROUND_ROBIN: 'Round robin',
}

import { describe, expect, it } from 'vitest'
import { normalizeMintStatus, normalizeRewardStatus } from './rewards'

describe('normalizeRewardStatus', () => {
  it('uppercases lowercase statuses from the retry endpoint', () => {
    expect(normalizeRewardStatus('completed')).toBe('COMPLETED')
    expect(normalizeRewardStatus('processing')).toBe('PROCESSING')
    expect(normalizeRewardStatus('pending')).toBe('PENDING')
    expect(normalizeRewardStatus('failed')).toBe('FAILED')
  })

  it('passes canonical statuses through unchanged', () => {
    expect(normalizeRewardStatus('COMPLETED')).toBe('COMPLETED')
    expect(normalizeRewardStatus('FAILED')).toBe('FAILED')
  })

  it('defaults unknown or missing statuses to PENDING', () => {
    expect(normalizeRewardStatus('weird')).toBe('PENDING')
    expect(normalizeRewardStatus('')).toBe('PENDING')
    expect(normalizeRewardStatus(undefined)).toBe('PENDING')
    expect(normalizeRewardStatus(null)).toBe('PENDING')
  })
})

describe('normalizeMintStatus', () => {
  it('uppercases lowercase mint statuses', () => {
    expect(normalizeMintStatus('minted')).toBe('MINTED')
    expect(normalizeMintStatus('queued')).toBe('QUEUED')
    expect(normalizeMintStatus('minting')).toBe('MINTING')
  })

  it('defaults unknown or missing statuses to QUEUED', () => {
    expect(normalizeMintStatus('n/a')).toBe('QUEUED')
    expect(normalizeMintStatus(undefined)).toBe('QUEUED')
    expect(normalizeMintStatus(null)).toBe('QUEUED')
  })
})

import { describe, expect, it } from 'vitest'
import { normalizeWalletError } from './wallet'

describe('normalizeWalletError', () => {
  it('maps numeric code 4001 to USER_REJECTED', () => {
    expect(normalizeWalletError({ code: 4001, message: 'User rejected the request.' }).code).toBe('USER_REJECTED')
  })

  it('maps string rejection codes used by Safari / Coinbase injected providers', () => {
    expect(normalizeWalletError({ code: 'userRejectedRequest' }).code).toBe('USER_REJECTED')
    expect(normalizeWalletError({ code: 'ACTION_REJECTED' }).code).toBe('USER_REJECTED')
    expect(normalizeWalletError({ code: 'action_rejected' }).code).toBe('USER_REJECTED')
  })

  it('maps rejected/denied messages to USER_REJECTED', () => {
    expect(normalizeWalletError({ message: 'User denied message signature.' }).code).toBe('USER_REJECTED')
    expect(normalizeWalletError({ message: 'User rejected the request' }).code).toBe('USER_REJECTED')
  })

  it('maps -32002 to PENDING_REQUEST', () => {
    expect(normalizeWalletError({ code: -32002, message: 'Request already pending' }).code).toBe('PENDING_REQUEST')
  })

  it('maps pending-request messages to PENDING_REQUEST', () => {
    expect(
      normalizeWalletError({ message: 'Request of type wallet_requestAccounts already pending.' }).code,
    ).toBe('PENDING_REQUEST')
    expect(normalizeWalletError({ code: 'ALREADY_PENDING' }).code).toBe('PENDING_REQUEST')
  })

  it('maps unsupported chain codes to UNSUPPORTED_CHAIN', () => {
    expect(normalizeWalletError({ code: 4902 }).code).toBe('UNSUPPORTED_CHAIN')
    expect(normalizeWalletError({ code: 'UNSUPPORTED_CHAIN' }).code).toBe('UNSUPPORTED_CHAIN')
  })

  it('falls back to UNKNOWN for anything else', () => {
    expect(normalizeWalletError(null).code).toBe('UNKNOWN')
    expect(normalizeWalletError('nope').code).toBe('UNKNOWN')
    expect(normalizeWalletError({}).code).toBe('UNKNOWN')
    expect(normalizeWalletError(undefined).code).toBe('UNKNOWN')
  })
})

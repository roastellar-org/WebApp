import { type Eip1193Provider } from 'ethers'

export interface WalletProvider extends Eip1193Provider {
  on?(event: string, listener: (...args: unknown[]) => void): void
  removeListener?(event: string, listener: (...args: unknown[]) => void): void
}

declare global {
  interface Window {
    ethereum?: WalletProvider
  }
}

export type WalletErrorCode =
  | 'NO_PROVIDER'
  | 'USER_REJECTED'
  | 'PENDING_REQUEST'
  | 'UNSUPPORTED_CHAIN'
  | 'UNKNOWN'

export interface WalletError {
  code: WalletErrorCode
  message: string
}

const REJECTED_CODES = new Set<number | string>([
  4001,
  'action_rejected',
  'userrejectedrequest',
  'user_rejected_request',
  'user_rejected',
])

const PENDING_CODES = new Set<number | string>([-32002, 'already_pending'])

export function normalizeWalletError(error: unknown): WalletError {
  if (error && typeof error === 'object') {
    const raw = error as { code?: unknown; message?: unknown }
    const code = raw.code
    const message = typeof raw.message === 'string' ? raw.message.toLowerCase() : ''

    if (typeof code === 'number' && REJECTED_CODES.has(code)) {
      return { code: 'USER_REJECTED', message: 'Signature request was rejected.' }
    }
    if (typeof code === 'string' && REJECTED_CODES.has(code.toLowerCase())) {
      return { code: 'USER_REJECTED', message: 'Signature request was rejected.' }
    }
    if (message.includes('user rejected') || message.includes('user denied')) {
      return { code: 'USER_REJECTED', message: 'Signature request was rejected.' }
    }

    if (typeof code === 'number' && PENDING_CODES.has(code)) {
      return {
        code: 'PENDING_REQUEST',
        message: 'A connection request is already pending. Approve it in your wallet or try again in a moment.',
      }
    }
    if (typeof code === 'string' && PENDING_CODES.has(code.toLowerCase())) {
      return {
        code: 'PENDING_REQUEST',
        message: 'A connection request is already pending. Approve it in your wallet or try again in a moment.',
      }
    }
    if (message.includes('already pending') || message.includes('in progress')) {
      return {
        code: 'PENDING_REQUEST',
        message: 'A connection request is already pending. Approve it in your wallet or try again in a moment.',
      }
    }

    if (code === 4902 || code === 'UNSUPPORTED_CHAIN') {
      return {
        code: 'UNSUPPORTED_CHAIN',
        message: 'This network is not supported. Switch networks in your wallet and try again.',
      }
    }
  }
  return {
    code: 'UNKNOWN',
    message: 'Something went wrong while connecting your wallet. Please try again.',
  }
}

export function getWalletProvider(): WalletProvider | null {
  return typeof window !== 'undefined' ? window.ethereum ?? null : null
}

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

export function normalizeWalletError(error: unknown): WalletError {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: unknown }).code
    if (code === 4001 || code === 'ACTION_REJECTED') {
      return { code: 'USER_REJECTED', message: 'Signature request was rejected.' }
    }
    if (code === -32002) {
      return {
        code: 'PENDING_REQUEST',
        message: 'A connection request is already pending. Check your wallet extension.',
      }
    }
  }
  return { code: 'UNKNOWN', message: 'Something went wrong while connecting your wallet.' }
}

export function getWalletProvider(): WalletProvider | null {
  return typeof window !== 'undefined' ? window.ethereum ?? null : null
}

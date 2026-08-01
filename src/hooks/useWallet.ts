import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserProvider } from 'ethers'
import { getWalletProvider, normalizeWalletError, type WalletError } from '../utils/wallet'

interface WalletState {
  account: string | null
  chainId: string | null
  connecting: boolean
  error: WalletError | null
}

const initialState: WalletState = { account: null, chainId: null, connecting: false, error: null }

export function useWallet() {
  const [state, setState] = useState<WalletState>(initialState)
  const providerRef = useRef<BrowserProvider | null>(null)
  const accountRef = useRef<string | null>(null)

  useEffect(() => {
    const provider = getWalletProvider()
    if (!provider) return

    const onAccountsChanged = (accounts: unknown) => {
      const list = accounts as string[]
      const next = list[0] ?? null
      accountRef.current = next
      setState((prev) => ({ ...prev, account: next }))
    }
    const onChainChanged = (chainId: unknown) => {
      setState((prev) => ({ ...prev, chainId: String(chainId) }))
    }

    provider.on?.('accountsChanged', onAccountsChanged)
    provider.on?.('chainChanged', onChainChanged)
    return () => {
      provider.removeListener?.('accountsChanged', onAccountsChanged)
      provider.removeListener?.('chainChanged', onChainChanged)
    }
  }, [])

  const connect = useCallback(async (): Promise<string | null> => {
    const provider = getWalletProvider()
    if (!provider) {
      setState((prev) => ({
        ...prev,
        error: { code: 'NO_PROVIDER', message: 'No wallet detected. Install MetaMask or another injected wallet.' },
      }))
      return null
    }
    setState((prev) => ({ ...prev, connecting: true, error: null }))
    try {
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[]
      const account = accounts[0] ?? null
      accountRef.current = account
      const ethersProvider = new BrowserProvider(provider)
      providerRef.current = ethersProvider
      const network = await ethersProvider.getNetwork()
      setState({ account, chainId: network.chainId.toString(), connecting: false, error: null })
      return account
    } catch (error) {
      const normalized = normalizeWalletError(error)
      setState((prev) => ({ ...prev, connecting: false, error: normalized }))
      return null
    }
  }, [])

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!accountRef.current || !providerRef.current) {
      throw new Error('Wallet is not connected')
    }
    const signer = await providerRef.current.getSigner(accountRef.current)
    return signer.signMessage(message)
  }, [])

  const disconnect = useCallback(() => {
    accountRef.current = null
    providerRef.current = null
    setState(initialState)
  }, [])

  return { ...state, connect, signMessage, disconnect }
}

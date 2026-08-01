import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { authApi } from '../api/auth'
import { useWallet } from '../hooks/useWallet'
import type { User } from '../types'
import type { WalletError } from '../utils/wallet'
import { clearSession, getSession, isSessionExpired, setSession } from './session'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  walletError: WalletError | null
  connectWallet: () => Promise<string | null>
  signIn: (account: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(() => getSession()?.user ?? null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let active = true
    const restore = async () => {
      const session = getSession()
      if (!session || isSessionExpired(session)) {
        setIsBootstrapping(false)
        return
      }
      try {
        const me = await queryClient.fetchQuery({
          queryKey: ['me'],
          queryFn: () => api.get<User>('/api/users/me'),
        })
        if (active) setUser(me)
      } catch {
        clearSession()
        queryClient.clear()
        if (active) setUser(null)
      } finally {
        if (active) setIsBootstrapping(false)
      }
    }
    void restore()
    return () => {
      active = false
    }
  }, [queryClient])

  useEffect(() => {
    const onUnauthorized = () => {
      clearSession()
      queryClient.clear()
      wallet.disconnect()
      setUser(null)
    }
    window.addEventListener('arenax:unauthorized', onUnauthorized)
    return () => window.removeEventListener('arenax:unauthorized', onUnauthorized)
  }, [queryClient, wallet])

  const connectWallet = useCallback(async (): Promise<string | null> => {
    const account = await wallet.connect()
    return account
  }, [wallet])

  const signIn = useCallback(
    async (account: string): Promise<boolean> => {
      try {
        const challenge = await authApi.requestChallenge(account)
        const signature = await wallet.signMessage(challenge.message)
        const session = await authApi.verify({
          address: account,
          message: challenge.message,
          signature,
        })
        setSession(session)
        setUser(session.user)
        queryClient.setQueryData(['me'], session.user)
        return true
      } catch {
        return false
      }
    },
    [wallet, queryClient],
  )

  const logout = useCallback(async () => {
    const session = getSession()
    if (session?.refreshToken) {
      try {
        await authApi.logout(session.refreshToken)
      } catch {
        // backend may already have revoked the token; continue locally
      }
    }
    clearSession()
    queryClient.clear()
    wallet.disconnect()
    setUser(null)
  }, [queryClient, wallet])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isBootstrapping,
      walletError: wallet.error,
      connectWallet,
      signIn,
      logout,
    }),
    [user, isBootstrapping, wallet, connectWallet, signIn, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

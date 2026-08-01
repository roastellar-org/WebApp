import type { AuthSession } from '../types'

const STORAGE_KEY = 'arenax.session'

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession
    if (!session.accessToken || !session.refreshToken) return null
    return session
  } catch {
    return null
  }
}

export function setSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isSessionExpired(session: AuthSession): boolean {
  return Date.now() >= new Date(session.expiresAt).getTime()
}

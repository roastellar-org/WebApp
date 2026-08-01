import { clearSession, getSession, setSession } from '../auth/session'
import type { AuthSession } from '../types'

const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
  retryOnUnauthorized?: boolean
}

async function refreshSession(): Promise<boolean> {
  const session = getSession()
  if (!session?.refreshToken) return false
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
    if (!response.ok) {
      clearSession()
      return false
    }
    const next = (await response.json()) as AuthSession
    setSession(next)
    return true
  } catch {
    return false
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, retryOnUnauthorized = true, headers, ...rest } = options
  const session = getSession()

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const refreshed = await refreshSession()
    if (refreshed) {
      return request<T>(path, { ...options, retryOnUnauthorized: false })
    }
    clearSession()
    window.dispatchEvent(new Event('arenax:unauthorized'))
    throw new ApiError(401, 'unauthorized', 'Session expired. Connect your wallet again.')
  }

  if (response.status === 401 && auth) {
    window.dispatchEvent(new Event('arenax:unauthorized'))
    throw new ApiError(401, 'unauthorized', 'Session expired. Connect your wallet again.')
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      code?: string
      message?: string
      details?: unknown
    }
    throw new ApiError(
      response.status,
      payload.code ?? 'request_failed',
      payload.message ?? `Request failed with status ${response.status}`,
      payload.details,
    )
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
}

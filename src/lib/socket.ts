import { io, type Socket } from 'socket.io-client'
import { getSession } from '../auth/session'

const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

let socket: Socket | null = null

export function connectSocket(): Socket | null {
  const session = getSession()
  if (!session?.accessToken) return null
  if (socket?.connected) return socket

  socket = io(API_URL, {
    auth: { token: session.accessToken },
    transports: ['websocket', 'polling'],
  })
  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}

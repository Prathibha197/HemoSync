import { io } from 'socket.io-client'
import { getToken } from '@/lib/utils'

let socket = null

export const getSocket = () => socket

export const connectSocket = () => {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL
  if (!url) return null
  if (socket?.connected) return socket
  socket = io(url, {
    auth: { token: getToken() },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1500,
  })
  socket.on('connect',       () => console.info('[HemoSync] Socket connected:', socket.id))
  socket.on('disconnect',    (r) => console.info('[HemoSync] Socket disconnected:', r))
  socket.on('connect_error', (e) => console.warn('[HemoSync] Socket error:', e.message))
  return socket
}

export const disconnectSocket = () => { if (socket) { socket.disconnect(); socket = null } }
export const joinRoom   = (room)           => socket?.emit('join:room', room)
export const emitEvent  = (event, payload) => socket?.emit(event, payload)
export const onEvent    = (event, handler) => socket?.on(event, handler)
export const offEvent   = (event, handler) => socket?.off(event, handler)

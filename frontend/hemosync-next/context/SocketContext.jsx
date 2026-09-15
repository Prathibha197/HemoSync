'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { connectSocket, disconnectSocket, getSocket } from '@/services/socket.service'
import { useAuthContext } from './AuthContext'

const SocketContext = createContext({ socket: null, connected: false })

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuthContext()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    const s = connectSocket()
    if (!s) return
    const onConn = () => setConnected(true)
    const onDisc = () => setConnected(false)
    s.on('connect', onConn); s.on('disconnect', onDisc)
    if (s.connected) setConnected(true)
    return () => { s.off('connect', onConn); s.off('disconnect', onDisc) }
  }, [isAuthenticated])

  useEffect(() => { if (!isAuthenticated) disconnectSocket() }, [isAuthenticated])

  return (
    <SocketContext.Provider value={{ socket: getSocket(), connected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)

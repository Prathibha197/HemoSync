import { useEffect } from 'react'
import { useSocketContext } from '@/context/SocketContext'
import { onEvent, offEvent, joinRoom } from '@/services/socket.service'

export const useSocket = () => useSocketContext()

export function useSocketEvent(event, handler, rooms = []) {
  useEffect(() => {
    rooms.forEach((r) => joinRoom(r))
    onEvent(event, handler)
    return () => offEvent(event, handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])
}

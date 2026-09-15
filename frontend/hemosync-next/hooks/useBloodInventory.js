import { useState, useEffect, useCallback } from 'react'
import { getNetworkInventory } from '@/services/hospital.service'
import { useSocketEvent } from './useSocket'
import { SOCKET_EVENTS } from '@/lib/constants'

export function useBloodInventory() {
  const [inventory, setInventory] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    getNetworkInventory().then(setInventory).finally(() => setLoading(false))
  }, [])

  const onUpdate = useCallback((u) => {
    setInventory((p) => p.map((item) => item.type === u.type ? { ...item, ...u } : item))
  }, [])

  useSocketEvent(SOCKET_EVENTS.INVENTORY_UPDATE, onUpdate)
  return { inventory, loading }
}

import { useState, useEffect, useCallback } from 'react'
import { getDonorAlerts } from '@/services/donor.service'
import { useSocketEvent } from './useSocket'
import { SOCKET_EVENTS } from '@/lib/constants'

export function useDonorAlerts() {
  const [alerts,  setAlerts]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    getDonorAlerts().then(setAlerts).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const onNew       = useCallback((a) => setAlerts((p) => [a, ...p]), [])
  const onFulfilled = useCallback(({ alertId }) => setAlerts((p) => p.filter((a) => a.id !== alertId)), [])

  useSocketEvent(SOCKET_EVENTS.EMERGENCY_REQUEST, onNew)
  useSocketEvent(SOCKET_EVENTS.REQUEST_FULFILLED, onFulfilled)

  return { alerts, loading, error }
}

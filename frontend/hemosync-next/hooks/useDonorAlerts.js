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
    
    // Request notification permission for background alerts
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const onNew = useCallback((a) => {
    setAlerts((p) => [a, ...p])
    
    // Trigger OS-level push notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const notif = new Notification(`🚨 Urgent: ${a.bloodType} Blood Needed!`, {
        body: `${a.units} unit(s) needed at ${a.hospital}. Can you donate? Click here to open your dashboard.`,
        requireInteraction: true, // Keeps it on screen until seen
        icon: '/logo.jpeg'
      })
      notif.onclick = () => {
        window.focus()
        notif.close()
      }
    }
  }, [])

  const onFulfilled = useCallback(({ alertId }) => setAlerts((p) => p.map((a) => a.id === alertId ? { ...a, fulfilled: true } : a)), [])

  useSocketEvent(SOCKET_EVENTS.EMERGENCY_REQUEST, onNew)
  useSocketEvent(SOCKET_EVENTS.REQUEST_FULFILLED, onFulfilled)

  return { alerts, loading, error }
}

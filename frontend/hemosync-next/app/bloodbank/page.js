'use client'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import InventoryGrid from '@/components/bloodbank/InventoryGrid'
import IncomingRequests from '@/components/bloodbank/IncomingRequests'
import ERaktKoshPanel from '@/components/bloodbank/eRaktKoshPanel'
import WhatsAppPanel from '@/components/bloodbank/WhatsAppPanel'

export default function BloodBankDashboard() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Connect to the Socket.IO server on our local backend
    const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      ? process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '') 
      : 'http://localhost:5000'
      
    const socket = io(socketUrl)

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    socket.on('emergency_alert', (data) => {
      console.log('Received emergency alert:', data)
      setAlerts((prev) => [data, ...prev])
      
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const notif = new Notification(`🚨 Urgent: ${data.bloodType} Blood Needed!`, {
          body: `${data.units} unit(s) needed at ${data.hospital}. Click to view incoming requests.`,
          requireInteraction: true,
          icon: '/logo.jpeg'
        })
        notif.onclick = () => {
          window.focus()
          notif.close()
        }
      }
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Blood Bank Dashboard</h1>
        <p className="text-slate text-sm mt-1">Manage inventory, fulfill requests, and sync data.</p>
      </div>

      {alerts.length > 0 && (
        <div className="bg-blood/10 border border-blood text-blood p-4 rounded-md">
          <h3 className="font-bold mb-2">🚨 Live Emergency Alerts</h3>
          <ul className="space-y-1">
            {alerts.map((alert, idx) => (
              <li key={idx} className="text-sm">
                <strong>{alert.message}</strong> - Needed: {alert.data?.bloodType}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <IncomingRequests />
          <InventoryGrid />
        </div>
        <div className="space-y-6">
          <ERaktKoshPanel />
          <WhatsAppPanel />
        </div>
      </div>
    </div>
  )
}

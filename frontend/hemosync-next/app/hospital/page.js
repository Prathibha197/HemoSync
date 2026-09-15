'use client'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import BloodRequestForm from '@/components/hospital/BloodRequestForm'
import NetworkInventory from '@/components/hospital/NetworkInventory'
import RequestsTable from '@/components/hospital/RequestsTable'
import Button from '@/components/ui/Button'

export default function HospitalDashboard() {
  const [showForm, setShowForm] = useState(false)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Connect to the Socket.IO server on our local backend
    const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
      ? process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '') 
      : 'http://localhost:5000'
      
    const socket = io(socketUrl)

    socket.on('emergency_alert', (data) => {
      console.log('Received emergency alert:', data)
      setAlerts((prev) => [data, ...prev])
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Hospital Dashboard</h1>
          <p className="text-slate text-sm mt-1">Manage blood requests and network inventory</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowForm(true)}>+ New Request</Button>
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

      {showForm && <BloodRequestForm onClose={() => setShowForm(false)} onSuccess={() => setShowForm(false)} />}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <RequestsTable limit={5} />
        </div>
        <div>
          <NetworkInventory />
        </div>
      </div>
    </div>
  )
}

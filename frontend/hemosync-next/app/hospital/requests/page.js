'use client'
import { useState } from 'react'
import RequestsTable from '@/components/hospital/RequestsTable'
import BloodRequestForm from '@/components/hospital/BloodRequestForm'
import Button from '@/components/ui/Button'

export default function RequestsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Blood Requests</h1>
          <p className="text-slate text-sm mt-1">All active and fulfilled requests</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowForm(true)}>+ New Request</Button>
      </div>
      {showForm && <BloodRequestForm onClose={() => setShowForm(false)} onSuccess={() => setShowForm(false)} />}
      <RequestsTable />
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { getFHIRStatus } from '@/services/hospital.service'
import Card, { CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function FHIRStatus() {
  const [eps,     setEps]     = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getFHIRStatus().then(setEps).finally(() => setLoading(false)) }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>FHIR R4 Endpoints</CardTitle>
          <Badge variant="live">HL7</Badge>
        </div>
      </CardHeader>
      <CardBody className="!pt-1">
        {loading
          ? <div className="space-y-3 py-2">{[1,2,3].map((i) => <div key={i} className="h-14 bg-panel rounded animate-pulse" />)}</div>
          : eps.map((ep) => (
            <div key={ep.id} className="py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-ink">{ep.resource}</span>
                <Badge variant={ep.status === 'active' ? 'active' : ep.status === 'warning' ? 'warning' : 'stale'}>{ep.status}</Badge>
              </div>
              <p className="font-mono text-2xs text-muted mb-1">{ep.url}</p>
              <div className="flex gap-4 text-xs text-slate font-mono">
                <span>{ep.method}</span>
                <span>{ep.pingMs != null ? `${ep.pingMs}ms` : 'no ping'}</span>
                <span>{ep.callsToday} calls today</span>
              </div>
            </div>
          ))
        }
        <div className="mt-4 p-3 rounded-lg bg-amber/4 border border-amber/12">
          <p className="font-mono text-2xs text-amber tracking-widest mb-1">HMS INTEGRATION</p>
          <p className="text-xs text-muted">Point your HMS to <span className="font-mono text-slate">{process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.hemosync.in'}/fhir/R4/</span> using your API key from settings.</p>
        </div>
      </CardBody>
    </Card>
  )
}

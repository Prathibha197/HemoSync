'use client'
import { useState, useEffect } from 'react'
import { getIncomingRequests, fulfillRequest, declineRequest } from '@/services/bloodbank.service'
import Card, { CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { urgencyBg, urgencyColor, timeAgo } from '@/lib/utils'

function IncomingRequestCard({ req }) {
  const [acted,   setActed]   = useState(null)
  const [loading, setLoading] = useState(null)
  const urgV = req.urgency === 'critical' ? 'critical' : req.urgency === 'urgent' ? 'urgent' : 'standard'

  const fulfill = async () => { setLoading('fulfill'); try { await fulfillRequest(req.id); setActed('fulfilled') } finally { setLoading(null) } }
  const decline = async () => { setLoading('decline'); try { await declineRequest(req.id); setActed('declined')  } finally { setLoading(null) } }

  return (
    <div className={`rounded-xl border p-4 ${urgencyBg(req.urgency)}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-display text-xl ${urgencyColor(req.urgency)}`}>{req.bloodType}</span>
          <Badge variant={urgV}>{req.urgency.toUpperCase()}</Badge>
        </div>
        <span className="font-mono text-2xs text-muted">{timeAgo(req.requestedAt)}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm font-medium text-ink">{req.hospital}</p>
        {req.hospitalPhone && (
          <div className="flex gap-2">
            <a href={`tel:${req.hospitalPhone}`} className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-xs font-mono text-blood border border-white/10 flex items-center gap-1 transition-colors">
              📞 Call
            </a>
            <a href={`https://wa.me/${req.hospitalPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello from the Blood Bank. We have received your ${req.bloodType} blood request for ${req.units} units.`)}`} target="_blank" rel="noreferrer" className="px-2 py-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-md text-xs font-mono text-[#25D366] border border-[#25D366]/20 flex items-center gap-1 transition-colors">
              💬 WhatsApp
            </a>
          </div>
        )}
      </div>
      <p className="text-xs text-muted mt-1">{req.ward} · {req.units} unit{req.units > 1 ? 's' : ''} needed</p>
      <p className="font-mono text-2xs text-dim mb-3">FHIR: {req.fhirId}</p>
      {acted
        ? <span className={`text-xs font-medium font-mono ${acted === 'fulfilled' ? 'text-emerald' : 'text-muted'}`}>{acted === 'fulfilled' ? '✓ Fulfilled' : '✗ Declined'}</span>
        : <div className="flex gap-2">
            <Button variant="success" size="sm" className="flex-1" onClick={fulfill} loading={loading === 'fulfill'}>Fulfill</Button>
            <Button variant="ghost"   size="sm" onClick={decline} loading={loading === 'decline'}>Decline</Button>
          </div>
      }
    </div>
  )
}

export default function IncomingRequests() {
  const [requests, setRequests] = useState([])
  const [loading,  setLoading]  = useState(true)
  useEffect(() => { getIncomingRequests().then(setRequests).finally(() => setLoading(false)) }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blood animate-pulse-dot" />
          <CardTitle>Incoming Requests ({requests.length})</CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        {loading
          ? <div className="space-y-3">{[1,2].map((i) => <div key={i} className="h-28 bg-panel rounded-xl animate-pulse" />)}</div>
          : requests.length === 0
            ? <div className="text-center py-8 text-sm text-muted">No incoming requests right now.</div>
            : <div className="space-y-3">{requests.map((r) => <IncomingRequestCard key={r.id} req={r} />)}</div>
        }
      </CardBody>
    </Card>
  )
}

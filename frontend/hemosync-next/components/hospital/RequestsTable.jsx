'use client'
import { useState, useEffect } from 'react'
import { getHospitalRequests } from '@/services/hospital.service'
import Card, { CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { urgencyColor, timeAgo } from '@/lib/utils'

const FILTERS  = ['All','critical','urgent','standard']
const STATUS_V = { Searching:'warning', Matched:'live', Fulfilled:'active', Pending:'default', Cancelled:'critical' }

export default function RequestsTable({ fullPage }) {
  const [requests, setRequests] = useState([])
  const [filter,   setFilter]   = useState('All')
  const [loading,  setLoading]  = useState(true)
  useEffect(() => { getHospitalRequests().then(setRequests).finally(() => setLoading(false)) }, [])

  const filtered = filter === 'All' ? requests : requests.filter((r) => r.urgency === filter)
  const display  = fullPage ? filtered : filtered.slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Blood Requests</CardTitle>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`font-mono text-[10px] tracking-widest px-2 py-1 rounded-sm border transition-all capitalize ${filter === f ? 'bg-white/8 border-white/20 text-ink' : 'border-white/5 text-muted hover:text-slate'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardBody className="!p-0">
        <div className="px-5">
          <div className="grid grid-cols-7 gap-3 py-2 border-b border-white/5">
            {['FHIR ID','TYPE','UNITS','PATIENT','WARD','URGENCY','STATUS'].map((h) => (
              <span key={h} className="font-mono text-2xs text-dim tracking-widest">{h}</span>
            ))}
          </div>
          {loading
            ? <div className="py-8 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-8 bg-panel rounded animate-pulse" />)}</div>
            : display.length === 0
              ? <div className="py-8 text-center text-sm text-muted">No requests matching filter.</div>
              : display.map((r) => (
                <div key={r.id} className="py-3 border-b border-white/5 last:border-0">
                  <div className="grid grid-cols-7 gap-3 items-center text-sm">
                    <span className="font-mono text-xs text-muted">{r.fhirId}</span>
                    <span className={`font-display text-base ${urgencyColor(r.urgency)}`}>{r.bloodType}</span>
                    <span className="font-mono text-xs text-ink">{r.units}u</span>
                    <span className="text-slate text-xs truncate">{r.patient}</span>
                    <span className="text-muted text-xs">{r.ward}</span>
                    <Badge variant={r.urgency === 'critical' ? 'critical' : r.urgency === 'urgent' ? 'urgent' : 'standard'}>{r.urgency}</Badge>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={STATUS_V[r.status] ?? 'default'}>{r.status}</Badge>
                      <span className="font-mono text-2xs text-dim">{timeAgo(r.postedAt)}</span>
                    </div>
                  </div>
                  {r.matchedDonor && (
                    <div className="mt-3 p-3 bg-surface border border-white/5 rounded-md flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted mb-0.5">Matched Donor</p>
                        <p className="text-sm font-medium text-emerald">{r.matchedDonor.name}</p>
                      </div>
                      <a href={`tel:${r.matchedDonor.phone}`} className="px-3 py-1.5 bg-emerald/10 hover:bg-emerald/20 border border-emerald/20 text-emerald rounded-md text-xs font-mono font-medium flex items-center gap-2 transition-colors">
                        📞 Call Donor
                      </a>
                    </div>
                  )}
                </div>
              ))
          }
        </div>
      </CardBody>
    </Card>
  )
}

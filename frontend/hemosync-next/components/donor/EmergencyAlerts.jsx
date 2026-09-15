'use client'
import { useState } from 'react'
import { useDonorAlerts } from '@/hooks/useDonorAlerts'
import { respondToAlert } from '@/services/donor.service'
import TriageModal from './TriageModal'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { urgencyBg, urgencyColor, timeAgo } from '@/lib/utils'

function AlertCard({ alert }) {
  const [triageOpen, setTriageOpen] = useState(false)
  const [responded,  setResponded]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const urgV = alert.urgency === 'critical' ? 'critical' : alert.urgency === 'urgent' ? 'urgent' : 'standard'

  const confirm = async () => {
    setLoading(true)
    try { await respondToAlert(alert.id, 'accept'); setResponded(true) }
    finally { setLoading(false) }
  }

  return (
    <>
      <div className={`rounded-xl border p-4 ${urgencyBg(alert.urgency)}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-blood">{alert.bloodType}</span>
            <Badge variant={urgV}>{alert.urgency.toUpperCase()}</Badge>
          </div>
          <span className="font-mono text-2xs text-muted">{timeAgo(alert.postedAt)}</span>
        </div>
        <p className="text-sm font-medium text-ink flex items-center justify-between">
          <span>{alert.hospital}</span>
          {alert.hospitalPhone && (
            <a href={`tel:${alert.hospitalPhone}`} className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-xs font-mono text-blood-mid border border-white/10 flex items-center gap-1 transition-colors">
              📞 Call
            </a>
          )}
        </p>
        <p className="text-xs text-muted mt-1">{alert.address} · {alert.distance}</p>
        <p className="text-xs text-muted mb-1">{alert.units} unit{alert.units > 1 ? 's' : ''} needed</p>
        {alert.notes && <p className="text-xs text-slate mb-3 italic">{alert.notes}</p>}
        {responded
          ? <div className="flex items-center gap-2 py-2"><span className="w-2 h-2 rounded-full bg-emerald" /><span className="text-xs text-emerald font-medium">Response submitted — the hospital will contact you.</span></div>
          : <Button size="sm" variant="danger" onClick={() => setTriageOpen(true)} className="mt-3 w-full" loading={loading}>I Can Donate</Button>
        }
      </div>
      <TriageModal open={triageOpen} alert={alert} onClose={() => setTriageOpen(false)} onPass={() => { setTriageOpen(false); confirm() }} />
    </>
  )
}

export default function EmergencyAlerts() {
  const { alerts, loading } = useDonorAlerts()

  if (loading) return (
    <div className="space-y-3">{[1,2].map((i) => <div key={i} className="h-32 bg-surface rounded-xl animate-pulse" />)}</div>
  )

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-blood animate-pulse-dot" />
        <p className="font-mono text-[10px] text-blood tracking-widest">EMERGENCY ALERTS ({alerts.length})</p>
      </div>
      {alerts.length === 0
        ? <div className="bg-surface border border-white/7 rounded-xl p-6 text-center">
            <p className="text-sm text-muted">No active emergency alerts for your blood type.</p>
            <p className="text-xs text-dim mt-1">{"You'll be notified when a matching request comes in."}</p>
          </div>
        : <div className="space-y-3">{alerts.map((a) => <AlertCard key={a.id} alert={a} />)}</div>
      }
    </div>
  )
}

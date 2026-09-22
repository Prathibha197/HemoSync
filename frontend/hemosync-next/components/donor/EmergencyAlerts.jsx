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
  const [cooldownError, setCooldownError] = useState(null)
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
        {alert.fulfilled ? (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎉</span>
              <span className="text-xs text-emerald font-medium">Request Fulfilled!</span>
            </div>
            <p className="text-xs text-slate ml-7">Thank you for donating and saving a life!</p>
          </div>
        ) : responded
          ? (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald" />
                <span className="text-xs text-emerald font-medium">Response submitted! The hospital will call you.</span>
              </div>
              <div className="flex gap-2">
                <a 
                  href={
                    alert.hospital.toLowerCase().includes('srm prime') 
                      ? 'https://www.google.com/maps/dir/?api=1&destination=SRM+Prime+Hospital,+Ramapuram,+Chennai,+Tamil+Nadu'
                      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(alert.hospital)}`
                  } 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 text-center py-1.5 bg-emerald/10 hover:bg-emerald/20 text-emerald text-xs font-medium rounded border border-emerald/20 transition-colors"
                >
                  📍 Navigate
                </a>
                {alert.hospitalPhone && (
                  <>
                    <a href={`tel:${alert.hospitalPhone}`} className="flex-1 text-center py-1.5 bg-white/5 hover:bg-white/10 text-slate text-xs font-medium rounded border border-white/10 transition-colors">
                      📞 Call
                    </a>
                    <a href={`https://wa.me/${alert.hospitalPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I'm reaching out regarding the ${alert.bloodType} blood request at your hospital. I have accepted the request on HemoSync and am on my way.`)}`} target="_blank" rel="noreferrer" className="flex-1 text-center py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-medium rounded border border-[#25D366]/20 transition-colors">
                      💬 WhatsApp
                    </a>
                  </>
                )}
              </div>
            </div>
          )
          )
          : (
            <>
              {cooldownError && (
                <div className="mt-3 mb-2 p-2 bg-amber/10 border border-amber/20 rounded text-amber text-xs text-center font-medium">
                  {cooldownError}
                </div>
              )}
              <Button size="sm" variant="danger" onClick={async () => {
                setLoading(true);
                try {
                  const { getDonorProfile } = require('@/services/donor.service');
                  const profile = await getDonorProfile();
                  if (profile.cooldownDays > 0) {
                    setCooldownError(`You have recently donated and you can't donate now. Cooldown: ${profile.cooldownDays} days remaining.`);
                  } else {
                    setTriageOpen(true);
                  }
                } catch (e) {
                  setTriageOpen(true); // fallback
                } finally {
                  setLoading(false);
                }
              }} className="mt-3 w-full" loading={loading}>
                I Can Donate
              </Button>
            </>
          )
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

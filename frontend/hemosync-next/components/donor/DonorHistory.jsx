'use client'
import { useState, useEffect } from 'react'
import { getDonationHistory } from '@/services/donor.service'
import Badge from '@/components/ui/Badge'
import Card, { CardBody } from '@/components/ui/Card'

export default function DonorHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getDonationHistory().then(setHistory).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="px-4 pt-6 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 bg-surface rounded-lg animate-pulse" />)}</div>

  const completed = history.filter((h) => h.status === 'Completed')

  return (
    <div className="px-4 pt-6">
      <div className="mb-5">
        <p className="font-mono text-[10px] text-blood tracking-[0.07em] mb-1">DONATION HISTORY</p>
        <h1 className="font-display text-2xl text-ink font-normal">Your Donations</h1>
        <p className="text-xs text-muted mt-1">{history.length} records · {completed.length} completed</p>
      </div>
      {history.length === 0
        ? <Card><CardBody><div className="flex flex-col items-center py-8 text-center"><p className="text-sm text-slate">No donations yet</p></div></CardBody></Card>
        : (
          <>
            <Card>
              <CardBody className="!px-4 !py-0">
                {history.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 py-4 border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-blood/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8192c" strokeWidth="2"><path d="M12 2C12 2 4 9 4 14a8 8 0 0016 0c0-5-8-12-8-12z"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-medium text-ink truncate">{item.hospital}</p>
                        <Badge variant={item.status === 'Completed' ? 'active' : item.status === 'Cancelled' ? 'critical' : 'standard'}>{item.status}</Badge>
                      </div>
                      <p className="font-mono text-2xs text-muted">{item.date} · {item.bloodType} · {item.units} unit{item.units > 1 ? 's' : ''}</p>
                      {item.notes && <p className="text-xs text-slate mt-0.5">{item.notes}</p>}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
            {completed.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-emerald/5 border border-emerald/15">
                <p className="font-mono text-[10px] text-emerald tracking-widest mb-1">IMPACT SUMMARY</p>
                <p className="text-sm text-ink">You have donated <span className="text-emerald font-semibold">{completed.length} times</span>, potentially saving up to <span className="text-emerald font-semibold">{completed.length * 3} lives</span>.</p>
              </div>
            )}
          </>
        )
      }
    </div>
  )
}

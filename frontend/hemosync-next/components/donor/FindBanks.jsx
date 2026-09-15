'use client'
import { useState, useEffect } from 'react'
import { getNearbyBanks } from '@/services/donor.service'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import { mapsUrl, inventoryTextColor } from '@/lib/utils'

const FILTERS = ['All','A+','A−','B+','B−','AB+','AB−','O+','O−']

export default function FindBanks() {
  const [banks,   setBanks]   = useState([])
  const [filter,  setFilter]  = useState('All')
  const [loading, setLoading] = useState(true)
  useEffect(() => { getNearbyBanks().then(setBanks).finally(() => setLoading(false)) }, [])

  const filtered = filter === 'All' ? banks : banks.filter((b) => b.availableTypes?.includes(filter))

  if (loading) return <div className="px-4 pt-6 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-36 bg-surface rounded-xl animate-pulse" />)}</div>

  return (
    <div className="px-4 pt-6">
      <div className="mb-5">
        <p className="font-mono text-[10px] text-blood tracking-[0.07em] mb-1">NEARBY BLOOD BANKS</p>
        <h1 className="font-display text-2xl text-ink font-normal">Find a Bank</h1>
        <p className="text-xs text-muted mt-1">{banks.length} banks within 15 km</p>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-4 px-4" style={{ WebkitOverflowScrolling:'touch', scrollbarWidth:'none' }}>
        {FILTERS.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`flex-shrink-0 font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-sm border transition-all ${filter === t ? 'bg-blood text-white border-blood' : 'bg-transparent text-muted border-white/10 hover:border-white/20 hover:text-slate'}`}>
            {t}
          </button>
        ))}
      </div>
      {filtered.length === 0
        ? <div className="text-center py-10 text-sm text-muted">No banks with {filter} available nearby.</div>
        : filtered.map((bank) => (
          <Card key={bank.id} className="mb-3">
            <CardBody>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{bank.name}</p>
                  <p className="text-xs text-muted mt-0.5 truncate">{bank.address}</p>
                </div>
                <Badge variant={bank.openNow ? 'active' : 'default'}>{bank.openNow ? 'Open' : 'Closed'}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate mb-2">
                <span className="font-mono">{bank.distance}</span>
                <span className="text-dim">·</span>
                <span>{bank.phone}</span>
                {bank.emergencySupport && <><span className="text-dim">·</span><span className="text-blood-mid font-mono text-2xs">24/7 EMERGENCY</span></>}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {bank.availableTypes?.map((t) => (
                  <span key={t} className={`font-mono text-2xs px-1.5 py-0.5 rounded-sm bg-white/4 border border-white/5 ${inventoryTextColor(bank.inventory?.[t] ?? 0)}`}>{t}</span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(mapsUrl(`${bank.name} ${bank.address}`), '_blank')}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Get Directions
              </Button>
            </CardBody>
          </Card>
        ))
      }
    </div>
  )
}

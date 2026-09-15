'use client'
import { useState, useEffect } from 'react'
import { getBBInventory } from '@/services/bloodbank.service'
import Card, { CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { inventoryColor, inventoryTextColor, formatTrend } from '@/lib/utils'

export default function InventoryGrid() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { getBBInventory().then(setData).finally(() => setLoading(false)) }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Inventory Management</CardTitle>
          <Badge variant="live">LIVE</Badge>
        </div>
      </CardHeader>
      <CardBody className="!pt-2">
        {loading
          ? <div className="space-y-2">{Array.from({length:8}).map((_,i) => <div key={i} className="h-10 bg-panel rounded animate-pulse" />)}</div>
          : (
            <>
              <div className="grid grid-cols-6 gap-3 mb-1">
                {['TYPE','','','AVAILABILITY','UNITS','7D TREND'].map((h,i) => (
                  <span key={i} className={`font-mono text-2xs text-dim tracking-widest ${i >= 4 ? 'text-right' : ''}`}>{h}</span>
                ))}
              </div>
              {data?.bloodTypes?.map(({ type, total, reserved, trend, critical }) => {
                const available = total - reserved
                const pct = Math.min(100, (available/60)*100)
                const tr  = formatTrend(trend)
                return (
                  <div key={type} className="grid grid-cols-6 items-center gap-3 py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2"><span className="font-display text-base text-ink">{type}</span>{critical && <Badge variant="critical">LOW</Badge>}</div>
                    <div className="col-span-3"><div className="h-1.5 rounded-full bg-white/5"><div className={`h-full rounded-full transition-all ${inventoryColor(available)}`} style={{ width:`${pct}%` }} /></div></div>
                    <div className="text-right"><span className={`font-mono text-xs font-semibold ${inventoryTextColor(available)}`}>{available}</span><span className="font-mono text-2xs text-muted"> /{total}</span></div>
                    <div className={`text-right font-mono text-[10px] ${tr.startsWith('+') ? 'text-emerald' : tr.startsWith('-') ? 'text-blood-mid' : 'text-muted'}`}>{tr}</div>
                  </div>
                )
              })}
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
                {[['TOTAL', data?.totalUnits ?? 0, 'text-ink'],['RESERVED', data?.reservedUnits ?? 0, 'text-amber'],['AVAILABLE', (data?.totalUnits??0)-(data?.reservedUnits??0), 'text-emerald']].map(([l,v,c]) => (
                  <div key={l}><p className="font-mono text-2xs text-muted tracking-widest mb-1">{l}</p><p className={`font-display text-2xl ${c}`}>{v}</p></div>
                ))}
              </div>
            </>
          )
        }
      </CardBody>
    </Card>
  )
}

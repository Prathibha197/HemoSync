'use client'
import { useBloodInventory } from '@/hooks/useBloodInventory'
import Card, { CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { inventoryColor, inventoryTextColor, formatTrend } from '@/lib/utils'

export default function NetworkInventory() {
  const { inventory, loading } = useBloodInventory()
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Network Inventory</CardTitle>
          <Badge variant="live">LIVE</Badge>
        </div>
      </CardHeader>
      <CardBody>
        {loading
          ? <div className="grid grid-cols-4 gap-2">{Array.from({length:8}).map((_,i) => <div key={i} className="h-20 bg-panel rounded-lg animate-pulse" />)}</div>
          : <div className="grid grid-cols-4 gap-2">
              {inventory.map(({ type, units, trend, critical }) => {
                const pct = Math.min(100, (units/50)*100)
                const tr  = formatTrend(trend)
                return (
                  <div key={type} className="p-3 rounded-lg bg-panel border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-base text-ink">{type}</span>
                      {critical && <Badge variant="critical">LOW</Badge>}
                    </div>
                    <div className="h-1 rounded-full bg-white/5 mb-2">
                      <div className={`h-full rounded-full transition-all ${inventoryColor(units)}`} style={{ width:`${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs font-semibold ${inventoryTextColor(units)}`}>{units}u</span>
                      <span className={`font-mono text-[10px] ${tr.startsWith('+') ? 'text-emerald' : tr.startsWith('-') ? 'text-blood-mid' : 'text-muted'}`}>{tr}</span>
                    </div>
                  </div>
                )
              })}
            </div>
        }
      </CardBody>
    </Card>
  )
}

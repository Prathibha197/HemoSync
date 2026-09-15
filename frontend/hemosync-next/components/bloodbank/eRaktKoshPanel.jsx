'use client'
import { useState, useEffect } from 'react'
import { getRaktKoshaStatus, syncRaktKosha } from '@/services/bloodbank.service'
import Card, { CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const SV = { synced:'synced', warning:'warning', stale:'stale' }

export default function ERaktKoshPanel({ expanded }) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => { getRaktKoshaStatus().then(setData).finally(() => setLoading(false)) }, [])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const result = await syncRaktKosha()
      setData((p) => ({ ...p, banks: p?.banks?.map((b) => ({ ...b, syncStatus:'synced', lastSync: new Date().toLocaleString('en-IN') })), lastGlobalSync: result.syncedAt }))
    } finally { setSyncing(false) }
  }

  const banks   = data?.banks ?? []
  const display = expanded ? banks : banks.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div><CardTitle>e-RaktKosh Sync</CardTitle><p className="font-mono text-2xs text-muted mt-0.5">NBTC · CDAC · MoHFW</p></div>
          <Button variant="secondary" size="sm" onClick={handleSync} loading={syncing}>Sync Now</Button>
        </div>
      </CardHeader>
      <CardBody className="!pt-2">
        {loading
          ? <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-12 bg-panel rounded animate-pulse" />)}</div>
          : (
            <>
              {display.map((bank) => (
                <div key={bank.id} className="flex items-start justify-between gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink truncate">{bank.name}</p>
                    <p className="font-mono text-2xs text-muted">{bank.licNo} · {bank.units} units</p>
                    <p className="font-mono text-2xs text-dim">Last: {bank.lastSync}</p>
                  </div>
                  <Badge variant={SV[bank.syncStatus] ?? 'default'}>{bank.syncStatus}</Badge>
                </div>
              ))}
              {!expanded && banks.length > 3 && <p className="text-xs text-muted mt-2 font-mono">+{banks.length - 3} more banks</p>}
            </>
          )
        }
      </CardBody>
    </Card>
  )
}

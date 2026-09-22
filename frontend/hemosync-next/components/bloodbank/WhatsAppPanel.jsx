'use client'
import { useState, useEffect } from 'react'
import { getWhatsAppLog, sendWhatsAppPrompt } from '@/services/bloodbank.service'
import Card, { CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const SV = { delivered:'active', parsed:'synced', review:'warning' }
const GROUP_OPTS = [{value:'all',label:'All Registered Banks'},{value:'tier2',label:'Tier-2 Cities Only'},{value:'tier3',label:'Tier-3 Cities Only'}]

export default function WhatsAppPanel({ expanded }) {
  const [log,     setLog]     = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [group,   setGroup]   = useState('all')
  const [sent,    setSent]    = useState(false)

  useEffect(() => { getWhatsAppLog().then(setLog).finally(() => setLoading(false)) }, [])

  const handleSend = async () => {
    setSending(true)
    try { 
      await sendWhatsAppPrompt({ group, type:'stock_prompt' }); 
      
      // Add a simulated message to the log so the user can visualize it
      const simulatedMessage = {
        id: Date.now(),
        direction: 'out',
        contact: group === 'all' ? 'All Banks' : group === 'tier2' ? 'Tier-2 Banks' : 'Tier-3 Banks',
        time: 'Just now',
        status: 'delivered',
        message: '🏥 HemoSync Automated Prompt: Please reply with your current stock levels for all blood types.'
      };
      setLog(prev => [simulatedMessage, ...prev]);
      
      setSent(true); 
      setTimeout(() => alert('Twilio WhatsApp API requires a registered Twilio Account and Facebook Business verification. This is currently running in simulation mode.'), 100);
      setTimeout(() => setSent(false), 3000) 
    }
    finally { setSending(false) }
  }

  const display = expanded ? log : log.slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Updates</CardTitle>
        <p className="font-mono text-2xs text-muted mt-0.5">via Twilio Business API</p>
      </CardHeader>
      <CardBody className="!pt-2">
        <div className="mb-4 p-3 rounded-lg bg-white/3 border border-white/7">
          <p className="font-mono text-2xs text-muted tracking-widest mb-2">AUTOMATED SCHEDULE</p>
          <div className="flex gap-3 text-xs text-slate mb-3"><span className="font-mono">📨 8:00 AM</span><span className="text-dim">·</span><span className="font-mono">📨 6:00 PM</span></div>
          <select value={group} onChange={(e) => setGroup(e.target.value)}
            className="w-full bg-panel border border-white/10 rounded-sm px-2 py-1.5 text-xs text-ink mb-2 focus:outline-none">
            {GROUP_OPTS.map(({ value, label }) => <option key={value} value={value} className="bg-panel">{label}</option>)}
          </select>
          <Button variant="whatsapp" size="sm" className="w-full" onClick={handleSend} loading={sending}>
            {sent ? '✓ Sent!' : '📤 Send Prompt Now'}
          </Button>
        </div>
        <p className="font-mono text-2xs text-muted tracking-widest mb-2">RECENT LOG</p>
        {loading
          ? <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-12 bg-panel rounded animate-pulse" />)}</div>
          : display.map((entry) => (
            <div key={entry.id} className="flex gap-2.5 py-2.5 border-b border-white/5 last:border-0">
              <span className={`text-xs mt-0.5 ${entry.direction === 'out' ? 'text-muted' : 'text-slate'}`}>{entry.direction === 'out' ? '↑' : '↓'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-mono text-2xs text-muted">{entry.contact}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-2xs text-dim">{entry.time}</span>
                    <Badge variant={SV[entry.status] ?? 'default'}>{entry.status}</Badge>
                  </div>
                </div>
                <p className="text-xs text-slate truncate">{entry.message}</p>
                {entry.parsedData && (
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {Object.entries(entry.parsedData).map(([t, u]) => (
                      <span key={t} className="font-mono text-2xs px-1 py-0.5 rounded-sm bg-emerald/8 border border-emerald/15 text-emerald">{t}:{u}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        }
      </CardBody>
    </Card>
  )
}

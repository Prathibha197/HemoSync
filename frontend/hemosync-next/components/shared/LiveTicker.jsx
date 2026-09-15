'use client'
import { useMemo } from 'react'
import { MOCK_TICKER_ITEMS } from '@/lib/mockData'

export default function LiveTicker({ items }) {
  const all = items ?? MOCK_TICKER_ITEMS
  const doubled = useMemo(() => [...all, ...all], [all])
  return (
    <div className="bg-panel border-b border-white/5 overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 font-mono text-[9px] tracking-[0.1em] text-blood px-3 border-r border-white/5 h-full flex items-center">LIVE</div>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex gap-12 animate-ticker whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="font-mono text-[10px] text-muted tracking-wide flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

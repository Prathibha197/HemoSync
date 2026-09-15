import { cn } from '@/lib/utils'

const V = {
  critical: 'bg-blood/15  border-blood/35  text-blood-mid',
  urgent:   'bg-amber/10  border-amber/30  text-amber',
  standard: 'bg-white/5   border-white/12  text-slate',
  live:     'bg-emerald/10 border-emerald/30 text-emerald',
  synced:   'bg-emerald/10 border-emerald/30 text-emerald',
  warning:  'bg-amber/10  border-amber/30  text-amber',
  stale:    'bg-blood/10  border-blood/25  text-blood-mid',
  active:   'bg-emerald/10 border-emerald/30 text-emerald',
  default:  'bg-white/5   border-white/10  text-muted',
}

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span className={cn(
      'inline-flex items-center font-mono text-2xs tracking-widest uppercase border rounded-sm px-1.5 py-0.5',
      V[variant] ?? V.default, className
    )}>
      {children}
    </span>
  )
}

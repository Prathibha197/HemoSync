import { cn } from '@/lib/utils'

export default function Logo({ size = 32, className }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span style={{ fontSize: size * 0.8 }} className="leading-none select-none">🩸</span>
      <span style={{ fontSize: size }} className="font-display text-ink tracking-tight leading-none">
        Hemo<span className="text-blood">Sync</span>
      </span>
    </div>
  )
}

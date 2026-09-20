import { cn } from '@/lib/utils'

export default function Logo({ size = 32, className }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img src="/logo.jpeg" alt="HemoSync" width={size} height={size} className="rounded-sm object-cover" />
      <span className="font-display text-lg text-ink tracking-tight leading-none">
        Hemo<span className="text-blood">Sync</span>
      </span>
    </div>
  )
}

import { cn } from '@/lib/utils'

export default function Card({ children, className }) {
  return <div className={cn('bg-surface border border-white/7 rounded-xl overflow-hidden', className)}>{children}</div>
}
export function CardHeader({ children, className }) {
  return <div className={cn('px-5 pt-4 pb-3 border-b border-white/5', className)}>{children}</div>
}
export function CardBody({ children, className }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}
export function CardTitle({ children, className }) {
  return <h3 className={cn('text-sm font-semibold text-ink', className)}>{children}</h3>
}

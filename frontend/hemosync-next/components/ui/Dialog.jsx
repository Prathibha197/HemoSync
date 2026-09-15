'use client'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function Dialog({ open, onClose, children, className }) {
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative z-10 bg-surface border border-white/10 rounded-xl shadow-2xl animate-fade-up w-full max-w-md', className)}>
        {children}
      </div>
    </div>
  )
}
export function DialogTitle({ children, className }) {
  return <h2 className={cn('font-display text-xl text-ink font-normal', className)}>{children}</h2>
}
export function DialogDescription({ children, className }) {
  return <p className={cn('text-sm text-muted', className)}>{children}</p>
}

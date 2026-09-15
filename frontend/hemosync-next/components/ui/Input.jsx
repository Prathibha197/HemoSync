'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Input({ label, type='text', value, onChange, placeholder, error, hint, disabled, className, autoComplete }) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div className="mb-4">
      {label && <label className="block font-mono text-[10px] text-muted tracking-widest mb-1.5 uppercase">{label}</label>}
      <div className="relative">
        <input
          type={isPass ? (show ? 'text' : 'password') : type}
          value={value} onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder} disabled={disabled} autoComplete={autoComplete}
          className={cn(
            'w-full bg-panel border rounded-sm px-3 py-2.5 text-sm text-ink placeholder-dim',
            'focus:outline-none focus:ring-1 focus:ring-blood/50 transition-colors',
            error ? 'border-blood/50' : 'border-white/10 hover:border-white/20',
            disabled && 'opacity-50 cursor-not-allowed', isPass && 'pr-10', className
          )}
        />
        {isPass && (
          <button type="button" tabIndex={-1} onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate transition-colors">
            {show
              ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-blood-mid font-mono">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-dim">{hint}</p>}
    </div>
  )
}

export function Select({ label, value, onChange, options=[], error, hint, disabled }) {
  return (
    <div className="mb-4">
      {label && <label className="block font-mono text-[10px] text-muted tracking-widest mb-1.5 uppercase">{label}</label>}
      <select value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled}
        className={cn(
          'w-full bg-panel border rounded-sm px-3 py-2.5 text-sm text-ink',
          'focus:outline-none focus:ring-1 focus:ring-blood/50 transition-colors',
          error ? 'border-blood/50' : 'border-white/10 hover:border-white/20',
          disabled && 'opacity-50 cursor-not-allowed'
        )}>
        {options.map(({ value: v, label: l }) => <option key={v} value={v} className="bg-panel">{l}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-blood-mid font-mono">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-dim">{hint}</p>}
    </div>
  )
}

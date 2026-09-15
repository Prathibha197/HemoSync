import { cn } from '@/lib/utils'

const base = 'inline-flex items-center justify-center font-sans font-semibold rounded-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blood disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none'
const S = { sm:'text-xs px-3 py-1.5', md:'text-sm px-4 py-2.5', lg:'text-sm px-6 py-3', xl:'text-base px-7 py-3.5', full:'text-sm px-4 py-2.5 w-full' }
const V = {
  primary:  'bg-blood     text-white    hover:bg-blood-mid active:scale-[0.98]',
  secondary:'bg-surface   text-ink      border border-white/10 hover:border-white/20',
  outline:  'bg-transparent text-slate  border border-white/12 hover:border-white/25 hover:text-ink',
  ghost:    'bg-transparent text-muted  hover:text-ink',
  success:  'bg-emerald/10 text-emerald border border-emerald/30 hover:bg-emerald/15',
  danger:   'bg-blood-bg  text-blood-mid border border-blood/20 hover:bg-blood/12',
  whatsapp: 'bg-[#25D366] text-white    hover:bg-[#22c55e]',
}

export default function Button({ children, variant='primary', size='md', className, disabled, loading, onClick, type='button' }) {
  return (
    <button type={type} disabled={disabled||loading} onClick={onClick}
      className={cn(base, S[size]??S.md, V[variant]??V.primary, className)}>
      {loading && (
        <svg className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      )}
      {children}
    </button>
  )
}

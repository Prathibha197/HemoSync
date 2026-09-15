'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import { useAuth } from '@/hooks/useAuth'
import { useSocket } from '@/hooks/useSocket'
import { cn } from '@/lib/utils'

const META = {
  donor:     { badge: 'bg-emerald/8 border-emerald/25 text-emerald', color: 'text-emerald', label: 'DONOR PORTAL'      },
  hospital:  { badge: 'bg-amber/8   border-amber/25   text-amber',   color: 'text-amber',   label: 'HOSPITAL PORTAL'   },
  bloodbank: { badge: 'bg-blood-bg  border-blood/25   text-blood',   color: 'text-blood',   label: 'BLOOD BANK PORTAL' },
}

const LINKS = {
  donor:     [{ href:'/donor',             label:'Home'      },{ href:'/donor/history',     label:'History'   },{ href:'/donor/find-banks',  label:'Find Banks' }],
  hospital:  [{ href:'/hospital',          label:'Dashboard' },{ href:'/hospital/requests',  label:'Requests'  },{ href:'/hospital/inventory', label:'Inventory' },{ href:'/hospital/fhir',      label:'FHIR'      }],
  bloodbank: [{ href:'/bloodbank',         label:'Dashboard' },{ href:'/bloodbank/raktkosha',label:'e-RaktKosh'},{ href:'/bloodbank/whatsapp', label:'WhatsApp'  },{ href:'/bloodbank/inventory',label:'Inventory' }],
}

export default function NavBar() {
  const { role, logout } = useAuth()
  const { connected }    = useSocket()
  const pathname         = usePathname()
  const meta  = META[role]  ?? META.donor
  const links = LINKS[role] ?? []

  return (
    <nav className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-white/7">
      <div className="flex items-center gap-5 h-14 px-5 max-w-7xl mx-auto">
        <Logo size={26} />
        <span className={cn('font-mono text-2xs tracking-widest border rounded-sm px-2 py-0.5 shrink-0', meta.badge)}>{meta.label}</span>
        <div className="flex gap-0.5 flex-1 overflow-x-auto">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={cn(
              'px-3 py-1.5 rounded-sm text-xs font-medium whitespace-nowrap transition-colors',
              pathname === href ? `${meta.color} bg-white/5` : 'text-muted hover:text-slate'
            )}>{label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={cn('flex items-center gap-1.5 font-mono text-[10px]', connected ? 'text-emerald' : 'text-dim')}>
            <span className={cn('w-1.5 h-1.5 rounded-full', connected ? 'bg-emerald animate-pulse-dot' : 'bg-dim')} />
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
          <button onClick={logout} className="text-xs text-muted hover:text-slate border border-white/8 rounded-sm px-3 py-1.5 transition-colors">Sign Out</button>
        </div>
      </div>
    </nav>
  )
}

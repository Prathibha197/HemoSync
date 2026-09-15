'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const NAV = [
  { href: '/donor', label: 'Home', icon: '🏠' },
  { href: '/donor/history', label: 'History', icon: '📋' },
  { href: '/donor/find-banks', label: 'Find Banks', icon: '🗺️' },
]

export default function DonorLayout({ children }) {
  const { isAuthenticated, role, loading } = useAuth()
  const router  = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated || role !== 'donor') router.replace('/auth/login?role=donor')
  }, [isAuthenticated, role, loading, router])

  if (loading || !isAuthenticated || role !== 'donor') {
    return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="w-6 h-6 border-2 border-blood border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center">
      <div className="w-full max-w-[480px] flex-1 pb-20">
        {children}
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
        <div className="w-full max-w-[480px] bg-surface/95 backdrop-blur border-t border-white/8 flex items-center">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} className={`flex-1 flex flex-col items-center gap-1 py-3 text-center transition-colors ${active ? 'text-blood' : 'text-muted hover:text-slate'}`}>
                <span className="text-lg leading-none">{icon}</span>
                <span className={`font-mono text-2xs tracking-widest uppercase ${active ? 'text-blood' : ''}`}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

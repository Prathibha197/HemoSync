'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import NavBar from '@/components/shared/NavBar'
import LiveTicker from '@/components/shared/LiveTicker'

const LINKS = [
  { href: '/bloodbank', label: 'Dashboard' },
  { href: '/bloodbank/raktkosha', label: 'e-RaktKosh' },
  { href: '/bloodbank/whatsapp', label: 'WhatsApp' },
  { href: '/bloodbank/inventory', label: 'Inventory' },
]

export default function BloodBankLayout({ children }) {
  const { isAuthenticated, role, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated || role !== 'bloodbank') router.replace('/auth/login?role=bloodbank')
  }, [isAuthenticated, role, loading, router])

  if (loading || !isAuthenticated || role !== 'bloodbank') {
    return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="w-6 h-6 border-2 border-blood border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <NavBar links={LINKS} onLogout={logout} />
      <LiveTicker />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        {children}
      </main>
    </div>
  )
}

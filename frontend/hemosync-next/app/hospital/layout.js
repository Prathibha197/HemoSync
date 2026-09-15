'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import NavBar from '@/components/shared/NavBar'
import LiveTicker from '@/components/shared/LiveTicker'

const LINKS = [
  { href: '/hospital', label: 'Dashboard' },
  { href: '/hospital/requests', label: 'Requests' },
  { href: '/hospital/inventory', label: 'Inventory' },
  { href: '/hospital/fhir', label: 'FHIR Status' },
]

export default function HospitalLayout({ children }) {
  const { isAuthenticated, role, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated || role !== 'hospital') router.replace('/auth/login?role=hospital')
  }, [isAuthenticated, role, loading, router])

  if (loading || !isAuthenticated || role !== 'hospital') {
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

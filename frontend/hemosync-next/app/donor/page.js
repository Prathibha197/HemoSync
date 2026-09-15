'use client'
import DonorProfileCard from '@/components/donor/DonorProfileCard'
import EmergencyAlerts from '@/components/donor/EmergencyAlerts'
import Logo from '@/components/shared/Logo'
import { useAuth } from '@/hooks/useAuth'

export default function DonorHome() {
  const { logout } = useAuth()
  return (
    <div className="px-4 pt-5 pb-4 space-y-4">
      <div className="flex items-center justify-between mb-1">
        <Logo size={24} />
        <button onClick={logout} className="font-mono text-2xs text-muted hover:text-slate tracking-widest uppercase transition-colors">Sign Out</button>
      </div>
      <DonorProfileCard />
      <EmergencyAlerts />
    </div>
  )
}

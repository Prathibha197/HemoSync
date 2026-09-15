'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'

function LoginInner() {
  const params = useSearchParams()
  const role = params.get('role') ?? 'donor'
  return <LoginForm role={role} />
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-muted text-sm font-mono">Loading…</div>}>
        <LoginInner />
      </Suspense>
    </div>
  )
}

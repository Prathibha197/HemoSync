'use client'
import { Suspense } from 'react'
import EmailVerify from '@/components/auth/EmailVerify'

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-muted text-sm font-mono">Loading…</div>}>
        <EmailVerify />
      </Suspense>
    </div>
  )
}

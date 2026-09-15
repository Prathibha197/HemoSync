'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card, { CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { loginUser, verifyLoginOtp } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'

const META = {
  donor:     { label:'Donor',      accent:'text-emerald', cta:'bg-emerald hover:bg-emerald/80 text-white' },
  hospital:  { label:'Hospital',   accent:'text-amber',   cta:'bg-amber    hover:bg-amber/80   text-bg'   },
  bloodbank: { label:'Blood Bank', accent:'text-blood',   cta:'bg-blood    hover:bg-blood-mid  text-white' },
}
const REDIRECT = { donor:'/donor', hospital:'/hospital', bloodbank:'/bloodbank' }

export default function LoginForm({ role='donor' }) {
  const router = useRouter()
  const { authenticate } = useAuth()
  const meta = META[role] ?? META.donor

  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  
  const [pendingOtp, setPendingOtp] = useState(false)
  const [otp, setOtp] = useState('')

  const handleLoginSubmit = async (ev) => {
    ev.preventDefault()
    if (!email || !pass) { setError('Please fill in both fields.'); return }
    setError(''); setLoading(true)
    try {
      const data = await loginUser({ email, password: pass })
      if (data.pendingVerification) {
        setPendingOtp(true)
      } else {
        // Fallback if backend bypassed OTP
        const actualRole = (data.user?.role || role).toLowerCase().replace('_', '')
        authenticate({ token: data.token, user: data.user, role: actualRole })
        router.push(REDIRECT[actualRole] ?? '/')
      }
    } catch (err) {
      setError(err.response?.data?.error ?? 'Invalid credentials. Please try again.')
    } finally { setLoading(false) }
  }

  const handleOtpSubmit = async (ev) => {
    ev.preventDefault()
    if (!otp) { setError('Please enter the OTP sent to your email.'); return }
    setError(''); setLoading(true)
    try {
      const { verifyLoginOtp } = require('@/services/api');
      const data = await verifyLoginOtp(email, otp)
      const actualRole = (data.user?.role || role).toLowerCase().replace('_', '')
      authenticate({ token: data.token, user: data.user, role: actualRole })
      router.push(REDIRECT[actualRole] ?? '/')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Invalid OTP. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6">
        <p className={`font-mono text-[10px] ${meta.accent} tracking-[0.07em] mb-1`}>{meta.label.toUpperCase()} SIGN IN</p>
        <h1 className="font-display text-2xl text-ink font-normal">{pendingOtp ? 'Check your email' : 'Welcome back'}</h1>
      </div>
      <Card>
        <CardBody>
          {!pendingOtp ? (
            <form onSubmit={handleLoginSubmit}>
              <Input label="EMAIL ADDRESS" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
              <Input label="PASSWORD" type="password" value={pass} onChange={setPass} placeholder="Your password" autoComplete="current-password" />
              {error && <p className="text-xs text-blood-mid font-mono mb-3 -mt-1">{error}</p>}
              <Button type="submit" size="full" loading={loading} className={meta.cta}>Sign In as {meta.label}</Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <p className="text-xs text-slate mb-4">We sent a 6-digit verification code to <strong>{email}</strong>. Enter it below to complete sign in.</p>
              <Input label="VERIFICATION CODE" type="text" value={otp} onChange={setOtp} placeholder="123456" />
              {error && <p className="text-xs text-blood-mid font-mono mb-3 -mt-1">{error}</p>}
              <Button type="submit" size="full" loading={loading} className={meta.cta}>Verify & Sign In</Button>
            </form>
          )}
        </CardBody>
      </Card>
      {!pendingOtp && (
        <p className="text-center text-xs text-muted mt-4">
          {"Don't have an account? "}
          <Link href={`/auth/register?role=${role}`} className={`${meta.accent} hover:underline`}>Register</Link>
        </p>
      )}
      <p className="text-center text-xs text-dim mt-2">
        Wrong role? <Link href="/" className="text-muted hover:text-slate">Go back</Link>
      </p>
    </div>
  )
}


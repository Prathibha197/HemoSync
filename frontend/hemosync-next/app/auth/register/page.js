'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import RegisterDonor from '@/components/auth/RegisterDonor'
import RegisterHospital from '@/components/auth/RegisterHospital'
import RegisterBloodBank from '@/components/auth/RegisterBloodBank'
import { useAuth } from '@/hooks/useAuth'
import Card, { CardBody } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { registerUser } from '@/services/api'

function RegisterInner() {
  const params = useSearchParams()
  const router = useRouter()
  const { authenticate } = useAuth()
  const role = params.get('role') ?? 'donor'
  
  const [pendingOtp, setPendingOtp] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [mobileOtp, setMobileOtp] = useState('') // Added Mobile OTP State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleComplete = async (data) => {
    try {
      const roleMap = {
        'donor': 'DONOR',
        'hospital': 'HOSPITAL',
        'bloodbank': 'BLOOD_BANK'
      }
      
      const res = await registerUser({
        ...data,
        role: roleMap[role],
        password: 'password123' // default for scaffolding
      })
      if (res.pendingVerification) {
        setEmail(res.email)
        setPendingOtp(true)
      } else {
        alert('Registration successful!')
        router.push('/auth/login')
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || 'Registration failed')
    } // FIXED: Added missing closing bracket here
  }

  const handleOtpSubmit = async (ev) => {
    ev.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { verifyLoginOtp } = require('@/services/api');
      // FIXED: Sending both Email OTP and Mobile OTP to the backend
      const data = await verifyLoginOtp(email, otp, mobileOtp)
      authenticate({ token: data.token, user: data.user, role })
      router.push('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.')
    } finally { setLoading(false) }
  }

  if (pendingOtp) {
    return (
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-ink font-normal mb-6">Verify Account</h1>
        <Card>
          <CardBody>
            <form onSubmit={handleOtpSubmit}>
              <p className="text-xs text-slate mb-4">Enter the 6-digit codes sent to your email and phone.</p>
              
              <div className="space-y-4">
                <Input 
                  label="EMAIL OTP" 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                />
                <Input 
                  label="MOBILE OTP (From Terminal)" 
                  type="text" 
                  value={mobileOtp} 
                  onChange={(e) => setMobileOtp(e.target.value)} 
                />
              </div>

              {error && <p className="text-xs text-blood-mid font-mono mb-3 mt-3">{error}</p>}
              
              <Button type="submit" size="full" loading={loading} className="bg-emerald hover:bg-emerald/80 text-white mt-4">
                Verify & Sign In
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (role === 'hospital') return <RegisterHospital onComplete={handleComplete} />
  if (role === 'bloodbank') return <RegisterBloodBank onComplete={handleComplete} />
  return <RegisterDonor onComplete={handleComplete} />
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-muted text-sm font-mono">Loading…</div>}>
        <RegisterInner />
      </Suspense>
    </div>
  )
}
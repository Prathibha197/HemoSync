'use client'
import { useState, useRef, useEffect } from 'react'
import Card, { CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const ACCENT = { donor:'text-emerald', hospital:'text-amber', bloodbank:'text-blood' }

export default function EmailVerify({ email, role='donor', onSuccess }) {
  const accent = ACCENT[role] ?? 'text-blood'

  const ref0 = useRef(null); const ref1 = useRef(null); const ref2 = useRef(null)
  const ref3 = useRef(null); const ref4 = useRef(null); const ref5 = useRef(null)
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5]

  const [digits,    setDigits]    = useState(['','','','','',''])
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [resent,    setResent]    = useState(false)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (i, val) => {
    const d = [...digits]; d[i] = val.slice(-1); setDigits(d)
    if (val && i < 5) refs[i + 1]?.current?.focus()
  }
  const handleKeyDown = (i, e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1]?.current?.focus() }
  const handlePaste = (e) => {
    e.preventDefault()
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    const d = [...digits]; p.split('').forEach((ch, i) => { d[i] = ch }); setDigits(d)
    refs[Math.min(p.length, 5)]?.current?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) { setError('Enter all 6 digits.'); return }
    setError(''); setLoading(true)
    try { await onSuccess?.(code) } catch (err) { setError(err.response?.data?.message ?? 'Invalid code. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <p className={`font-mono text-[10px] ${accent} tracking-[0.07em] mb-1`}>EMAIL VERIFICATION</p>
        <h1 className="font-display text-2xl text-ink font-normal mb-1">Check your inbox</h1>
        <p className="text-xs text-muted">We sent a 6-digit code to <span className="text-slate font-mono">{email}</span></p>
      </div>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-10 h-12 text-center text-lg font-mono text-ink bg-panel border border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-blood/50" />
              ))}
            </div>
            {error && <p className="text-xs text-blood-mid font-mono text-center mb-3">{error}</p>}
            <Button type="submit" size="full" loading={loading}>Verify & Continue</Button>
          </form>
        </CardBody>
      </Card>
      <div className="text-center mt-4">
        {countdown > 0
          ? <p className="text-xs text-dim font-mono">Resend in {countdown}s</p>
          : <button onClick={() => { setResent(true); setCountdown(60); setDigits(['','','','','','']); setTimeout(() => setResent(false), 3000) }}
              className={`text-xs ${accent} hover:underline font-mono`}>{resent ? 'Code sent!' : 'Resend code'}</button>
        }
      </div>
    </div>
  )
}

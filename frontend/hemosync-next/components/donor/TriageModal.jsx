'use client'
import { useState } from 'react'
import Dialog, { DialogTitle } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'

const QUESTIONS = [
  { id:'fever',      text:'Do you currently have a fever, cold, or active infection?',                                 blocker:true, reason:'Active illness or infection disqualifies donors to protect patient safety.' },
  { id:'medication', text:'Are you currently on antibiotics or blood thinners (e.g. warfarin, aspirin)?',             blocker:true, reason:'Certain medications interfere with blood quality or cause clotting risks.' },
  { id:'alcohol',    text:'Have you consumed alcohol in the last 24 hours?',                                           blocker:true, reason:'Alcohol affects blood composition and donor recovery.' },
  { id:'travel',     text:'Have you travelled to a malaria-endemic zone in the last 6 months?',                       blocker:true, reason:'Recent travel to malaria zones requires a minimum 6-month deferral period.' },
]

export default function TriageModal({ open, onClose, onPass, alert }) {
  const [step,    setStep]    = useState(0)
  const [blocked, setBlocked] = useState(null)
  const current = QUESTIONS[step]

  const handleAnswer = (yes) => {
    if (yes && current.blocker) { setBlocked(current); return }
    if (step < QUESTIONS.length - 1) setStep((s) => s + 1)
    else onPass?.()
  }

  const handleClose = () => { setStep(0); setBlocked(null); onClose?.() }

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="p-6">
        {!blocked ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <p className="font-mono text-[10px] text-blood tracking-widest">PRE-DONATION TRIAGE</p>
              <p className="font-mono text-[10px] text-muted">{step + 1} / {QUESTIONS.length}</p>
            </div>
            <div className="h-0.5 bg-white/5 rounded-full mb-5">
              <div className="h-full bg-blood rounded-full transition-all duration-300" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
            </div>
            <DialogTitle className="mb-3 leading-snug">{current.text}</DialogTitle>
            {alert && (
              <div className="mb-4 p-3 rounded-lg bg-blood-bg border border-blood/20 text-xs text-slate">
                <span className="text-blood-mid font-mono text-2xs">ALERT · </span>{alert.bloodType} · {alert.hospital}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={() => handleAnswer(true)}  className="py-3 rounded-sm border border-blood/25  bg-blood-bg  text-blood-mid font-semibold text-sm hover:bg-blood/15 transition-colors">Yes</button>
              <button onClick={() => handleAnswer(false)} className="py-3 rounded-sm border border-emerald/25 bg-emerald/8 text-emerald   font-semibold text-sm hover:bg-emerald/15 transition-colors">No</button>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-blood/10 flex items-center justify-center mb-4">
              <svg width="20" height="20" fill="none" stroke="#e8303f" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="font-mono text-[10px] text-blood tracking-widest mb-2">DONATION NOT POSSIBLE</p>
            <DialogTitle className="mb-2">You are not eligible to donate right now</DialogTitle>
            <p className="text-sm text-muted mb-5">{blocked.reason}</p>
            <p className="text-xs text-dim mb-5">Please consult a medical professional if you have concerns. Thank you for your willingness to help.</p>
            <Button size="full" variant="secondary" onClick={handleClose}>Close</Button>
          </>
        )}
      </div>
    </Dialog>
  )
}

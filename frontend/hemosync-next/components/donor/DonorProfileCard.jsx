'use client'
import { useState, useEffect } from 'react'
import { getDonorProfile } from '@/services/donor.service'
import Card, { CardBody } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { BLOOD_COMPATIBILITY } from '@/lib/constants'
import { calculateAge } from '@/lib/utils'

export default function DonorProfileCard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getDonorProfile().then(setProfile).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="h-40 bg-surface rounded-xl animate-pulse" />
  if (!profile) return null

  const age      = calculateAge(profile.dob)
  const eligible = profile.isEligible || profile.cooldownDays <= 0
  const compat   = BLOOD_COMPATIBILITY[profile.bloodType]

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-mono text-2xs text-muted tracking-widest mb-0.5">DONOR PROFILE</p>
            <h2 className="font-display text-xl text-ink">{profile.name}</h2>
            <p className="text-xs text-muted mt-0.5">{profile.city} · {age} yrs</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-12 h-12 rounded-full bg-blood/10 flex items-center justify-center">
              <span className="font-display text-lg text-blood">{profile.bloodType}</span>
            </div>
            <Badge variant={eligible ? 'active' : 'warning'}>{eligible ? 'Eligible' : `${profile.cooldownDays}d cooldown`}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[['DONATIONS', profile.totalDonations, 'text-blood'],['LIVES SAVED', profile.livesImpacted, 'text-emerald'],['STREAK', profile.streaks + ' 🔥', 'text-amber']].map(([label, val, col]) => (
            <div key={label} className="bg-panel rounded-lg p-3 text-center">
              <p className={`font-display text-2xl ${col}`}>{val}</p>
              <p className="font-mono text-2xs text-muted tracking-widest">{label}</p>
            </div>
          ))}
        </div>
        <div className="mb-4 text-center">
          <Badge variant="active">LEVEL: {profile.level?.toUpperCase() || 'BEGINNER'}</Badge>
          <span className="ml-2 font-mono text-xs text-muted">{profile.points || 0} PTS</span>
        </div>

        {compat && (
          <div>
            <p className="font-mono text-2xs text-muted tracking-widest mb-2">CAN DONATE TO</p>
            <div className="flex flex-wrap gap-1">
              {compat.donatesTo.map((t) => (
                <span key={t} className="font-mono text-2xs px-2 py-0.5 rounded-sm bg-blood/8 border border-blood/15 text-blood-mid">{t}</span>
              ))}
            </div>
          </div>
        )}
        {profile.emergencyWilling && (
          <div className="mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blood animate-pulse-dot" />
            <span className="font-mono text-2xs text-blood tracking-widest">EMERGENCY DONOR</span>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

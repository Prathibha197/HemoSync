'use client'
import { useState } from 'react'
import Card, { CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input, { Select } from '@/components/ui/Input'

import { INDIAN_CITIES, DONOR_COOLDOWN_DAYS } from '@/lib/constants'
import { calculateAge } from '@/lib/utils'

const BT_OPTS   = ['A+','A−','B+','B−','AB+','AB−','O+','O−'].map((v)=>({value:v,label:v}))
const GEN_OPTS  = [{value:'male',label:'Male'},{value:'female',label:'Female'},{value:'other',label:'Other / Prefer not to say'}]
const TIME_OPTS = [{value:'Morning (8AM–12PM)',label:'Morning (8AM–12PM)'},{value:'Afternoon (12–4PM)',label:'Afternoon (12–4PM)'},{value:'Evening (4–8PM)',label:'Evening (4–8PM)'}]
const CITY_OPTS = [{value:'',label:'Select city…'}, ...INDIAN_CITIES.map((c)=>({value:c,label:c}))]

function YesNo({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <p className="font-mono text-[10px] text-muted tracking-widest mb-2 uppercase">{label}</p>
      <div className="flex gap-2">
        {['Yes','No'].map((opt) => (
          <button key={opt} type="button" onClick={() => onChange(opt === 'Yes')}
            className={`flex-1 text-xs font-medium py-2 rounded-sm border transition-all ${
              value === (opt === 'Yes')
                ? 'border-emerald/40 bg-emerald/8 text-emerald'
                : 'border-white/10 bg-panel text-muted hover:border-white/20 hover:text-slate'
            }`}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

export default function RegisterDonor({ onComplete }) {
  const [gate,   setGate]   = useState(1)
  const [errors, setErrors] = useState({})

  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [mobile,    setMobile]    = useState('')
  const [bloodType, setBloodType] = useState('O+')
  const [gender,    setGender]    = useState('male')
  const [dob,       setDob]       = useState('')
  const [city,      setCity]      = useState('')
  const [pincode,   setPincode]   = useState('')

  const [weight,           setWeight]           = useState('')
  const [majorIllness,     setMajorIllness]     = useState(null)
  const [lastDonation,     setLastDonation]     = useState('')
  const [emergencyWilling, setEmergencyWilling] = useState(null)
  const [preferredTime,    setPreferredTime]    = useState(TIME_OPTS[0].value)

  const validateGate1 = () => {
    const e = {}
    if (!name.trim())   e.name    = 'Full name is required'
    if (!email.trim())  e.email   = 'Email address is required'
    if (!mobile.trim() || mobile.replace(/\D/g,'').length < 10) e.mobile = 'Enter a valid 10-digit mobile number'
    if (!dob)           e.dob     = 'Date of birth is required'
    else { const age = calculateAge(dob); if (age < 18 || age > 65) e.dob = 'Donors must be aged 18–65' }
    if (!city)          e.city    = 'Select your city'
    if (!pincode || pincode.length !== 6) e.pincode = 'Enter a valid 6-digit pincode'
    return e
  }
  const validateGate2 = () => {
    const e = {}
    if (!weight || Number(weight) <= 50) e.weight = 'Weight must be greater than 50 kg'
    if (majorIllness     === null) e.majorIllness     = 'Please answer this question'
    if (emergencyWilling === null) e.emergencyWilling = 'Please answer this question'
    return e
  }

  const handleGate1Next = (ev) => {
    ev.preventDefault()
    const errs = validateGate1(); setErrors(errs)
    if (!Object.keys(errs).length) setGate(2)
  }
  const handleGate2Submit = (ev) => {
    ev.preventDefault()
    const errs = validateGate2(); setErrors(errs)
    if (!Object.keys(errs).length) {
      onComplete?.({ name, email, mobile, bloodType, gender, dob, city, pincode, weight: Number(weight),
        majorIllness, lastDonation: lastDonation || null, emergencyWilling, preferredTime,
        cooldownDays: DONOR_COOLDOWN_DAYS[gender] ?? 90 })
    }
  }

  return (
    <>
      <div className="mb-5">
        <p className="font-mono text-[10px] text-emerald tracking-[0.07em] mb-1">STEP 2 — DONOR PROFILE · GATE {gate} OF 2</p>
        <h2 className="font-display text-2xl text-ink font-normal">{gate === 1 ? 'Identity & Contact' : 'Medical Eligibility'}</h2>
        <p className="text-xs text-muted mt-1">{gate === 1 ? 'Personal details' : 'Health information to confirm eligibility'}</p>
      </div>

      {gate === 1 && (
        <Card><CardBody>
          <form onSubmit={handleGate1Next}>
            <Input label="FULL NAME" value={name} onChange={setName} placeholder="As per government ID" error={errors.name} />
            <Input label="EMAIL ADDRESS" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={errors.email} />
            <Input label="MOBILE NUMBER" type="tel" value={mobile} onChange={setMobile} placeholder="+91 98765 43210" error={errors.mobile} />
            <Select label="BLOOD TYPE" value={bloodType} onChange={setBloodType} options={BT_OPTS} />
            <Select label="GENDER" value={gender} onChange={setGender} options={GEN_OPTS} hint={`Donation cooldown: ${DONOR_COOLDOWN_DAYS[gender] ?? 90} days`} />
            <Input  label="DATE OF BIRTH" type="date" value={dob} onChange={setDob} error={errors.dob} hint="You must be aged 18–65 to donate" />
            <Select label="CITY" value={city} onChange={setCity} options={CITY_OPTS} error={errors.city} />
            <Input  label="PINCODE" value={pincode} onChange={setPincode} placeholder="110001" error={errors.pincode} />
            <Button type="submit" size="full" className="bg-emerald hover:bg-emerald/80 text-white">Continue to Medical Eligibility →</Button>
          </form>
        </CardBody></Card>
      )}

      {gate === 2 && (
        <Card><CardBody>
          <form onSubmit={handleGate2Submit}>
            <Input label="WEIGHT (KG)" type="number" value={weight} onChange={setWeight} placeholder="e.g. 65" error={errors.weight} hint="Minimum 50 kg required to donate" />
            <YesNo label="Do you have any major chronic illness? (diabetes, heart disease, HIV, hepatitis, cancer, TB)" value={majorIllness} onChange={setMajorIllness} />
            {errors.majorIllness && <p className="text-xs text-blood-mid font-mono -mt-2 mb-3">{errors.majorIllness}</p>}
            <Input label="LAST DONATION DATE (OPTIONAL)" type="date" value={lastDonation} onChange={setLastDonation} hint="Leave blank if this is your first donation" />
            <YesNo label="Are you willing to donate in emergencies (within 2 hours)?" value={emergencyWilling} onChange={setEmergencyWilling} />
            {errors.emergencyWilling && <p className="text-xs text-blood-mid font-mono -mt-2 mb-3">{errors.emergencyWilling}</p>}
            <Select label="PREFERRED DONATION TIME" value={preferredTime} onChange={setPreferredTime} options={TIME_OPTS} />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="md" onClick={() => setGate(1)} type="button">← Back</Button>
              <Button type="submit" size="full" className="bg-emerald hover:bg-emerald/80 text-white">Complete Registration →</Button>
            </div>
          </form>
        </CardBody></Card>
      )}
    </>
  )
}

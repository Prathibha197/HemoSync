'use client'
import { useState } from 'react'
import Card, { CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input, { Select } from '@/components/ui/Input'
import { INDIAN_CITIES } from '@/lib/constants'

const CITY_OPTS = [{value:'',label:'Select city…'}, ...INDIAN_CITIES.map((c)=>({value:c,label:c}))]

export default function RegisterBloodBank({ onComplete }) {
  const [bbName,      setBbName]      = useState('')
  const [licenceNo,   setLicenceNo]   = useState('')
  const [contactName, setContactName] = useState('')
  const [email,       setEmail]       = useState('')
  const [whatsapp,    setWhatsapp]    = useState('')
  const [city,        setCity]        = useState('')
  const [address,     setAddress]     = useState('')
  const [raktKoshId,  setRaktKoshId]  = useState('')
  const [errors,      setErrors]      = useState({})

  const validate = () => {
    const e = {}
    if (!bbName.trim())    e.bbName    = 'Blood bank name is required'
    if (!licenceNo.trim()) e.licenceNo = 'CDSCO licence number is required'
    if (!contactName.trim()) e.contactName = 'Contact person name is required'
    if (!email.trim())     e.email     = 'Email address is required'
    if (!whatsapp.trim())  e.whatsapp  = 'WhatsApp number is required'
    if (!city)             e.city      = 'Select your city'
    if (!address.trim())   e.address   = 'Address is required'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const errs = validate(); setErrors(errs)
    if (!Object.keys(errs).length) onComplete?.({ name: bbName, bbName, licenceNo, contactName, email, mobile: whatsapp, whatsapp, city, address, raktKoshId: raktKoshId || null })
  }

  return (
    <>
      <div className="mb-5">
        <p className="font-mono text-[10px] text-blood tracking-[0.07em] mb-1">STEP 2 — BLOOD BANK PROFILE</p>
        <h2 className="font-display text-2xl text-ink font-normal">Bank Details</h2>
        <p className="text-xs text-muted mt-1">CDSCO-licensed blood bank information and integration setup</p>
      </div>
      <Card><CardBody>
        <form onSubmit={handleSubmit}>
          <Input  label="BLOOD BANK NAME" value={bbName} onChange={setBbName} placeholder="e.g. AIIMS Blood Bank" error={errors.bbName} />
          <Input  label="CDSCO LICENCE NUMBER" value={licenceNo} onChange={setLicenceNo} placeholder="e.g. DL-BB-2024-001" error={errors.licenceNo} />
          <Input  label="CONTACT PERSON (BLOOD BANK HEAD)" value={contactName} onChange={setContactName} placeholder="Dr. Full Name" error={errors.contactName} />
          <Input  label="EMAIL ADDRESS" type="email" value={email} onChange={setEmail} placeholder="bank@example.com" error={errors.email} />
          <Input  label="WHATSAPP BUSINESS NUMBER" type="tel" value={whatsapp} onChange={setWhatsapp} placeholder="+91 98765 43210" error={errors.whatsapp} hint="Used for automated 8AM/6PM stock update prompts via Twilio" />
          <Select label="CITY" value={city} onChange={setCity} options={CITY_OPTS} error={errors.city} />
          <Input  label="FULL ADDRESS" value={address} onChange={setAddress} placeholder="Street, Area, PIN" error={errors.address} />
          <Input  label="e-RAKT KOSH ID (OPTIONAL)" value={raktKoshId} onChange={setRaktKoshId} placeholder="Your NBTC e-RaktKosh facility ID" hint="Leave blank if not yet registered — add it later in settings" />
          <div className="mt-2 p-3 rounded-lg bg-blood-bg border border-blood/15 mb-4">
            <p className="font-mono text-[10px] text-blood tracking-widest mb-1">WHATSAPP AUTOMATION</p>
            <p className="text-xs text-muted">Prompts sent at 8AM &amp; 6PM. Reply in format <span className="font-mono text-slate">O+:12 A+:8 B+:5</span> and the system updates inventory automatically.</p>
          </div>
          <Button type="submit" size="full" variant="primary">Complete Registration →</Button>
        </form>
      </CardBody></Card>
    </>
  )
}

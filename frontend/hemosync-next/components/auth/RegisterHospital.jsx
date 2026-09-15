'use client'
import { useState } from 'react'
import Card, { CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input, { Select } from '@/components/ui/Input'
import { INDIAN_CITIES } from '@/lib/constants'

const CITY_OPTS = [{value:'',label:'Select city…'}, ...INDIAN_CITIES.map((c)=>({value:c,label:c}))]
const TYPE_OPTS = [{value:'government',label:'Government Hospital'},{value:'private',label:'Private Hospital'},{value:'trust',label:'Charitable / Trust'},{value:'teaching',label:'Teaching / Medical College'}]

export default function RegisterHospital({ onComplete }) {
  const [facilityName,    setFacilityName]    = useState('')
  const [type,            setType]            = useState('government')
  const [registrationNo,  setRegistrationNo]  = useState('')
  const [contactName,     setContactName]     = useState('')
  const [email,           setEmail]           = useState('')
  const [phone,           setPhone]           = useState('')
  const [city,            setCity]            = useState('')
  const [address,         setAddress]         = useState('')
  const [errors,          setErrors]          = useState({})

  const validate = () => {
    const e = {}
    if (!facilityName.trim())    e.facilityName    = 'Facility name is required'
    if (!registrationNo.trim())  e.registrationNo  = 'Registration number is required'
    if (!contactName.trim())     e.contactName     = 'Contact person name is required'
    if (!email.trim())           e.email           = 'Email address is required'
    if (!phone.trim())           e.phone           = 'Phone number is required'
    if (!city)                   e.city            = 'Select your city'
    if (!address.trim())         e.address         = 'Address is required'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const errs = validate(); setErrors(errs)
    if (!Object.keys(errs).length) onComplete?.({ name: facilityName, facilityName, type, registrationNo, contactName, email, mobile: phone, phone, city, address })
  }

  return (
    <>
      <div className="mb-5">
        <p className="font-mono text-[10px] text-amber tracking-[0.07em] mb-1">STEP 2 — HOSPITAL PROFILE</p>
        <h2 className="font-display text-2xl text-ink font-normal">Facility Details</h2>
        <p className="text-xs text-muted mt-1">Your hospital information for blood request verification</p>
      </div>
      <Card><CardBody>
        <form onSubmit={handleSubmit}>
          <Input  label="FACILITY NAME" value={facilityName} onChange={setFacilityName} placeholder="e.g. AIIMS New Delhi" error={errors.facilityName} />
          <Select label="HOSPITAL TYPE" value={type} onChange={setType} options={TYPE_OPTS} />
          <Input  label="REGISTRATION / LICENCE NUMBER" value={registrationNo} onChange={setRegistrationNo} placeholder="e.g. DL-HOSP-2024-001" error={errors.registrationNo} />
          <Input  label="CONTACT PERSON (BLOOD BANK IN-CHARGE)" value={contactName} onChange={setContactName} placeholder="Dr. Full Name" error={errors.contactName} />
          <Input  label="EMAIL ADDRESS" type="email" value={email} onChange={setEmail} placeholder="hospital@example.com" error={errors.email} />
          <Input  label="CONTACT PHONE" type="tel" value={phone} onChange={setPhone} placeholder="+91 11 2658 8500" error={errors.phone} />
          <Select label="CITY" value={city} onChange={setCity} options={CITY_OPTS} error={errors.city} />
          <Input  label="FULL ADDRESS" value={address} onChange={setAddress} placeholder="Street, Area, PIN" error={errors.address} />
          <div className="mt-2 p-3 rounded-lg bg-amber/5 border border-amber/15 mb-4">
            <p className="font-mono text-[10px] text-amber tracking-widest mb-1">HL7 FHIR R4 INTEGRATION</p>
            <p className="text-xs text-muted">After registration, your HMS can subscribe to FHIR R4 ServiceRequest, Substance, and Patient endpoints for real-time blood request sync.</p>
          </div>
          <Button type="submit" size="full" className="bg-amber hover:bg-amber/80 text-bg">Complete Registration →</Button>
        </form>
      </CardBody></Card>
    </>
  )
}

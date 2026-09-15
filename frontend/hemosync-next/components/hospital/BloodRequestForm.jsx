'use client'
import { useState } from 'react'
import Card, { CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input, { Select } from '@/components/ui/Input'
import { submitBloodRequest } from '@/services/hospital.service'

const BT_OPTS = ['A+','A−','B+','B−','AB+','AB−','O+','O−'].map((v)=>({value:v,label:v}))
const URG_OPTS = [{value:'critical',label:'🔴 Critical — within 2 hours'},{value:'urgent',label:'🟡 Urgent — within 6 hours'},{value:'standard',label:'⚪ Standard — within 24 hours'}]

export default function BloodRequestForm({ onSubmitted }) {
  const [bloodType, setBloodType] = useState('O+')
  const [units,     setUnits]     = useState('')
  const [urgency,   setUrgency]   = useState('urgent')
  const [patient,   setPatient]   = useState('')
  const [ward,      setWard]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(null)
  const [errors,    setErrors]    = useState({})

  const validate = () => {
    const e = {}
    if (!units || Number(units) < 1) e.units   = 'Enter at least 1 unit'
    if (!patient.trim())             e.patient  = 'Patient/condition is required'
    if (!ward.trim())                e.ward     = 'Ward/location is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate(); setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      const result = await submitBloodRequest({ bloodType, units: Number(units), urgency, patient, ward })
      setSuccess(result); onSubmitted?.(result)
      setUnits(''); setPatient(''); setWard('')
    } catch (err) { setErrors({ api: err.response?.data?.message ?? 'Submission failed.' }) }
    finally { setLoading(false) }
  }

  return (
    <Card>
      <CardHeader><CardTitle>New Blood Request</CardTitle></CardHeader>
      <CardBody>
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald/5 border border-emerald/20 text-xs text-emerald">
            <p className="font-mono tracking-widest mb-1 text-2xs">REQUEST SUBMITTED</p>
            <p>FHIR ID: <span className="font-mono">{success.fhirId}</span> · Searching for donors and nearby banks.</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Select label="BLOOD TYPE" value={bloodType} onChange={setBloodType} options={BT_OPTS} />
            <Input  label="UNITS NEEDED" type="number" value={units} onChange={setUnits} placeholder="e.g. 2" error={errors.units} />
          </div>
          <Select label="URGENCY" value={urgency} onChange={setUrgency} options={URG_OPTS} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="PATIENT / CONDITION" value={patient} onChange={setPatient} placeholder="e.g. RTA trauma" error={errors.patient} />
            <Input label="WARD / LOCATION"     value={ward}    onChange={setWard}    placeholder="e.g. ICU-2"    error={errors.ward}    />
          </div>
          {errors.api && <p className="text-xs text-blood-mid font-mono mb-3">{errors.api}</p>}
          <Button type="submit" size="md" loading={loading}>Submit Request</Button>
        </form>
      </CardBody>
    </Card>
  )
}

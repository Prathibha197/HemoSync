'use client'
import FHIRStatus from '@/components/hospital/FHIRStatus'

export default function FHIRPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">FHIR R4 Integration</h1>
        <p className="text-slate text-sm mt-1">HL7 FHIR endpoint status and resource sync</p>
      </div>
      <FHIRStatus expanded />
    </div>
  )
}

'use client'
import { useRouter } from 'next/navigation'
import Logo from './Logo'

const ROLES = [
  { role:'donor',     title:'Blood Donor',   subtitle:'Register, respond to emergencies, find nearby banks',         icon:'🩸', hover:'hover:border-emerald/40', accent:'text-emerald', badge:'bg-emerald/8 border-emerald/25 text-emerald', cta:'bg-emerald hover:bg-emerald/80 text-white' },
  { role:'hospital',  title:'Hospital',      subtitle:'Submit requests, track inventory, HL7 FHIR R4 integration',   icon:'🏥', hover:'hover:border-amber/40',   accent:'text-amber',   badge:'bg-amber/8   border-amber/25   text-amber',   cta:'bg-amber    hover:bg-amber/80    text-bg'    },
  { role:'bloodbank', title:'Blood Bank',    subtitle:'Manage stock, e-RaktKosh sync, WhatsApp automation',          icon:'🏦', hover:'hover:border-blood/40',   accent:'text-blood',   badge:'bg-blood-bg  border-blood/25   text-blood',   cta:'bg-blood    hover:bg-blood-mid   text-white'  },
]

export default function RoleSelector() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 flex flex-col items-center text-center">
        <Logo size={44} className="mb-4" />
        <h1 className="font-display text-4xl text-ink font-normal mb-2">Blood Donation Network</h1>
        <p className="text-sm text-muted max-w-xs">Real-time emergency donor coordination across India</p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {ROLES.map(({ role, title, subtitle, icon, hover, accent, badge, cta }) => (
          <div key={role} className={`bg-surface border border-white/7 rounded-xl p-5 transition-all duration-200 ${hover}`}>
            <div className="text-2xl mb-3">{icon}</div>
            <span className={`font-mono text-2xs tracking-widest border rounded-sm px-1.5 py-0.5 ${badge}`}>{role.toUpperCase()}</span>
            <h2 className={`mt-3 font-display text-xl font-normal ${accent}`}>{title}</h2>
            <p className="text-xs text-muted mt-1 mb-5 leading-relaxed">{subtitle}</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => router.push(`/auth/login?role=${role}`)}
                className="text-xs font-medium text-slate border border-white/10 rounded-sm px-3 py-2 hover:border-white/20 hover:text-ink transition-colors">
                Sign In
              </button>
              <button onClick={() => router.push(`/auth/register?role=${role}`)}
                className={`text-xs font-medium rounded-sm px-3 py-2 transition-colors ${cta}`}>
                Register
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="font-mono text-2xs text-dim tracking-widest">BLOOD DONATION & EMERGENCY DONOR NETWORK · INDIA</p>
    </div>
  )
}

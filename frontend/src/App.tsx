import { useState, useEffect, useRef } from 'react'
import logoImg from '@/imports/WhatsApp_Image_2026-08-19_at_11.37.03_AM.jpeg'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = null | 'donor' | 'hospital' | 'bloodbank'
type BloodType = 'A+' | 'A−' | 'B+' | 'B−' | 'AB+' | 'AB−' | 'O+' | 'O−'

// ─── Shared Data ─────────────────────────────────────────────────────────────

const BLOOD_TYPES: BloodType[] = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']

const COMPAT: Record<string, { donate: string[]; receive: string[] }> = {
  'O−': { donate: ['O+','O−','A+','A−','B+','B−','AB+','AB−'], receive: ['O−'] },
  'O+': { donate: ['O+','A+','B+','AB+'], receive: ['O+','O−'] },
  'A−': { donate: ['A+','A−','AB+','AB−'], receive: ['A−','O−'] },
  'A+': { donate: ['A+','AB+'], receive: ['A+','A−','O+','O−'] },
  'B−': { donate: ['B+','B−','AB+','AB−'], receive: ['B−','O−'] },
  'B+': { donate: ['B+','AB+'], receive: ['B+','B−','O+','O−'] },
  'AB−': { donate: ['AB+','AB−'], receive: ['A−','B−','AB−','O−'] },
  'AB+': { donate: ['AB+'], receive: ['A+','A−','B+','B−','AB+','AB−','O+','O−'] },
}

// ─── Styles / Tokens ─────────────────────────────────────────────────────────

const C = {
  bg: '#0a0a0b',
  card: '#111113',
  border: 'rgba(255,255,255,0.07)',
  red: '#c8192c',
  redMid: '#e8303f',
  redBg: 'rgba(200,25,44,0.08)',
  redBorder: 'rgba(200,25,44,0.2)',
  green: '#3dbf7e',
  amber: '#e8a230',
  text: '#f2f2f0',
  sub: '#a8a8a4',
  muted: '#707070',
  dim: '#444',
}

const font = {
  display: "'DM Serif Display', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
}

// ─── Helper components ────────────────────────────────────────────────────────

function HemoSyncLogo({ size = 28 }: { size?: number }) {
  return (
    <img
      src={logoImg}
      alt="HemoSync logo"
      style={{ width: size, height: size, borderRadius: 4, objectFit: 'cover', display: 'block', flexShrink: 0 }}
    />
  )
}

function Tag({ children, color = C.muted, bg = 'rgba(255,255,255,0.05)' }: { children: React.ReactNode; color?: string; bg?: string }) {
  return (
    <span style={{ fontFamily: font.mono, fontSize: 10, color, background: bg, border: `1px solid ${color}33`, padding: '2px 7px', borderRadius: 2, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? C.redBg : 'transparent',
        border: `1px solid ${active ? C.redBorder : C.border}`,
        color: active ? C.redMid : C.muted,
        padding: '5px 12px', borderRadius: 3, fontSize: 11,
        fontFamily: font.mono, letterSpacing: '0.05em', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

function PulseDoc() {
  return (
    <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: C.green,
      animation: 'pulse-dot 1.4s ease-in-out infinite' }} />
  )
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontFamily: font.display, fontSize: 24, fontWeight: 400, color: C.text, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: C.muted, margin: 0, fontFamily: font.mono, letterSpacing: '0.03em' }}>{sub}</p>}
    </div>
  )
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, ...style }}>
      {children}
    </div>
  )
}

// ─── ROLE SELECTOR ────────────────────────────────────────────────────────────

function RoleSelector({ onSelect }: { onSelect: (r: Role) => void }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <HemoSyncLogo size={40} />
        <span style={{ fontFamily: font.display, fontSize: 26, color: C.text }}>
          Hemo<span style={{ color: C.red }}>Sync</span>
        </span>
      </div>

      <p style={{ fontFamily: font.mono, fontSize: 11, color: C.muted, letterSpacing: '0.08em', marginBottom: 52 }}>
        BLOOD DONATION & EMERGENCY DONOR NETWORK · INDIA
      </p>

      <h1 style={{ fontFamily: font.display, fontSize: 'clamp(28px,5vw,42px)', fontWeight: 400, color: C.text, textAlign: 'center', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
        Who are you accessing<br /><em style={{ color: C.red }}>HemoSync</em> as?
      </h1>
      <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', margin: '0 0 48px' }}>
        Each portal is optimized for your role and device.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, width: '100%', maxWidth: 780 }}>
        {[
          {
            role: 'donor' as Role,
            icon: '🩸',
            title: 'I\'m a Donor',
            desc: 'Register, respond to emergency requests, track your donation history and impact.',
            tag: 'Mobile-optimised',
            tagColor: C.green,
            accent: C.green,
          },
          {
            role: 'hospital' as Role,
            icon: '🏥',
            title: 'I\'m a Hospital',
            desc: 'Submit blood requests, connect your HMS via FHIR, and track real-time fulfillment.',
            tag: 'FHIR Integrated',
            tagColor: C.amber,
            accent: C.amber,
          },
          {
            role: 'bloodbank' as Role,
            icon: '🏪',
            title: 'I\'m a Blood Bank',
            desc: 'Sync with e-RaktKosh, manage inventory, and receive WhatsApp-based updates.',
            tag: 'e-RaktKosh Sync',
            tagColor: C.red,
            accent: C.red,
          },
        ].map(({ role, icon, title, desc, tag, tagColor, accent }) => (
          <button
            key={role}
            onClick={() => onSelect(role)}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: '28px 24px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: font.display, fontSize: 18, color: C.text }}>{title}</span>
              <Tag color={tagColor}>{tag}</Tag>
            </div>
            <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.65, margin: 0 }}>{desc}</p>
            <div style={{ marginTop: 20, fontFamily: font.mono, fontSize: 11, color: accent, letterSpacing: '0.06em' }}>
              ENTER PORTAL →
            </div>
          </button>
        ))}
      </div>

      {/* e-RaktKosh / FHIR badges */}
      <div style={{ marginTop: 56, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'e-RaktKosh Integrated', dot: C.green },
          { label: 'HL7 / FHIR Compliant', dot: C.green },
          { label: 'Twilio WhatsApp API', dot: C.green },
          { label: 'CDAC Data Partner', dot: C.amber },
        ].map(({ label, dot }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: font.mono, fontSize: 10, color: C.dim, letterSpacing: '0.05em' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── SHARED NAV ───────────────────────────────────────────────────────────────

function TopNav({ role, onSwitchRole, tabs, activeTab, setActiveTab }: {
  role: Role; onSwitchRole: () => void; tabs: string[]; activeTab: string; setActiveTab: (t: string) => void
}) {
  const roleLabel: Record<string, string> = { donor: 'Donor Portal', hospital: 'Hospital Portal', bloodbank: 'Blood Bank Portal' }
  const roleColor: Record<string, string> = { donor: C.green, hospital: C.amber, bloodbank: C.red }
  const color = roleColor[role!] ?? C.red

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,11,0.94)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: role === 'donor' ? 480 : 1240, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 24, height: 54 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <HemoSyncLogo size={26} />
          <span style={{ fontFamily: font.display, fontSize: 16, color: C.text }}>
            Hemo<span style={{ color: C.red }}>Sync</span>
          </span>
          <span style={{ fontFamily: font.mono, fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}33`, padding: '2px 7px', borderRadius: 2, letterSpacing: '0.05em' }}>
            {roleLabel[role!]}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: activeTab === t ? `${color}14` : 'transparent',
              border: 'none', color: activeTab === t ? color : C.muted,
              fontFamily: font.sans, fontSize: 12, fontWeight: 500,
              padding: '6px 12px', borderRadius: 3, cursor: 'pointer',
              transition: 'color 0.15s', whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: font.mono, fontSize: 10, color: C.green }}>
            <PulseDoc /> LIVE
          </div>
          <button onClick={onSwitchRole} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '5px 12px', borderRadius: 3, fontSize: 11, cursor: 'pointer' }}>
            Switch Role
          </button>
        </div>
      </div>
    </nav>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// DONOR PORTAL (Mobile-first, max-width 480px)
// ══════════════════════════════════════════════════════════════════════════════

const DONOR_ALERTS = [
  { id: 'A-001', hospital: 'AIIMS Delhi', type: 'O−' as BloodType, urgency: 'CRITICAL', distance: '1.2 km', time: '3 min ago' },
  { id: 'A-002', hospital: 'Safdarjung Hospital', type: 'A−' as BloodType, urgency: 'URGENT', distance: '3.7 km', time: '9 min ago' },
  { id: 'A-003', hospital: 'Ram Manohar Lohia', type: 'B+' as BloodType, urgency: 'STANDARD', distance: '5.1 km', time: '22 min ago' },
]

const DONATION_HISTORY = [
  { date: '12 Jul 2026', hospital: 'AIIMS Delhi', type: 'O−', impact: 'Saved 3 lives', verified: true },
  { date: '18 Mar 2026', hospital: 'Safdarjung Hospital', type: 'O−', impact: 'Saved 2 lives', verified: true },
  { date: '09 Nov 2025', hospital: 'Ram Manohar Lohia', type: 'O−', impact: 'Saved 1 life', verified: true },
]

const NEARBY_BANKS = [
  { name: 'AIIMS Blood Bank', distance: '1.2 km', open: true, types: ['O−', 'A+', 'B+'] },
  { name: 'Red Cross Delhi', distance: '2.8 km', open: true, types: ['AB−', 'O+'] },
  { name: 'Lions Blood Bank', distance: '4.3 km', open: false, types: ['A−', 'B−'] },
]

// ── Pre-accept triage modal (Gate 3) ─────────────────────────────────────

const TRIAGE_QUESTIONS = [
  { id: 'weight', q: 'Are you weighing more than 50 kg right now?', blockIf: 'no', reason: 'Donors must weigh at least 50 kg for a safe whole-blood donation.' },
  { id: 'tattoo', q: 'Have you had a tattoo, surgery, or piercing in the last 6 months?', blockIf: 'yes', reason: 'Recent tattoos, surgery, or piercings increase infection risk for the recipient.' },
  { id: 'alcohol', q: 'Have you consumed alcohol in the last 24 hours?', blockIf: 'yes', reason: 'Alcohol in your system within 24 hours makes you ineligible to donate today.' },
  { id: 'unwell', q: 'Are you currently taking antibiotics or feeling unwell / have fever?', blockIf: 'yes', reason: 'Active illness or antibiotic use disqualifies donation until you have fully recovered.' },
]

function TriageModal({ alert, onClose, onConfirm }: {
  alert: typeof DONOR_ALERTS[0]; onClose: () => void; onConfirm: () => void
}) {
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no'>>({})
  const [blocked, setBlocked] = useState<{ reason: string } | null>(null)
  const answered = Object.keys(answers).length
  const total = TRIAGE_QUESTIONS.length

  const handleAnswer = (id: string, val: 'yes' | 'no') => {
    const q = TRIAGE_QUESTIONS.find(q => q.id === id)!
    const newAnswers = { ...answers, [id]: val }
    setAnswers(newAnswers)
    if (q.blockIf === val) {
      setBlocked({ reason: q.reason })
    }
  }

  const allClear = answered === total && !blocked

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 72px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#141416', border: `1px solid ${C.border}`, borderRadius: '8px 8px 0 0', width: '100%', maxWidth: 480, padding: '24px 20px', animation: 'fadeIn 0.2s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: font.mono, fontSize: 10, color: C.red, letterSpacing: '0.07em', marginBottom: 4 }}>PRE-DONATION TRIAGE · 4 QUICK QUESTIONS</div>
            <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{alert.hospital}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Needs <span style={{ color: C.red, fontFamily: font.display, fontSize: 14 }}>{alert.type}</span> · {alert.urgency}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: C.border, borderRadius: 2, marginBottom: 18, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(answered / total) * 100}%`, background: blocked ? C.red : C.green, transition: 'width 0.3s' }} />
        </div>

        {blocked ? (
          <div style={{ background: 'rgba(200,25,44,0.08)', border: `1px solid ${C.redBorder}`, borderRadius: 4, padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ fontFamily: font.mono, fontSize: 11, color: C.red, letterSpacing: '0.06em', marginBottom: 8 }}>⚠ DONATION NOT POSSIBLE TODAY</div>
            <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.65, margin: '0 0 14px' }}>{blocked.reason}</p>
            <p style={{ fontSize: 12, color: C.dim, margin: 0 }}>Your safety and the recipient's health come first. Please check back once you are eligible.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {TRIAGE_QUESTIONS.map((q, i) => {
              const ans = answers[q.id]
              const isActive = !ans && Object.keys(answers).length === i
              return (
                <div key={q.id} style={{ background: isActive ? 'rgba(255,255,255,0.03)' : '#0a0a0b', border: `1px solid ${ans ? (q.blockIf === ans ? C.red : C.green) + '44' : C.border}`, borderRadius: 4, padding: '12px 14px', opacity: !isActive && !ans && Object.keys(answers).length < i ? 0.4 : 1, transition: 'opacity 0.2s, border-color 0.2s' }}>
                  <div style={{ fontSize: 13, color: ans ? C.muted : C.text, marginBottom: ans ? 0 : 10, lineHeight: 1.5 }}>
                    <span style={{ fontFamily: font.mono, fontSize: 10, color: C.dim, marginRight: 6 }}>{String(i + 1).padStart(2, '0')}</span>
                    {q.q}
                  </div>
                  {!ans && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      {(['yes', 'no'] as const).map(v => (
                        <button key={v} onClick={() => handleAnswer(q.id, v)} style={{ flex: 1, background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, padding: '8px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = v === 'yes' ? 'rgba(200,25,44,0.1)' : 'rgba(61,191,126,0.1)'; e.currentTarget.style.borderColor = v === 'yes' ? C.red : C.green; e.currentTarget.style.color = v === 'yes' ? C.red : C.green }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.sub }}>
                          {v === 'yes' ? 'Yes' : 'No'}
                        </button>
                      ))}
                    </div>
                  )}
                  {ans && (
                    <span style={{ fontFamily: font.mono, fontSize: 10, color: q.blockIf === ans ? C.red : C.green, letterSpacing: '0.05em' }}>
                      {ans === 'yes' ? 'YES' : 'NO'} {q.blockIf === ans ? '✗' : '✓'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          {blocked ? (
            <button onClick={onClose} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, color: C.muted, padding: '11px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Close
            </button>
          ) : (
            <>
              <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '11px', borderRadius: 3, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={onConfirm} disabled={!allClear} style={{ flex: 2, background: allClear ? C.red : '#1a1a1c', color: allClear ? '#fff' : C.dim, border: 'none', padding: '11px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: allClear ? 'pointer' : 'default', transition: 'all 0.2s' }}>
                {allClear ? 'Confirm — I Can Donate ✓' : `Answer all ${total} questions to proceed`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DonorHome({ setTab }: { setTab: (t: string) => void }) {
  const [responded, setResponded] = useState<Record<string, boolean>>({})
  const [triageAlert, setTriageAlert] = useState<typeof DONOR_ALERTS[0] | null>(null)
  const daysUntilNext = 42
  const gender: string = 'male'
  const cooldownDays = gender === 'female' ? 120 : 90
  const canDonate = daysUntilNext <= 0

  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Triage modal */}
      {triageAlert && (
        <TriageModal
          alert={triageAlert}
          onClose={() => setTriageAlert(null)}
          onConfirm={() => {
            setResponded(p => ({ ...p, [triageAlert.id]: true }))
            setTriageAlert(null)
          }}
        />
      )}

      {/* Profile card */}
      <Card style={{ padding: '20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>Rohan Mehta</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              Verified Donor · Male · 14 donations
            </div>
          </div>
          <div style={{ fontFamily: font.display, fontSize: 36, color: C.red, lineHeight: 1 }}>O−</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: '#0a0a0b', borderRadius: 3, padding: '10px 12px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 18, color: canDonate ? C.green : C.amber }}>{canDonate ? '✓' : `${daysUntilNext}d`}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
              {canDonate ? 'Eligible now' : `Until next (${cooldownDays}-day cooldown)`}
            </div>
          </div>
          <div style={{ background: '#0a0a0b', borderRadius: 3, padding: '10px 12px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 18, color: C.text }}>42</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Lives impacted</div>
          </div>
        </div>
      </Card>

      {/* Nearby alerts */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PulseDoc />
            <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>Emergency Requests Near You</span>
          </div>
          <Tag color={C.red}>{DONOR_ALERTS.length} ACTIVE</Tag>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DONOR_ALERTS.map(alert => {
            const done = responded[alert.id]
            const urgColor = alert.urgency === 'CRITICAL' ? C.red : alert.urgency === 'URGENT' ? C.amber : C.green
            return (
              <div key={alert.id} style={{ background: C.card, border: `1px solid ${done ? 'rgba(61,191,126,0.25)' : alert.urgency === 'CRITICAL' ? 'rgba(200,25,44,0.2)' : C.border}`, borderRadius: 4, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{alert.hospital}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{alert.distance} away · {alert.time}</div>
                  </div>
                  <div style={{ fontFamily: font.display, fontSize: 22, color: urgColor }}>{alert.type}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Tag color={urgColor}>{alert.urgency}</Tag>
                  {done ? (
                    <span style={{ fontFamily: font.mono, fontSize: 11, color: C.green }}>✓ Responding</span>
                  ) : (
                    <button
                      onClick={() => setTriageAlert(alert)}
                      style={{ background: C.red, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      I can donate
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Compatible types */}
      <Card style={{ padding: '16px 18px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 10 }}>YOUR COMPATIBILITY (O−)</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: C.sub, marginBottom: 6 }}>Universal donor — can give to</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {COMPAT['O−'].donate.map(t => <Tag key={t} color={C.green}>{t}</Tag>)}
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={() => setTab('Find Banks')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '16px 14px', textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>📍</div>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>Find Nearby</div>
          <div style={{ fontSize: 11, color: C.muted }}>Blood banks & camps</div>
        </button>
        <button onClick={() => setTab('History')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '16px 14px', textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>My History</div>
          <div style={{ fontSize: 11, color: C.muted }}>3 donations recorded</div>
        </button>
      </div>
    </div>
  )
}

function DonorHistory() {
  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle title="Donation History" sub={`${DONATION_HISTORY.length} VERIFIED DONATIONS`} />
      {DONATION_HISTORY.map((d, i) => (
        <Card key={i} style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: font.mono, fontSize: 11, color: C.muted }}>{d.date}</span>
            {d.verified && <Tag color={C.green}>VERIFIED</Tag>}
          </div>
          <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{d.hospital}</div>
          <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>❤️ {d.impact}</div>
        </Card>
      ))}
      <Card style={{ padding: '16px', background: C.redBg, border: `1px solid ${C.redBorder}` }}>
        <div style={{ fontFamily: font.mono, fontSize: 10, color: C.red, letterSpacing: '0.07em', marginBottom: 8 }}>NEXT MILESTONE</div>
        <div style={{ fontFamily: font.display, fontSize: 22, color: C.text, marginBottom: 4 }}>5 more donations</div>
        <div style={{ fontSize: 12, color: C.muted }}>to earn Platinum Donor status and priority matching</div>
      </Card>
    </div>
  )
}

function DonorFindBanks() {
  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionTitle title="Nearby Blood Banks" sub="SORTED BY DISTANCE · DELHI NCR" />
      <div style={{ background: '#0d0d0f', border: `1px solid ${C.border}`, borderRadius: 4, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <div style={{ textAlign: 'center', color: C.muted }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🗺️</div>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.06em' }}>MAP VIEW · GPS ENABLED</div>
          <div style={{ fontSize: 11, marginTop: 4, color: C.dim }}>Powered by e-RaktKosh location data</div>
        </div>
      </div>
      {NEARBY_BANKS.map((b, i) => (
        <Card key={i} style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{b.distance} away</div>
            </div>
            <Tag color={b.open ? C.green : C.muted}>{b.open ? 'OPEN' : 'CLOSED'}</Tag>
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {b.types.map(t => <Tag key={t} color={C.red}>{t}</Tag>)}
          </div>
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(b.name + ' Delhi')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: C.redBg, border: `1px solid ${C.redBorder}`, color: C.red, padding: '9px', borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', boxSizing: 'border-box' }}
          >
            📍 Get Directions
          </a>
        </Card>
      ))}
    </div>
  )
}

function DonorPortal({ onSwitchRole }: { onSwitchRole: () => void }) {
  const tabs = ['Home', 'History', 'Find Banks']
  const [activeTab, setActiveTab] = useState('Home')

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <TopNav role="donor" onSwitchRole={onSwitchRole} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Ticker */}
      <div style={{ background: 'rgba(61,191,126,0.06)', borderBottom: `1px solid rgba(61,191,126,0.15)`, padding: '7px 16px', fontFamily: font.mono, fontSize: 10, color: '#3dbf7e', letterSpacing: '0.04em' }}>
        <span style={{ marginRight: 16 }}>📱 Mobile-optimised donor portal</span>
        <span style={{ color: C.dim }}>Enable notifications for emergency alerts in your area</span>
      </div>
      {/* Constrain to mobile width */}
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {activeTab === 'Home' && <DonorHome setTab={setActiveTab} />}
        {activeTab === 'History' && <DonorHistory />}
        {activeTab === 'Find Banks' && <DonorFindBanks />}
      </div>
      {/* Mobile bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(17,17,19,0.96)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 99 }}>
        {[{ tab: 'Home', icon: '🏠' }, { tab: 'History', icon: '📋' }, { tab: 'Find Banks', icon: '📍' }].map(({ tab, icon }) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '12px 0 14px', background: 'transparent', border: 'none',
            color: activeTab === tab ? C.red : C.muted, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '0.05em' }}>{tab.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <div style={{ height: 72 }} /> {/* bottom nav spacer */}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// HOSPITAL PORTAL (Desktop, FHIR-integrated)
// ══════════════════════════════════════════════════════════════════════════════

const FHIR_RESOURCES = [
  { resource: 'BloodRequest', endpoint: 'POST /fhir/r4/ServiceRequest', status: 'active', lastPing: '12s ago', calls: 847 },
  { resource: 'InventoryQuery', endpoint: 'GET /fhir/r4/Substance', status: 'active', lastPing: '1m ago', calls: 2341 },
  { resource: 'DonorMatch', endpoint: 'GET /fhir/r4/Patient?bloodType=', status: 'active', lastPing: '8s ago', calls: 1204 },
  { resource: 'FulfillmentAlert', endpoint: 'POST /fhir/r4/Communication', status: 'active', lastPing: '4m ago', calls: 316 },
]

const HOSPITAL_REQUESTS = [
  { id: 'HR-2291', type: 'O−', units: 4, urgency: 'CRITICAL', status: 'matching', submitted: '3 min ago', matched: 1 },
  { id: 'HR-2290', type: 'A−', units: 2, urgency: 'URGENT', status: 'dispatched', submitted: '18 min ago', matched: 2 },
  { id: 'HR-2289', type: 'B+', units: 6, urgency: 'STANDARD', status: 'fulfilled', submitted: '1h 12m ago', matched: 6 },
  { id: 'HR-2288', type: 'AB+', units: 3, urgency: 'STANDARD', status: 'fulfilled', submitted: '3h ago', matched: 3 },
]

const BANK_INVENTORY: Record<BloodType, number> = {
  'A+': 87, 'A−': 24, 'B+': 63, 'B−': 11, 'AB+': 44, 'AB−': 9, 'O+': 142, 'O−': 18,
}

function HospitalDashboard() {
  const [requestType, setRequestType] = useState<BloodType>('O−')
  const [requestUnits, setRequestUnits] = useState(2)
  const [requestUrgency, setRequestUrgency] = useState('URGENT')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Submit Request */}
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ fontFamily: font.display, fontSize: 18, color: C.text }}>Submit Blood Request</div>
              <Tag color={C.amber}>FHIR ServiceRequest</Tag>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.06em', marginBottom: 6 }}>BLOOD TYPE</div>
                <select
                  value={requestType}
                  onChange={e => setRequestType(e.target.value as BloodType)}
                  style={{ width: '100%', background: '#0a0a0b', border: `1px solid ${C.border}`, color: C.text, padding: '9px 12px', borderRadius: 3, fontSize: 14, fontFamily: font.display, cursor: 'pointer' }}
                >
                  {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.06em', marginBottom: 6 }}>UNITS</div>
                <input
                  type="number" min={1} max={20} value={requestUnits}
                  onChange={e => setRequestUnits(Number(e.target.value))}
                  style={{ width: '100%', background: '#0a0a0b', border: `1px solid ${C.border}`, color: C.text, padding: '9px 12px', borderRadius: 3, fontSize: 14, fontFamily: font.mono }}
                />
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.06em', marginBottom: 6 }}>URGENCY</div>
                <select
                  value={requestUrgency}
                  onChange={e => setRequestUrgency(e.target.value)}
                  style={{ width: '100%', background: '#0a0a0b', border: `1px solid ${C.border}`, color: C.text, padding: '9px 12px', borderRadius: 3, fontSize: 13, fontFamily: font.mono, cursor: 'pointer' }}
                >
                  {['CRITICAL', 'URGENT', 'STANDARD'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <button
                onClick={() => { setSubmitted(true); setTimeout(() => setSubmitted(false), 3000) }}
                style={{ background: submitted ? 'rgba(61,191,126,0.12)' : C.amber, color: submitted ? C.green : '#fff', border: submitted ? `1px solid ${C.green}44` : 'none', padding: '9px 20px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              >
                {submitted ? '✓ Sent via FHIR' : 'Submit Request'}
              </button>
            </div>
            {submitted && (
              <div style={{ marginTop: 12, fontFamily: font.mono, fontSize: 11, color: C.green }}>
                ✓ POST /fhir/r4/ServiceRequest · Response: 201 Created · Matching initiated
              </div>
            )}
          </Card>

          {/* Active requests */}
          <Card style={{ padding: '20px 22px' }}>
            <SectionTitle title="Active Requests" sub={`${HOSPITAL_REQUESTS.length} TOTAL · ${HOSPITAL_REQUESTS.filter(r => r.status !== 'fulfilled').length} OPEN`} />
            <div style={{ display: 'grid', gridTemplateColumns: '80px 60px 60px 80px 100px 100px 1fr', gap: 8, padding: '6px 10px', marginBottom: 4 }}>
              {['REQ ID','TYPE','UNITS','URGENCY','STATUS','SUBMITTED','MATCHED'].map(h => (
                <div key={h} style={{ fontFamily: font.mono, fontSize: 9, color: C.dim, letterSpacing: '0.08em' }}>{h}</div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {HOSPITAL_REQUESTS.map(req => {
                const statusColor = req.status === 'fulfilled' ? C.green : req.status === 'dispatched' ? C.amber : C.red
                const urgColor = req.urgency === 'CRITICAL' ? C.red : req.urgency === 'URGENT' ? C.amber : C.green
                return (
                  <div key={req.id} style={{ display: 'grid', gridTemplateColumns: '80px 60px 60px 80px 100px 100px 1fr', gap: 8, alignItems: 'center', background: '#0a0a0b', borderRadius: 3, padding: '10px 10px' }}>
                    <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted }}>{req.id}</div>
                    <div style={{ fontFamily: font.display, fontSize: 16, color: urgColor }}>{req.type}</div>
                    <div style={{ fontFamily: font.mono, fontSize: 12, color: C.text }}>{req.units}</div>
                    <Tag color={urgColor}>{req.urgency}</Tag>
                    <Tag color={statusColor}>{req.status.toUpperCase()}</Tag>
                    <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim }}>{req.submitted}</div>
                    <div style={{ fontFamily: font.mono, fontSize: 11, color: req.matched > 0 ? C.green : C.dim }}>
                      {req.matched}/{req.units} donors
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* FHIR status */}
          <Card style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <PulseDoc />
              <div style={{ fontFamily: font.display, fontSize: 16, color: C.text }}>FHIR Integration</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FHIR_RESOURCES.map(r => (
                <div key={r.resource} style={{ background: '#0a0a0b', borderRadius: 3, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{r.resource}</span>
                    <Tag color={C.green}>ACTIVE</Tag>
                  </div>
                  <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim, marginBottom: 3 }}>{r.endpoint}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: font.mono, fontSize: 9, color: C.dim }}>{r.lastPing}</span>
                    <span style={{ fontFamily: font.mono, fontSize: 9, color: C.muted }}>{r.calls.toLocaleString()} calls today</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(232,162,48,0.06)', border: `1px solid ${C.amber}22`, borderRadius: 3 }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.amber, marginBottom: 2 }}>HMS INTEGRATION</div>
              <div style={{ fontSize: 11, color: C.sub }}>Your Hospital Management System auto-pushes updates via HL7 FHIR R4 on every blood unit consumed or added.</div>
            </div>
          </Card>

          {/* Network inventory */}
          <Card style={{ padding: '18px 20px' }}>
            <SectionTitle title="Network Inventory" sub="ACROSS PARTNER BANKS" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {BLOOD_TYPES.map(t => {
                const units = BANK_INVENTORY[t]
                const pct = Math.min((units / 160) * 100, 100)
                const barColor = units < 15 ? C.red : units < 40 ? C.amber : C.green
                return (
                  <div key={t} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 48px', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontFamily: font.display, fontSize: 13, color: C.text }}>{t}</span>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: font.mono, fontSize: 11, color: barColor, textAlign: 'right' }}>{units}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function HospitalPortal({ onSwitchRole }: { onSwitchRole: () => void }) {
  const tabs = ['Dashboard', 'Requests', 'Inventory', 'FHIR Docs']
  const [activeTab, setActiveTab] = useState('Dashboard')

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <TopNav role="hospital" onSwitchRole={onSwitchRole} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ background: 'rgba(232,162,48,0.05)', borderBottom: `1px solid rgba(232,162,48,0.12)`, padding: '7px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: font.mono, fontSize: 10, color: C.amber, letterSpacing: '0.05em' }}>🏥 AIIMS New Delhi · Connected via FHIR R4 · HMS: MocDoc Integrated</span>
        <span style={{ fontFamily: font.mono, fontSize: 10, color: C.dim }}>3 open requests · Last HMS sync: 47s ago</span>
      </div>
      {activeTab === 'Dashboard' && <HospitalDashboard />}
      {activeTab === 'Requests' && (
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 64px' }}>
          <SectionTitle title="All Blood Requests" sub="COMPLETE HISTORY · AIIMS NEW DELHI" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {HOSPITAL_REQUESTS.map(req => {
              const urgColor = req.urgency === 'CRITICAL' ? C.red : req.urgency === 'URGENT' ? C.amber : C.green
              const statusColor = req.status === 'fulfilled' ? C.green : req.status === 'dispatched' ? C.amber : C.red
              return (
                <div key={req.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '16px 20px', display: 'grid', gridTemplateColumns: '90px 1fr 80px 100px 110px 120px', gap: 16, alignItems: 'center' }}>
                  <div style={{ fontFamily: font.mono, fontSize: 11, color: C.dim }}>{req.id}</div>
                  <div style={{ fontFamily: font.display, fontSize: 18, color: urgColor }}>{req.type} <span style={{ fontSize: 13, color: C.muted }}>— {req.units} units</span></div>
                  <Tag color={urgColor}>{req.urgency}</Tag>
                  <Tag color={statusColor}>{req.status.toUpperCase()}</Tag>
                  <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim }}>{req.submitted}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 11, color: req.matched > 0 ? C.green : C.dim }}>{req.matched}/{req.units} fulfilled</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {activeTab === 'Inventory' && (
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 64px' }}>
          <SectionTitle title="Network Blood Inventory" sub="REAL-TIME · SOURCED FROM e-RAKTKOSHA + PARTNER BANKS" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {BLOOD_TYPES.map(t => {
              const units = BANK_INVENTORY[t]
              const { pct, color } = { pct: Math.min((units / 160) * 100, 100), color: units < 15 ? C.red : units < 40 ? C.amber : C.green }
              return (
                <Card key={t} style={{ padding: '18px 20px' }}>
                  {units < 20 && <div style={{ fontFamily: font.mono, fontSize: 9, color: C.red, letterSpacing: '0.08em', marginBottom: 8 }}>▲ CRITICAL</div>}
                  <div style={{ fontFamily: font.display, fontSize: 28, color: C.text, marginBottom: 4 }}>{t}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 22, color, marginBottom: 4 }}>{units}</div>
                  <div style={{ fontSize: 10, color: C.dim, marginBottom: 10 }}>units available</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
      {activeTab === 'FHIR Docs' && (
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 64px' }}>
          <SectionTitle title="FHIR R4 Integration Guide" sub="HL7 FHIR FAST HEALTHCARE INTEROPERABILITY RESOURCES" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FHIR_RESOURCES.map(r => (
              <Card key={r.resource} style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontFamily: font.display, fontSize: 16, color: C.text }}>{r.resource}</span>
                  <Tag color={C.green}>ACTIVE</Tag>
                </div>
                <div style={{ background: '#0a0a0b', borderRadius: 3, padding: '10px 12px', marginBottom: 10 }}>
                  <div style={{ fontFamily: font.mono, fontSize: 11, color: C.amber }}>{r.endpoint}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: font.mono, fontSize: 10, color: C.dim }}>Last ping: {r.lastPing}</span>
                  <span style={{ fontFamily: font.mono, fontSize: 10, color: C.muted }}>{r.calls.toLocaleString()} calls today</span>
                </div>
              </Card>
            ))}
          </div>
          <Card style={{ padding: '22px 24px', marginTop: 16, background: 'rgba(232,162,48,0.04)', border: `1px solid ${C.amber}22` }}>
            <div style={{ fontFamily: font.mono, fontSize: 11, color: C.amber, letterSpacing: '0.07em', marginBottom: 10 }}>HMS INTEGRATION NOTE</div>
            <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.7, margin: 0 }}>
              Your Hospital Management System (HMS) can auto-push updates to HemoSync the moment a unit of blood is consumed or added — no manual entry needed. Build your integration against our FHIR R4 endpoints. Conformance statement available at <span style={{ fontFamily: font.mono, color: C.amber }}>/fhir/r4/metadata</span>.
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// BLOOD BANK PORTAL (Desktop, e-RaktKosh + WhatsApp)
// ══════════════════════════════════════════════════════════════════════════════

const WA_LOG = [
  { bank: 'Rajiv Gandhi Blood Bank, Nagpur', time: '06:02 AM', message: 'O- 12, AB+ 4, B+ 28', parsed: true },
  { bank: 'Lions Club BB, Surat', time: '06:00 AM', message: 'O- 5, A- 9, AB- 2', parsed: true },
  { bank: 'Red Cross, Patna', time: '05:58 AM', message: 'B- 7 O+ 34', parsed: true },
  { bank: 'City Blood Bank, Jaipur', time: '05:55 AM', message: 'No stock update today', parsed: false },
  { bank: 'Govt BB Ahmedabad', time: '05:50 AM', message: 'O- 18, A+ 42, B+ 19, AB+ 6', parsed: true },
]

const RAKTKOSHA_BANKS = [
  { id: 'RK-04821', name: 'AIIMS Blood Bank', city: 'New Delhi', state: 'Delhi', lastSync: '2 min ago', status: 'synced', units: 312 },
  { id: 'RK-04819', name: 'Safdarjung Blood Bank', city: 'New Delhi', state: 'Delhi', lastSync: '5 min ago', status: 'synced', units: 187 },
  { id: 'RK-04812', name: 'KEM Hospital BB', city: 'Mumbai', state: 'Maharashtra', lastSync: '11 min ago', status: 'synced', units: 241 },
  { id: 'RK-04807', name: 'Govt BB Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', lastSync: '34 min ago', status: 'warning', units: 98 },
  { id: 'RK-04801', name: 'JIPMER BB', city: 'Puducherry', state: 'Puducherry', lastSync: '1h 12m ago', status: 'stale', units: 156 },
]

const BB_INVENTORY: { type: BloodType; units: number; reserved: number; trend: string }[] = [
  { type: 'O+', units: 68, reserved: 12, trend: '+6' },
  { type: 'O−', units: 14, reserved: 4, trend: '−2' },
  { type: 'A+', units: 42, reserved: 8, trend: '+3' },
  { type: 'A−', units: 11, reserved: 2, trend: '−1' },
  { type: 'B+', units: 31, reserved: 5, trend: '+2' },
  { type: 'B−', units: 7, reserved: 1, trend: '−1' },
  { type: 'AB+', units: 22, reserved: 3, trend: '+1' },
  { type: 'AB−', units: 5, reserved: 0, trend: '0' },
]

const INCOMING_REQUESTS = [
  { id: 'HR-2291', hospital: 'AIIMS Delhi', type: 'O−', units: 4, urgency: 'CRITICAL', time: '3 min ago' },
  { id: 'HR-2290', hospital: 'Safdarjung', type: 'A−', units: 2, urgency: 'URGENT', time: '18 min ago' },
  { id: 'HR-2287', hospital: 'Ram Manohar Lohia', type: 'B+', units: 6, urgency: 'STANDARD', time: '2h ago' },
]

function IncomingRequestCard({ req }: { req: typeof INCOMING_REQUESTS[0] }) {
  const [acted, setActed] = useState<'fulfill' | 'decline' | null>(null)
  const urgColor = req.urgency === 'CRITICAL' ? C.red : req.urgency === 'URGENT' ? C.amber : C.green
  return (
    <div style={{ background: '#0a0a0b', borderRadius: 3, padding: '12px 14px', border: `1px solid ${req.urgency === 'CRITICAL' ? 'rgba(200,25,44,0.2)' : 'transparent'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontFamily: font.display, fontSize: 16, color: urgColor }}>{req.type}</div>
        <Tag color={urgColor}>{req.urgency}</Tag>
      </div>
      <div style={{ fontSize: 12, color: C.text, marginBottom: 2 }}>{req.hospital}</div>
      <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim, marginBottom: 10 }}>{req.units} units · {req.time}</div>
      {acted ? (
        <div style={{ fontFamily: font.mono, fontSize: 10, color: acted === 'fulfill' ? C.green : C.muted }}>
          {acted === 'fulfill' ? '✓ Fulfillment confirmed' : 'Declined — insufficient stock'}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setActed('fulfill')} style={{ flex: 1, background: C.red, color: '#fff', border: 'none', padding: '7px', borderRadius: 3, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Fulfill</button>
          <button onClick={() => setActed('decline')} style={{ flex: 1, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, padding: '7px', borderRadius: 3, fontSize: 11, cursor: 'pointer' }}>Decline</button>
        </div>
      )}
    </div>
  )
}

function BBDashboard() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState('4 min ago')

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => { setSyncing(false); setLastSync('just now') }, 1800)
  }

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* e-RaktKosh panel */}
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: syncing ? C.amber : C.green, transition: 'background 0.3s' }} />
              <span style={{ fontFamily: font.display, fontSize: 16, color: C.text }}>e-RaktKosh Sync</span>
            </div>
            <button onClick={handleSync} style={{ background: C.redBg, border: `1px solid ${C.redBorder}`, color: C.red, padding: '6px 14px', borderRadius: 3, fontSize: 11, fontFamily: font.mono, letterSpacing: '0.05em', cursor: 'pointer' }}>
              {syncing ? 'SYNCING…' : 'SYNC NOW'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[{ label: 'Last Sync', val: lastSync }, { label: 'Banks in Network', val: '4,284' }, { label: 'Data Source', val: 'CDAC / MoHFW' }].map(({ label, val }) => (
              <div key={label} style={{ background: '#0a0a0b', borderRadius: 3, padding: '10px 10px' }}>
                <div style={{ fontFamily: font.mono, fontSize: 11, color: C.text }}>{val}</div>
                <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.06em', marginBottom: 8 }}>CONNECTED BANKS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {RAKTKOSHA_BANKS.slice(0, 4).map(b => {
              const sc = b.status === 'synced' ? C.green : b.status === 'warning' ? C.amber : C.red
              return (
                <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px', gap: 8, alignItems: 'center', background: '#0a0a0b', borderRadius: 3, padding: '8px 10px' }}>
                  <div>
                    <div style={{ fontSize: 12, color: C.text }}>{b.name}</div>
                    <div style={{ fontFamily: font.mono, fontSize: 9, color: C.dim }}>{b.city}, {b.state}</div>
                  </div>
                  <div style={{ fontFamily: font.mono, fontSize: 9, color: C.dim }}>{b.lastSync}</div>
                  <Tag color={sc}>{b.status.toUpperCase()}</Tag>
                </div>
              )
            })}
          </div>
        </Card>

        {/* WhatsApp panel */}
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>📱</span>
            <span style={{ fontFamily: font.display, fontSize: 16, color: C.text }}>WhatsApp Updates</span>
            <Tag color={C.green}>Twilio API</Tag>
          </div>
          <div style={{ background: '#0a0a0b', borderRadius: 3, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, marginBottom: 6, letterSpacing: '0.06em' }}>AUTOMATED SCHEDULE</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 14, color: C.amber }}>08:00 AM</div>
                <div style={{ fontSize: 11, color: C.dim }}>Morning prompt</div>
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 14, color: C.amber }}>06:00 PM</div>
                <div style={{ fontSize: 11, color: C.dim }}>Evening prompt</div>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: '8px 10px', background: '#141416', borderRadius: 3, fontFamily: font.mono, fontSize: 10, color: C.sub }}>
              "Reply with your current O- and AB+ stock count."
            </div>
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.06em', marginBottom: 8 }}>RECENT REPLIES ({WA_LOG.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {WA_LOG.map((entry, i) => (
              <div key={i} style={{ background: '#0a0a0b', borderRadius: 3, padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: C.text }}>{entry.bank}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, marginTop: 2 }}>"{entry.message}"</div>
                </div>
                <div style={{ fontFamily: font.mono, fontSize: 9, color: C.dim }}>{entry.time}</div>
                <Tag color={entry.parsed ? C.green : C.amber}>{entry.parsed ? 'PARSED' : 'MANUAL'}</Tag>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Inventory management */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <Card style={{ padding: '20px 22px' }}>
          <SectionTitle title="My Inventory" sub="INDIAN RED CROSS BLOOD BANK · NEW DELHI" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {BB_INVENTORY.map(item => {
              const available = item.units - item.reserved
              const color = available < 10 ? C.red : available < 25 ? C.amber : C.green
              return (
                <div key={item.type} style={{ background: '#0a0a0b', borderRadius: 3, padding: '12px 14px' }}>
                  {available < 10 && <div style={{ fontFamily: font.mono, fontSize: 9, color: C.red, letterSpacing: '0.07em', marginBottom: 6 }}>▲ LOW</div>}
                  <div style={{ fontFamily: font.display, fontSize: 20, color: C.text, marginBottom: 2 }}>{item.type}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 18, color, marginBottom: 2 }}>{available}</div>
                  <div style={{ fontSize: 9, color: C.dim, marginBottom: 6 }}>{item.reserved} reserved</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ height: 2, flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginRight: 8 }}>
                      <div style={{ height: '100%', width: `${Math.min((available / 80) * 100, 100)}%`, background: color, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: font.mono, fontSize: 9, color: item.trend.startsWith('+') ? C.green : item.trend === '0' ? C.dim : C.red }}>
                      {item.trend}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Incoming hospital requests */}
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <PulseDoc />
            <span style={{ fontFamily: font.display, fontSize: 16, color: C.text }}>Incoming Requests</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {INCOMING_REQUESTS.map(req => <IncomingRequestCard key={req.id} req={req} />)}
          </div>
        </Card>
      </div>
    </div>
  )
}

function BBRaktKosh() {
  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 64px' }}>
      <SectionTitle title="e-RaktKosh Integration" sub="CDAC / MINISTRY OF HEALTH & FAMILY WELFARE · NATIONAL BLOOD BANK NETWORK" />
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 14 }}>ALL CONNECTED BANKS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {RAKTKOSHA_BANKS.map(b => {
              const sc = b.status === 'synced' ? C.green : b.status === 'warning' ? C.amber : C.red
              return (
                <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 90px 60px 80px', gap: 12, alignItems: 'center', background: '#0a0a0b', borderRadius: 3, padding: '10px 14px' }}>
                  <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim }}>{b.id}</div>
                  <div>
                    <div style={{ fontSize: 12, color: C.text }}>{b.name}</div>
                    <div style={{ fontFamily: font.mono, fontSize: 9, color: C.dim }}>{b.city}, {b.state}</div>
                  </div>
                  <div style={{ fontFamily: font.mono, fontSize: 10, color: C.dim }}>{b.lastSync}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 12, color: C.text }}>{b.units}</div>
                  <Tag color={sc}>{b.status.toUpperCase()}</Tag>
                </div>
              )
            })}
          </div>
        </Card>
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 14 }}>ABOUT e-RAKTKOSHA</div>
          <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.7, margin: '0 0 14px' }}>
            e-RaktKosh is a centralized blood bank management system run by the Government of India aggregating data from thousands of blood banks nationwide via CDAC and the Ministry of Health.
          </p>
          <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.7, margin: '0 0 16px' }}>
            HemoSync pulls regional blood availability data directly from the e-RaktKosh portal, populating our network maps and inventory on day one — even before a blood bank officially registers.
          </p>
          <div style={{ background: '#0a0a0b', borderRadius: 3, padding: '12px 14px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 10, color: C.amber, marginBottom: 6 }}>DATA ACCESS METHOD</div>
            <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
              Formally requested API access from CDAC / Ministry of Health. Compliant with e-RaktKosh terms of service. Regional data refreshed every 90 seconds.
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function BBWhatsApp() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true); setTimeout(() => setSent(false), 3000) }, 1400)
  }

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 64px' }}>
      <SectionTitle title="WhatsApp Update System" sub="TWILIO WHATSAPP API · LOW-TECH FALLBACK FOR TIER-2 / TIER-3 CITIES" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 14 }}>HOW IT WORKS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { step: '01', title: 'Scheduled Outbound', desc: 'Automated message sent to blood bank manager at 8:00 AM and 6:00 PM via Twilio WhatsApp Business API.' },
              { step: '02', title: 'Simple Reply', desc: 'Manager replies with just a number or short text: "O- 12, AB+ 4, B+ 28". No app needed.' },
              { step: '03', title: 'Auto-Parse', desc: 'Our NLP backend parses the reply, extracts blood type quantities, and updates the dashboard inventory in under 2 seconds.' },
              { step: '04', title: 'Fallback Flag', desc: 'If a reply cannot be parsed automatically, it\'s flagged for manual review with the raw message preserved.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10, alignItems: 'start' }}>
                <div style={{ fontFamily: font.mono, fontSize: 10, color: C.red, marginTop: 2 }}>{step}</div>
                <div>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card style={{ padding: '20px 22px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 12 }}>SEND MANUAL PROMPT</div>
            <div style={{ background: '#0a0a0b', borderRadius: 3, padding: '10px 14px', marginBottom: 12, fontFamily: font.mono, fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
              "Hello! Please reply with your current O- and AB+ stock count. Example: O- 12, AB+ 4"
            </div>
            <select style={{ width: '100%', background: '#0a0a0b', border: `1px solid ${C.border}`, color: C.text, padding: '9px 12px', borderRadius: 3, fontSize: 13, marginBottom: 10, fontFamily: font.sans }}>
              <option>All registered blood banks (284)</option>
              <option>Delhi NCR blood banks (42)</option>
              <option>Critical stock only (18)</option>
            </select>
            <button onClick={handleSend} style={{ width: '100%', background: sent ? 'rgba(61,191,126,0.1)' : '#25D366', color: sent ? C.green : '#fff', border: sent ? `1px solid ${C.green}44` : 'none', padding: '10px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>
              {sending ? 'Sending via Twilio…' : sent ? '✓ Messages Dispatched' : '📱 Send WhatsApp Prompt'}
            </button>
          </Card>

          <Card style={{ padding: '18px 20px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 10 }}>REPLY LOG (TODAY)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {WA_LOG.map((entry, i) => (
                <div key={i} style={{ background: '#0a0a0b', borderRadius: 3, padding: '8px 10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: C.text }}>{entry.bank}</span>
                    <Tag color={entry.parsed ? C.green : C.amber}>{entry.parsed ? 'PARSED' : 'MANUAL'}</Tag>
                  </div>
                  <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted }}>"{entry.message}"</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function BloodBankPortal({ onSwitchRole }: { onSwitchRole: () => void }) {
  const tabs = ['Dashboard', 'e-RaktKosh', 'WhatsApp Updates', 'Inventory']
  const [activeTab, setActiveTab] = useState('Dashboard')

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <TopNav role="bloodbank" onSwitchRole={onSwitchRole} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ background: C.redBg, borderBottom: `1px solid ${C.redBorder}`, padding: '7px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: font.mono, fontSize: 10, color: C.red, letterSpacing: '0.05em' }}>🏪 Indian Red Cross Blood Bank · New Delhi · e-RaktKosh ID: RK-04823</span>
        <span style={{ fontFamily: font.mono, fontSize: 10, color: C.dim }}>3 incoming requests · WhatsApp: 5 replies parsed · Last e-RaktKosh sync: 4 min ago</span>
      </div>
      {activeTab === 'Dashboard' && <BBDashboard />}
      {activeTab === 'e-RaktKosh' && <BBRaktKosh />}
      {activeTab === 'WhatsApp Updates' && <BBWhatsApp />}
      {activeTab === 'Inventory' && (
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px 64px' }}>
          <SectionTitle title="Inventory Management" sub="INDIAN RED CROSS · NEW DELHI" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {BB_INVENTORY.map(item => {
              const available = item.units - item.reserved
              const color = available < 10 ? C.red : available < 25 ? C.amber : C.green
              return (
                <Card key={item.type} style={{ padding: '18px 20px' }}>
                  {available < 10 && <div style={{ fontFamily: font.mono, fontSize: 9, color: C.red, letterSpacing: '0.08em', marginBottom: 8 }}>▲ LOW STOCK</div>}
                  <div style={{ fontFamily: font.display, fontSize: 26, color: C.text, marginBottom: 4 }}>{item.type}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 22, color, marginBottom: 2 }}>{available}</div>
                  <div style={{ fontSize: 10, color: C.dim, marginBottom: 2 }}>units available</div>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>{item.reserved} units reserved</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${Math.min((available / 80) * 100, 100)}%`, background: color, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontFamily: font.mono, fontSize: 11, color: item.trend.startsWith('+') ? C.green : item.trend === '0' ? C.dim : C.red }}>
                    {item.trend} today
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH SYSTEM
// ══════════════════════════════════════════════════════════════════════════════

type AuthScreen = 'role-pick' | 'login' | 'register' | 'verify'

const INDIAN_CITIES = ['New Delhi','Mumbai','Bengaluru','Chennai','Hyderabad','Pune','Kolkata','Ahmedabad','Jaipur','Lucknow','Chandigarh','Nagpur','Surat','Patna','Bhopal']

const ROLE_META: Record<string, { label: string; icon: string; color: string; desc: string; badge: string }> = {
  donor:     { label: 'Donor',      icon: '🩸', color: C.green,  desc: 'Register as a blood donor and respond to emergency requests.', badge: 'Mobile-optimised' },
  hospital:  { label: 'Hospital',   icon: '🏥', color: C.amber,  desc: 'Submit blood requests and manage fulfillment via FHIR.', badge: 'FHIR Integrated' },
  bloodbank: { label: 'Blood Bank', icon: '🏪', color: C.red,    desc: 'Manage inventory, sync with e-RaktKosh and WhatsApp updates.', badge: 'e-RaktKosh Sync' },
}

// ── Shared auth shell ──────────────────────────────────────────────────────

function AuthShell({ children, maxWidth = 440 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <HemoSyncLogo size={36} />
        <span style={{ fontFamily: font.display, fontSize: 22, color: C.text }}>
          Hemo<span style={{ color: C.red }}>Sync</span>
        </span>
      </div>
      <div style={{ width: '100%', maxWidth }}>
        {children}
      </div>
      <div style={{ marginTop: 32, fontFamily: font.mono, fontSize: 10, color: C.dim, letterSpacing: '0.05em', textAlign: 'center' }}>
        BLOOD DONATION & EMERGENCY DONOR NETWORK · INDIA
      </div>
    </div>
  )
}

// ── Input component ────────────────────────────────────────────────────────

function AuthInput({ label, type = 'text', value, onChange, placeholder, hint, error }: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; error?: string
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', background: '#0d0d0f',
            border: `1px solid ${error ? C.red : C.border}`,
            color: C.text, padding: '11px 14px', borderRadius: 3,
            fontSize: 14, fontFamily: font.sans,
            outline: 'none', boxSizing: 'border-box',
            paddingRight: isPassword ? 42 : 14,
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = error ? C.red : 'rgba(255,255,255,0.2)' }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? C.red : C.border }}
        />
        {isPassword && (
          <button onClick={() => setShow(s => !s)} type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, padding: 2 }}>
            {show ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {error && <div style={{ fontSize: 11, color: C.red, marginTop: 5, fontFamily: font.mono }}>{error}</div>}
      {hint && !error && <div style={{ fontSize: 11, color: C.dim, marginTop: 5 }}>{hint}</div>}
    </div>
  )
}

function AuthSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: '#0d0d0f', border: `1px solid ${C.border}`, color: value ? C.text : C.dim, padding: '11px 14px', borderRadius: 3, fontSize: 14, fontFamily: font.sans, cursor: 'pointer' }}>
        <option value="" disabled>Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function AuthBtn({ children, onClick, loading, variant = 'primary', color }: {
  children: React.ReactNode; onClick?: () => void; loading?: boolean; variant?: 'primary' | 'outline'; color?: string
}) {
  const bg = variant === 'primary' ? (color ?? C.red) : 'transparent'
  const border = variant === 'outline' ? `1px solid ${C.border}` : 'none'
  return (
    <button onClick={onClick} disabled={loading} style={{ width: '100%', background: bg, color: variant === 'primary' ? '#fff' : C.muted, border, padding: '12px', borderRadius: 3, fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s', fontFamily: font.sans, letterSpacing: '0.02em' }}>
      {loading ? 'Please wait…' : children}
    </button>
  )
}

// ── Step 1: Role picker (auth entry) ──────────────────────────────────────

function AuthRolePick({ onNext }: { onNext: (role: Role, mode: 'login' | 'register') => void }) {
  const [selected, setSelected] = useState<Role>(null)
  return (
    <AuthShell maxWidth={680}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontFamily: font.display, fontSize: 'clamp(26px,4vw,38px)', fontWeight: 400, color: C.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          Who are you?
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Select your role to continue to login or registration.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {(['donor', 'hospital', 'bloodbank'] as const).map(r => {
          const m = ROLE_META[r]
          const active = selected === r
          return (
            <button key={r} onClick={() => setSelected(r)} style={{ background: active ? `${m.color}12` : C.card, border: `1px solid ${active ? m.color : C.border}`, borderRadius: 5, padding: '20px 16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{m.icon}</div>
              <div style={{ fontFamily: font.display, fontSize: 15, color: C.text, marginBottom: 5 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{m.desc}</div>
              {active && <div style={{ marginTop: 10, fontFamily: font.mono, fontSize: 10, color: m.color, letterSpacing: '0.06em' }}>✓ SELECTED</div>}
            </button>
          )
        })}
      </div>

      {selected && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, animation: 'fadeIn 0.25s ease' }}>
          <AuthBtn onClick={() => onNext(selected, 'login')} color={ROLE_META[selected].color}>
            Log In as {ROLE_META[selected].label}
          </AuthBtn>
          <AuthBtn variant="outline" onClick={() => onNext(selected, 'register')}>
            Create Account
          </AuthBtn>
        </div>
      )}
    </AuthShell>
  )
}

// ── Login page ─────────────────────────────────────────────────────────────

function LoginPage({ role, onSuccess, onRegister, onBack }: {
  role: Role; onSuccess: () => void; onRegister: () => void; onBack: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const m = ROLE_META[role!]

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email.includes('@')) e.email = 'Enter a valid email address'
    if (password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onSuccess() }, 1400)
  }

  return (
    <AuthShell>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: font.mono, letterSpacing: '0.05em', marginBottom: 24, padding: 0 }}>
        ← BACK
      </button>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>{m.icon}</span>
          <span style={{ fontFamily: font.mono, fontSize: 11, color: m.color, letterSpacing: '0.07em', background: `${m.color}12`, border: `1px solid ${m.color}33`, padding: '2px 8px', borderRadius: 2 }}>{m.badge.toUpperCase()}</span>
        </div>
        <h2 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 400, color: C.text, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
          Welcome back, <em style={{ color: m.color }}>{m.label}</em>
        </h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Sign in to your HemoSync account.</p>
      </div>

      <Card style={{ padding: '28px 26px' }}>
        <AuthInput label="EMAIL ADDRESS" type="email" value={email} onChange={setEmail} placeholder="you@hospital.in" error={errors.email} />
        <AuthInput label="PASSWORD" type="password" value={password} onChange={setPassword} placeholder="Your password" error={errors.password} />
        <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 20 }}>
          <button style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12 }}>Forgot password?</button>
        </div>
        <AuthBtn onClick={handleSubmit} loading={loading} color={m.color}>
          Sign In
        </AuthBtn>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: C.muted }}>
        Don&apos;t have an account?{' '}
        <button onClick={onRegister} style={{ background: 'none', border: 'none', color: m.color, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          Register here
        </button>
      </div>
    </AuthShell>
  )
}

// ── Register: Step 1 (common fields) ──────────────────────────────────────

type RegData = Record<string, string>

function RegisterStep1({ role, data, onChange, onNext, onLogin, onBack }: {
  role: Role; data: RegData; onChange: (k: string, v: string) => void
  onNext: () => void; onLogin: () => void; onBack: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const m = ROLE_META[role!]

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.email?.includes('@')) e.email = 'Enter a valid email'
    if ((data.password ?? '').length < 8) e.password = 'Minimum 8 characters'
    if (data.password !== data.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onNext()
  }

  return (
    <AuthShell>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: font.mono, letterSpacing: '0.05em', marginBottom: 20, padding: 0 }}>
        ← BACK
      </button>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {['Account', 'Profile', 'Verify'].map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 2, background: i === 0 ? m.color : C.border, borderRadius: 2, marginBottom: 4, transition: 'background 0.3s' }} />
            <div style={{ fontFamily: font.mono, fontSize: 9, color: i === 0 ? m.color : C.dim, letterSpacing: '0.06em' }}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>{m.icon}</span>
          <span style={{ fontFamily: font.mono, fontSize: 10, color: m.color, letterSpacing: '0.06em' }}>{m.label.toUpperCase()} REGISTRATION</span>
        </div>
        <h2 style={{ fontFamily: font.display, fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>Create your account</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Step 1 of 2 — account credentials</p>
      </div>

      <Card style={{ padding: '26px 24px' }}>
        <AuthInput label="EMAIL ADDRESS" type="email" value={data.email ?? ''} onChange={v => onChange('email', v)} placeholder="you@example.com" error={errors.email} hint="A verification code will be sent to this address" />
        <AuthInput label="PASSWORD" type="password" value={data.password ?? ''} onChange={v => onChange('password', v)} placeholder="Minimum 8 characters" error={errors.password} />
        <AuthInput label="CONFIRM PASSWORD" type="password" value={data.confirm ?? ''} onChange={v => onChange('confirm', v)} placeholder="Re-enter your password" error={errors.confirm} />
        <div style={{ marginTop: 4 }}>
          <AuthBtn onClick={handleNext} color={m.color}>Continue to Profile →</AuthBtn>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: C.muted }}>
        Already registered?{' '}
        <button onClick={onLogin} style={{ background: 'none', border: 'none', color: m.color, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Log in</button>
      </div>
    </AuthShell>
  )
}

// ── Register: Step 2 (role-specific profile) ──────────────────────────────

function YesNoField({ label, value, onChange, blockIf, blockMsg }: {
  label: string; value: string; onChange: (v: string) => void; blockIf?: string; blockMsg?: string
}) {
  const isBlocked = blockIf && value === blockIf
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Yes', 'No'].map(opt => {
          const v = opt.toLowerCase()
          const active = value === v
          const danger = active && isBlocked
          return (
            <button key={opt} onClick={() => onChange(v)} style={{ flex: 1, background: active ? (danger ? 'rgba(200,25,44,0.12)' : 'rgba(61,191,126,0.1)') : 'transparent', border: `1px solid ${active ? (danger ? C.red : C.green) : C.border}`, color: active ? (danger ? C.red : C.green) : C.muted, padding: '9px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
              {opt}
            </button>
          )
        })}
      </div>
      {isBlocked && blockMsg && (
        <div style={{ fontSize: 11, color: C.red, fontFamily: font.mono, marginTop: 6 }}>⚠ {blockMsg}</div>
      )}
    </div>
  )
}

function RegisterStep2Donor({ data, onChange, onNext, onBack, color }: {
  data: RegData; onChange: (k: string, v: string) => void; onNext: () => void; onBack: () => void; color: string
}) {
  const [gate, setGate] = useState<1 | 2>(1)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVal, setOtpVal] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const STEPS = ['Account', 'Identity', 'Medical', 'Verify']

  // Age validation
  const getAge = (dob: string) => {
    if (!dob) return 0
    const diff = Date.now() - new Date(dob).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  const validateGate1 = () => {
    const e: Record<string, string> = {}
    if (!data.name?.trim()) e.name = 'Full name is required'
    if (!data.phone?.match(/^[6-9]\d{9}$/)) e.phone = 'Enter a valid 10-digit Indian mobile number'
    if (!otpVerified) e.otp = 'Verify your mobile number with OTP'
    if (!data.bloodType) e.bloodType = 'Select your blood type'
    if (!data.gender) e.gender = 'Select your gender'
    const age = getAge(data.dob ?? '')
    if (!data.dob) e.dob = 'Date of birth is required'
    else if (age < 18) e.dob = 'You must be at least 18 years old'
    else if (age > 65) e.dob = 'Donors must be 65 years or younger'
    if (!data.city) e.city = 'Select your city'
    if (!data.pincode?.match(/^\d{6}$/)) e.pincode = 'Enter a valid 6-digit PIN code'
    return e
  }

  const validateGate2 = () => {
    const e: Record<string, string> = {}
    if (!data.weight) e.weight = 'This field is required'
    if (!data.illness) e.illness = 'This field is required'
    if (!data.emergencyWilling) e.emergencyWilling = 'This field is required'
    if (!data.donationTime) e.donationTime = 'Select a preferred time'
    return e
  }

  const handleGate1Next = () => {
    const e = validateGate1()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setGate(2)
  }

  const handleGate2Next = () => {
    const e = validateGate2()
    if (Object.keys(e).length) { setErrors(e); return }
    if (data.weight === 'no') { setErrors({ weight: 'Donors must weigh more than 50 kg.' }); return }
    if (data.illness === 'yes') { setErrors({ illness: 'Donors with active major illness are not eligible at this time.' }); return }
    setErrors({})
    onNext()
  }

  const cooldown = data.gender === 'female' ? 120 : 90

  const progressIdx = gate === 1 ? 1 : 2

  return (
    <AuthShell maxWidth={480}>
      <button onClick={gate === 2 ? () => setGate(1) : onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: font.mono, letterSpacing: '0.05em', marginBottom: 16, padding: 0 }}>← BACK</button>

      {/* 4-step progress */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 24 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 2, background: i <= progressIdx ? color : C.border, borderRadius: 2, marginBottom: 4, transition: 'background 0.3s' }} />
            <div style={{ fontFamily: font.mono, fontSize: 9, color: i <= progressIdx ? color : C.dim, letterSpacing: '0.05em' }}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {gate === 1 && (
        <>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: font.mono, fontSize: 10, color: color, letterSpacing: '0.07em', marginBottom: 4 }}>GATE 1 — IDENTITY & CONTACT</div>
            <h2 style={{ fontFamily: font.display, fontSize: 24, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>Tell us about you</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Step 2 of 3 — 7 fields, takes ~90 seconds</p>
          </div>

          <Card style={{ padding: '22px 20px' }}>
            <AuthInput label="FULL NAME" value={data.name ?? ''} onChange={v => onChange('name', v)} placeholder="Rohan Mehta" error={errors.name} />

            {/* Mobile + OTP */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 6 }}>MOBILE NUMBER</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="tel" value={data.phone ?? ''} maxLength={10}
                  onChange={e => { onChange('phone', e.target.value); setOtpSent(false); setOtpVerified(false) }}
                  placeholder="9XXXXXXXXX"
                  style={{ flex: 1, background: '#0d0d0f', border: `1px solid ${errors.phone ? C.red : C.border}`, color: C.text, padding: '10px 12px', borderRadius: 3, fontSize: 14, fontFamily: font.sans, outline: 'none' }}
                />
                <button
                  onClick={() => { if (data.phone?.match(/^[6-9]\d{9}$/)) setOtpSent(true) }}
                  style={{ background: otpVerified ? 'rgba(61,191,126,0.1)' : color, color: otpVerified ? C.green : '#fff', border: otpVerified ? `1px solid ${C.green}44` : 'none', padding: '10px 14px', borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {otpVerified ? '✓ Verified' : otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
              {errors.phone && <div style={{ fontSize: 11, color: C.red, marginTop: 5, fontFamily: font.mono }}>{errors.phone}</div>}
            </div>

            {otpSent && !otpVerified && (
              <div style={{ marginBottom: 16, background: '#0a0a0b', border: `1px solid ${C.border}`, borderRadius: 3, padding: '12px 14px' }}>
                <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.06em', marginBottom: 8 }}>ENTER 4-DIGIT OTP SENT TO {data.phone}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text" maxLength={4} value={otpVal} onChange={e => setOtpVal(e.target.value.replace(/\D/g, ''))}
                    placeholder="1 2 3 4"
                    style={{ flex: 1, background: '#141416', border: `1px solid ${C.border}`, color: C.text, padding: '10px 12px', borderRadius: 3, fontSize: 18, fontFamily: font.mono, letterSpacing: '0.3em', textAlign: 'center', outline: 'none' }}
                  />
                  <button
                    onClick={() => { if (otpVal.length === 4) setOtpVerified(true) }}
                    style={{ background: C.green, color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
            {errors.otp && <div style={{ fontSize: 11, color: C.red, marginBottom: 12, fontFamily: font.mono }}>{errors.otp}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              <AuthSelect label="BLOOD TYPE" value={data.bloodType ?? ''} onChange={v => onChange('bloodType', v)} options={BLOOD_TYPES} />
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 6 }}>GENDER</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Male', 'Female', 'Other'].map(g => {
                    const v = g.toLowerCase()
                    const active = data.gender === v
                    return (
                      <button key={g} onClick={() => onChange('gender', v)} style={{ flex: 1, background: active ? `${color}14` : 'transparent', border: `1px solid ${active ? color : C.border}`, color: active ? color : C.muted, padding: '9px 4px', borderRadius: 3, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {g}
                      </button>
                    )
                  })}
                </div>
                {errors.gender && <div style={{ fontSize: 11, color: C.red, marginTop: 5, fontFamily: font.mono }}>{errors.gender}</div>}
              </div>
            </div>

            {data.gender && (
              <div style={{ marginBottom: 12, fontFamily: font.mono, fontSize: 10, color: C.muted, background: '#0a0a0b', padding: '7px 10px', borderRadius: 3 }}>
                ⏱ Donation cooldown for {data.gender}: <span style={{ color: color }}>{cooldown} days</span> between donations
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              <AuthInput
                label={`DATE OF BIRTH (18–65)`} type="date"
                value={data.dob ?? ''} onChange={v => onChange('dob', v)}
                error={errors.dob}
              />
              <AuthInput label="PINCODE" value={data.pincode ?? ''} onChange={v => onChange('pincode', v.replace(/\D/g, '').slice(0, 6))} placeholder="110001" error={errors.pincode} />
            </div>

            <AuthSelect label="CITY" value={data.city ?? ''} onChange={v => onChange('city', v)} options={INDIAN_CITIES} />
            {errors.city && <div style={{ fontSize: 11, color: C.red, marginTop: -10, marginBottom: 12, fontFamily: font.mono }}>{errors.city}</div>}

            <div style={{ marginTop: 6 }}>
              <AuthBtn onClick={handleGate1Next} color={color}>Continue to Medical Eligibility →</AuthBtn>
            </div>
          </Card>
        </>
      )}

      {gate === 2 && (
        <>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: font.mono, fontSize: 10, color: color, letterSpacing: '0.07em', marginBottom: 4 }}>GATE 2 — MEDICAL ELIGIBILITY</div>
            <h2 style={{ fontFamily: font.display, fontSize: 24, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>One-time health check</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Step 3 of 3 — asked once, re-verified every 6 months</p>
          </div>

          <Card style={{ padding: '22px 20px' }}>
            <YesNoField
              label="Do you weigh more than 50 kg?"
              value={data.weight ?? ''} onChange={v => onChange('weight', v)}
              blockIf="no" blockMsg="Minimum weight for whole-blood donation is 50 kg."
            />
            {errors.weight && !data.weight && <div style={{ fontSize: 11, color: C.red, marginTop: -8, marginBottom: 10, fontFamily: font.mono }}>{errors.weight}</div>}

            <YesNoField
              label="Do you have any major illness? (Diabetes, BP, Heart disease, Cancer, HIV, Hepatitis)"
              value={data.illness ?? ''} onChange={v => onChange('illness', v)}
              blockIf="yes" blockMsg="Active major illness disqualifies donation. You may re-register when recovered."
            />
            {errors.illness && !data.illness && <div style={{ fontSize: 11, color: C.red, marginTop: -8, marginBottom: 10, fontFamily: font.mono }}>{errors.illness}</div>}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 6 }}>LAST DONATION DATE (optional)</div>
              <input type="date" value={data.lastDonation ?? ''} onChange={e => onChange('lastDonation', e.target.value)}
                style={{ width: '100%', background: '#0d0d0f', border: `1px solid ${C.border}`, color: C.text, padding: '10px 12px', borderRadius: 3, fontSize: 14, fontFamily: font.sans, outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>Used to auto-calculate your next eligible donation date</div>
            </div>

            <YesNoField
              label="Are you willing to donate in a critical emergency (within 2 hours of alert)?"
              value={data.emergencyWilling ?? ''} onChange={v => onChange('emergencyWilling', v)}
            />
            {errors.emergencyWilling && !data.emergencyWilling && <div style={{ fontSize: 11, color: C.red, marginTop: -8, marginBottom: 10, fontFamily: font.mono }}>{errors.emergencyWilling}</div>}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 8 }}>PREFERRED DONATION TIME</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Morning', 'Afternoon', 'Evening'].map(t => {
                  const v = t.toLowerCase()
                  const active = data.donationTime === v
                  return (
                    <button key={t} onClick={() => onChange('donationTime', v)} style={{ flex: 1, background: active ? `${color}14` : 'transparent', border: `1px solid ${active ? color : C.border}`, color: active ? color : C.muted, padding: '9px 4px', borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {t === 'Morning' ? '🌅' : t === 'Afternoon' ? '☀️' : '🌙'} {t}
                    </button>
                  )
                })}
              </div>
              {errors.donationTime && <div style={{ fontSize: 11, color: C.red, marginTop: 6, fontFamily: font.mono }}>{errors.donationTime}</div>}
            </div>

            <div style={{ marginTop: 6 }}>
              <AuthBtn onClick={handleGate2Next} color={color}>Send Verification Email →</AuthBtn>
            </div>
          </Card>
        </>
      )}
    </AuthShell>
  )
}

function RegisterStep2Hospital({ data, onChange, onNext, onBack, color }: {
  data: RegData; onChange: (k: string, v: string) => void; onNext: () => void; onBack: () => void; color: string
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.hospitalName?.trim()) e.hospitalName = 'Hospital name is required'
    if (!data.regNumber?.trim()) e.regNumber = 'Registration number is required'
    if (!data.contactName?.trim()) e.contactName = 'Contact name is required'
    if (!data.phone?.match(/^[6-9]\d{9}$/)) e.phone = 'Enter a valid 10-digit number'
    if (!data.city) e.city = 'City is required'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onNext()
  }

  return (
    <AuthShell>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: font.mono, letterSpacing: '0.05em', marginBottom: 20, padding: 0 }}>← BACK</button>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {['Account', 'Profile', 'Verify'].map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 2, background: i <= 1 ? color : C.border, borderRadius: 2, marginBottom: 4 }} />
            <div style={{ fontFamily: font.mono, fontSize: 9, color: i <= 1 ? color : C.dim, letterSpacing: '0.06em' }}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: font.display, fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>Hospital Profile</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Step 2 of 2 — facility & contact details</p>
      </div>

      <Card style={{ padding: '26px 24px' }}>
        <AuthInput label="HOSPITAL NAME" value={data.hospitalName ?? ''} onChange={v => onChange('hospitalName', v)} placeholder="e.g. AIIMS New Delhi" error={errors.hospitalName} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
          <AuthInput label="REGISTRATION NUMBER" value={data.regNumber ?? ''} onChange={v => onChange('regNumber', v)} placeholder="MCI-XXXXX" error={errors.regNumber} />
          <AuthSelect label="CITY" value={data.city ?? ''} onChange={v => onChange('city', v)} options={INDIAN_CITIES} />
        </div>
        <AuthInput label="CONTACT PERSON NAME" value={data.contactName ?? ''} onChange={v => onChange('contactName', v)} placeholder="Dr. Priya Sharma" error={errors.contactName} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
          <AuthInput label="DESIGNATION" value={data.designation ?? ''} onChange={v => onChange('designation', v)} placeholder="Blood Bank In-Charge" />
          <AuthInput label="MOBILE NUMBER" value={data.phone ?? ''} onChange={v => onChange('phone', v)} placeholder="9XXXXXXXXX" error={errors.phone} />
        </div>
        <div style={{ background: `${color}0a`, border: `1px solid ${color}22`, borderRadius: 3, padding: '10px 12px', marginBottom: 14 }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color, letterSpacing: '0.06em', marginBottom: 4 }}>FHIR INTEGRATION</div>
          <div style={{ fontSize: 12, color: C.muted }}>After registration, your hospital receives FHIR R4 credentials to connect your HMS automatically.</div>
        </div>
        <AuthBtn onClick={handleNext} color={color}>Send Verification Email →</AuthBtn>
      </Card>
    </AuthShell>
  )
}

function RegisterStep2BloodBank({ data, onChange, onNext, onBack, color }: {
  data: RegData; onChange: (k: string, v: string) => void; onNext: () => void; onBack: () => void; color: string
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.bankName?.trim()) e.bankName = 'Blood bank name is required'
    if (!data.licenseNo?.trim()) e.licenseNo = 'License number is required'
    if (!data.contactName?.trim()) e.contactName = 'Contact name is required'
    if (!data.phone?.match(/^[6-9]\d{9}$/)) e.phone = 'Enter a valid 10-digit number'
    if (!data.city) e.city = 'City is required'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onNext()
  }

  return (
    <AuthShell>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: font.mono, letterSpacing: '0.05em', marginBottom: 20, padding: 0 }}>← BACK</button>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {['Account', 'Profile', 'Verify'].map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 2, background: i <= 1 ? color : C.border, borderRadius: 2, marginBottom: 4 }} />
            <div style={{ fontFamily: font.mono, fontSize: 9, color: i <= 1 ? color : C.dim, letterSpacing: '0.06em' }}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: font.display, fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>Blood Bank Profile</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Step 2 of 2 — facility & licence details</p>
      </div>

      <Card style={{ padding: '26px 24px' }}>
        <AuthInput label="BLOOD BANK NAME" value={data.bankName ?? ''} onChange={v => onChange('bankName', v)} placeholder="e.g. Red Cross Blood Bank" error={errors.bankName} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
          <AuthInput label="DRUG LICENCE NO." value={data.licenseNo ?? ''} onChange={v => onChange('licenseNo', v)} placeholder="DL-XXXXX" error={errors.licenseNo} />
          <AuthInput label="e-RAKTKOSHA ID (optional)" value={data.raktKoshId ?? ''} onChange={v => onChange('raktKoshId', v)} placeholder="RK-XXXXX" hint="Pre-fills your inventory on approval" />
        </div>
        <AuthInput label="MANAGER / CONTACT NAME" value={data.contactName ?? ''} onChange={v => onChange('contactName', v)} placeholder="Mr. Suresh Kumar" error={errors.contactName} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
          <AuthInput label="MOBILE (WhatsApp-enabled)" value={data.phone ?? ''} onChange={v => onChange('phone', v)} placeholder="9XXXXXXXXX" error={errors.phone} hint="Used for automated stock prompts" />
          <AuthSelect label="CITY" value={data.city ?? ''} onChange={v => onChange('city', v)} options={INDIAN_CITIES} />
        </div>
        <div style={{ background: `${color}0a`, border: `1px solid ${color}22`, borderRadius: 3, padding: '10px 12px', marginBottom: 14 }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color, letterSpacing: '0.06em', marginBottom: 4 }}>WHATSAPP UPDATES</div>
          <div style={{ fontSize: 12, color: C.muted }}>After verification, you&apos;ll receive automated stock-update prompts via WhatsApp twice daily.</div>
        </div>
        <AuthBtn onClick={handleNext} color={color}>Send Verification Email →</AuthBtn>
      </Card>
    </AuthShell>
  )
}

// ── Email Verification ─────────────────────────────────────────────────────

function EmailVerify({ email, role, onSuccess, onResend }: {
  email: string; role: Role; onSuccess: () => void; onResend: () => void
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const ref0 = useRef<HTMLInputElement>(null)
  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const ref3 = useRef<HTMLInputElement>(null)
  const ref4 = useRef<HTMLInputElement>(null)
  const ref5 = useRef<HTMLInputElement>(null)
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5]
  const m = ROLE_META[role!]

  useEffect(() => {
    refs[0].current?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleInput = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]
    next[i] = v
    setOtp(next)
    setError('')
    if (v && i < 5) refs[i + 1].current?.focus()
  }

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    if (digits.length === 6) {
      setOtp(digits)
      refs[5].current?.focus()
    }
  }

  const handleVerify = () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Enter the complete 6-digit code'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onSuccess() }, 1400)
  }

  const handleResend = () => {
    setResent(true)
    setCountdown(30)
    setOtp(['', '', '', '', '', ''])
    refs[0].current?.focus()
    onResend()
    setTimeout(() => setResent(false), 3000)
  }

  return (
    <AuthShell>
      <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
        {['Account', 'Profile', 'Verify'].map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 2, background: m.color, borderRadius: 2, marginBottom: 4 }} />
            <div style={{ fontFamily: font.mono, fontSize: 9, color: m.color, letterSpacing: '0.06em' }}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>📧</div>
        <h2 style={{ fontFamily: font.display, fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 8px' }}>Check your email</h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6 }}>
          We sent a 6-digit verification code to<br />
          <strong style={{ color: C.text }}>{email}</strong>
        </p>
      </div>

      <Card style={{ padding: '28px 24px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 10, color: C.muted, letterSpacing: '0.07em', marginBottom: 14, textAlign: 'center' }}>
          ENTER VERIFICATION CODE
        </div>

        {/* OTP inputs */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              style={{
                width: 48, height: 56, textAlign: 'center',
                background: '#0d0d0f',
                border: `1px solid ${error ? C.red : digit ? m.color : C.border}`,
                color: C.text, borderRadius: 4,
                fontSize: 22, fontFamily: font.mono, fontWeight: 700,
                outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = m.color }}
              onBlur={e => { e.currentTarget.style.borderColor = digit ? m.color : error ? C.red : C.border }}
            />
          ))}
        </div>

        {error && <div style={{ textAlign: 'center', fontSize: 12, color: C.red, fontFamily: font.mono, marginBottom: 14 }}>{error}</div>}

        <AuthBtn onClick={handleVerify} loading={loading} color={m.color}>
          Verify & Activate Account
        </AuthBtn>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: C.muted }}>
          {countdown > 0 ? (
            <span>Resend code in <span style={{ fontFamily: font.mono, color: C.text }}>{countdown}s</span></span>
          ) : (
            <button onClick={handleResend} style={{ background: 'none', border: 'none', color: m.color, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              {resent ? '✓ Code resent!' : 'Resend code'}
            </button>
          )}
        </div>
      </Card>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: C.dim }}>Wrong email? <button style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12 }}>Go back to edit</button></div>
      </div>
    </AuthShell>
  )
}

// ── Auth orchestrator ──────────────────────────────────────────────────────

function AuthGate({ onAuthenticated }: { onAuthenticated: (role: Role) => void }) {
  const [screen, setScreen] = useState<AuthScreen>('role-pick')
  const [role, setRole] = useState<Role>(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState(1)
  const [regData, setRegData] = useState<RegData>({})

  const updateReg = (k: string, v: string) => setRegData(p => ({ ...p, [k]: v }))
  const m = role ? ROLE_META[role] : null

  const handleRolePick = (r: Role, md: 'login' | 'register') => {
    setRole(r); setMode(md); setStep(1)
    setScreen(md === 'login' ? 'login' : 'register')
  }

  const handleLoginSuccess = () => setScreen('verify')
  const handleStep1Next = () => setStep(2)
  const handleStep2Next = () => setScreen('verify')
  const handleVerified = () => onAuthenticated(role)

  if (screen === 'role-pick') return <AuthRolePick onNext={handleRolePick} />

  if (screen === 'login') return (
    <LoginPage
      role={role}
      onSuccess={handleLoginSuccess}
      onRegister={() => { setMode('register'); setStep(1); setScreen('register') }}
      onBack={() => setScreen('role-pick')}
    />
  )

  if (screen === 'verify') return (
    <EmailVerify
      email={regData.email ?? 'you@example.com'}
      role={role}
      onSuccess={handleVerified}
      onResend={() => {}}
    />
  )

  if (screen === 'register') {
    if (step === 1) return (
      <RegisterStep1
        role={role} data={regData}
        onChange={updateReg}
        onNext={handleStep1Next}
        onLogin={() => setScreen('login')}
        onBack={() => setScreen('role-pick')}
      />
    )

    if (step === 2) {
      const props = { data: regData, onChange: updateReg, onNext: handleStep2Next, onBack: () => setStep(1), color: m!.color }
      if (role === 'donor') return <RegisterStep2Donor {...props} />
      if (role === 'hospital') return <RegisterStep2Hospital {...props} />
      if (role === 'bloodbank') return <RegisterStep2BloodBank {...props} />
    }
  }

  return null
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [role, setRole] = useState<Role>(null)

  if (!authed) return <AuthGate onAuthenticated={r => { setRole(r); setAuthed(true) }} />

  if (role === 'donor') return <DonorPortal onSwitchRole={() => { setAuthed(false); setRole(null) }} />
  if (role === 'hospital') return <HospitalPortal onSwitchRole={() => { setAuthed(false); setRole(null) }} />
  if (role === 'bloodbank') return <BloodBankPortal onSwitchRole={() => { setAuthed(false); setRole(null) }} />
  return null
}

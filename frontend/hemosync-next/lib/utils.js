import { clsx } from 'clsx'

export const cn = (...args) => clsx(...args)

export const urgencyColor = (u) =>
  u === 'critical' ? 'text-blood-mid' : u === 'urgent' ? 'text-amber' : 'text-slate'

export const urgencyBg = (u) =>
  u === 'critical' ? 'bg-blood-bg  border-blood/30'  :
  u === 'urgent'   ? 'bg-amber/5   border-amber/25'  :
                     'bg-surface   border-white/8'

export const inventoryColor = (u) =>
  u <= 3 ? 'bg-blood' : u <= 10 ? 'bg-amber' : 'bg-emerald'

export const inventoryTextColor = (u) =>
  u <= 3 ? 'text-blood-mid' : u <= 10 ? 'text-amber' : 'text-emerald'

export const syncStatusColor = (s) =>
  s === 'synced' ? 'text-emerald' : s === 'warning' ? 'text-amber' : s === 'stale' ? 'text-blood-mid' : 'text-muted'

export const formatTrend = (n) =>
  !n || n === 0 ? '±0' : n > 0 ? `+${n}` : `${n}`

export const calculateAge = (dob) => {
  const today = new Date(), birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--
  return age
}

export const mapsUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const timeAgo = (iso) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60)    return `${s}s ago`
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export const setToken       = (t) => localStorage.setItem('hs_token', t)
export const getToken       = ()  => (typeof window !== 'undefined' ? localStorage.getItem('hs_token')  : null)
export const clearToken     = ()  => localStorage.removeItem('hs_token')
export const setStoredRole  = (r) => localStorage.setItem('hs_role', r)
export const getStoredRole  = ()  => (typeof window !== 'undefined' ? localStorage.getItem('hs_role')   : null)
export const clearStoredRole= ()  => localStorage.removeItem('hs_role')

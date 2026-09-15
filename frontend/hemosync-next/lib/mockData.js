// ─── Donor ────────────────────────────────────────────────────────────────────
export const MOCK_DONOR_PROFILE = {
  id: 'd-001', name: 'Rohan Mehta', email: 'rohan.mehta@gmail.com',
  mobile: '+91 98765 43210', bloodType: 'O−', gender: 'male',
  dob: '1994-03-15', city: 'New Delhi', pincode: '110001',
  weight: 72, emergencyWilling: true, preferredTime: 'Morning (8AM–12PM)',
  lastDonation: '2026-06-08', nextEligible: '2026-09-06',
  totalDonations: 7, livesImpacted: 21, isEligible: true, cooldownDays: 0,
}

export const MOCK_DONOR_ALERTS = [
  { id: 'alert-001', urgency: 'critical', bloodType: 'O−', units: 2, hospital: 'AIIMS Trauma Centre',    hospitalPhone: '+919025879003', address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',  distance: '3.2 km', postedAt: '2026-09-08T06:14:00Z', respondBy: '2026-09-08T08:00:00Z', notes: 'Road accident victim, O− urgently required for surgery' },
  { id: 'alert-002', urgency: 'urgent',   bloodType: 'O−', units: 1, hospital: 'Safdarjung Hospital',    hospitalPhone: '+918778571234', address: 'Ansari Nagar West, New Delhi',                  distance: '4.8 km', postedAt: '2026-09-08T05:50:00Z', respondBy: '2026-09-08T10:00:00Z', notes: 'Post-op patient, pre-screened donors preferred' },
  { id: 'alert-003', urgency: 'standard', bloodType: 'O−', units: 1, hospital: 'RML Hospital',           hospitalPhone: '+919998887776', address: 'Baba Kharak Singh Marg, New Delhi',            distance: '6.1 km', postedAt: '2026-09-08T04:30:00Z', respondBy: '2026-09-08T14:00:00Z', notes: 'Elective surgery scheduled for afternoon' },
]

export const MOCK_DONATION_HISTORY = [
  { id: 'h-001', date: '08 Jun 2026', hospital: 'AIIMS Blood Bank, New Delhi',    bloodType: 'O−', units: 1, status: 'Completed', notes: 'Post-donation checkup completed' },
  { id: 'h-002', date: '07 Mar 2026', hospital: 'Safdarjung Hospital, New Delhi', bloodType: 'O−', units: 1, status: 'Completed', notes: null },
  { id: 'h-003', date: '04 Dec 2025', hospital: 'RML Hospital, New Delhi',        bloodType: 'O−', units: 1, status: 'Completed', notes: null },
  { id: 'h-004', date: '01 Sep 2025', hospital: 'GTB Hospital, New Delhi',        bloodType: 'O−', units: 1, status: 'Completed', notes: 'Emergency donation' },
  { id: 'h-005', date: '29 May 2025', hospital: 'AIIMS Blood Bank, New Delhi',    bloodType: 'O−', units: 1, status: 'Completed', notes: null },
  { id: 'h-006', date: '14 Feb 2025', hospital: 'Max Hospital, Saket',            bloodType: 'O−', units: 1, status: 'Cancelled', notes: 'Donor had mild fever on appointment day' },
  { id: 'h-007', date: '09 Nov 2024', hospital: 'Fortis Vasant Kunj',             bloodType: 'O−', units: 1, status: 'Completed', notes: null },
]

export const MOCK_NEARBY_BANKS = [
  { id: 'b-001', name: 'AIIMS Blood Bank',                  address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi', distance: '3.2 km', phone: '+911126588500', openNow: true,  emergencySupport: true,  availableTypes: ['A+','A−','O+','O−','B+','AB+'],         inventory: { 'A+': 18, 'A−': 4, 'O+': 22, 'O−': 6,  'B+': 14, 'B−': 2, 'AB+': 8,  'AB−': 1 } },
  { id: 'b-002', name: 'Safdarjung Hospital Blood Bank',    address: 'Ansari Nagar West, Ring Road, New Delhi',      distance: '4.8 km', phone: '+911126730000', openNow: true,  emergencySupport: true,  availableTypes: ['A+','B+','O+','O−','AB+'],               inventory: { 'A+': 12, 'A−': 0, 'O+': 19, 'O−': 3,  'B+': 10, 'B−': 0, 'AB+': 5,  'AB−': 0 } },
  { id: 'b-003', name: 'RML Hospital Blood Bank',           address: 'Baba Kharak Singh Marg, Connaught Place',     distance: '6.1 km', phone: '+911123365525', openNow: false, emergencySupport: false, availableTypes: ['A+','B+','O+','AB+'],                    inventory: { 'A+': 9,  'A−': 0, 'O+': 11, 'O−': 0,  'B+': 8,  'B−': 0, 'AB+': 4,  'AB−': 0 } },
  { id: 'b-004', name: 'GTB Hospital Blood Bank',           address: 'Dilshad Garden, East Delhi',                  distance: '11.3 km',phone: '+911122285000', openNow: true,  emergencySupport: true,  availableTypes: ['A+','A−','B+','B−','O+','O−','AB+','AB−'],inventory: { 'A+': 20, 'A−': 7, 'O+': 25, 'O−': 9,  'B+': 16, 'B−': 5, 'AB+': 10, 'AB−': 3 } },
]

// ─── Hospital ─────────────────────────────────────────────────────────────────
export const MOCK_HOSPITAL_REQUESTS = [
  { id: 'req-001', bloodType: 'O−',  units: 2, urgency: 'critical', patient: 'Trauma — RTA',        ward: 'Emergency', status: 'Searching', postedAt: '2026-09-08T06:14:00Z', fhirId: 'SR-2026-0914' },
  { id: 'req-002', bloodType: 'B+',  units: 3, urgency: 'urgent',   patient: 'GI Bleed',            ward: 'ICU-2',     status: 'Matched',   postedAt: '2026-09-08T05:30:00Z', fhirId: 'SR-2026-0913', matchedDonor: { name: 'Prathibha', phone: '8438258962' } },
  { id: 'req-003', bloodType: 'A+',  units: 1, urgency: 'standard', patient: 'Elective Surgery',    ward: 'OT-3',      status: 'Fulfilled', postedAt: '2026-09-07T14:00:00Z', fhirId: 'SR-2026-0911', matchedDonor: { name: 'Charunetra', phone: '6385309382' } },
  { id: 'req-004', bloodType: 'AB+', units: 2, urgency: 'urgent',   patient: 'Post-op anaemia',     ward: 'ICU-1',     status: 'Searching', postedAt: '2026-09-08T04:45:00Z', fhirId: 'SR-2026-0912' },
  { id: 'req-005', bloodType: 'O+',  units: 4, urgency: 'critical', patient: 'Multi-organ failure', ward: 'MICU',      status: 'Matched',   postedAt: '2026-09-08T06:50:00Z', fhirId: 'SR-2026-0915', matchedDonor: { name: 'Thejaashree', phone: '8072534969' } },
  { id: 'req-006', bloodType: 'B−',  units: 1, urgency: 'standard', patient: 'Haematology case',   ward: 'Onco',      status: 'Pending',   postedAt: '2026-09-08T03:10:00Z', fhirId: 'SR-2026-0910' },
]

export const MOCK_NETWORK_INVENTORY = [
  { type: 'A+',  units: 38, trend: +5,  critical: false },
  { type: 'A−',  units: 6,  trend: -2,  critical: true  },
  { type: 'B+',  units: 29, trend: +3,  critical: false },
  { type: 'B−',  units: 4,  trend: -1,  critical: true  },
  { type: 'AB+', units: 17, trend: +1,  critical: false },
  { type: 'AB−', units: 2,  trend: 0,   critical: true  },
  { type: 'O+',  units: 44, trend: +8,  critical: false },
  { type: 'O−',  units: 8,  trend: -4,  critical: true  },
]

export const MOCK_FHIR_ENDPOINTS = [
  { id: 'fhir-001', resource: 'ServiceRequest', url: '/fhir/R4/ServiceRequest', method: 'GET/POST', pingMs: 42,   callsToday: 128, status: 'active'  },
  { id: 'fhir-002', resource: 'Substance',       url: '/fhir/R4/Substance',      method: 'GET',      pingMs: 38,   callsToday: 64,  status: 'active'  },
  { id: 'fhir-003', resource: 'Patient',         url: '/fhir/R4/Patient',        method: 'GET',      pingMs: 55,   callsToday: 212, status: 'active'  },
  { id: 'fhir-004', resource: 'Communication',   url: '/fhir/R4/Communication',  method: 'POST',     pingMs: null, callsToday: 0,   status: 'warning' },
]

// ─── Blood Bank ───────────────────────────────────────────────────────────────
export const MOCK_BB_INVENTORY = {
  totalUnits: 186, reservedUnits: 34,
  bloodTypes: [
    { type: 'A+',  total: 32, reserved: 6, trend: +3,  critical: false },
    { type: 'A−',  total: 8,  reserved: 2, trend: -1,  critical: true  },
    { type: 'B+',  total: 28, reserved: 5, trend: +2,  critical: false },
    { type: 'B−',  total: 5,  reserved: 1, trend: 0,   critical: true  },
    { type: 'AB+', total: 19, reserved: 4, trend: +1,  critical: false },
    { type: 'AB−', total: 3,  reserved: 1, trend: -1,  critical: true  },
    { type: 'O+',  total: 48, reserved: 9, trend: +7,  critical: false },
    { type: 'O−',  total: 11, reserved: 3, trend: -3,  critical: false },
  ],
}

export const MOCK_RAKTKOSHA_BANKS = [
  { id: 'rk-001', name: 'AIIMS Blood Bank',        licNo: 'DL-BB-001', syncStatus: 'synced',  lastSync: '08 Sep 2026, 07:00', units: 142 },
  { id: 'rk-002', name: 'Safdarjung Blood Bank',   licNo: 'DL-BB-002', syncStatus: 'synced',  lastSync: '08 Sep 2026, 07:00', units: 89  },
  { id: 'rk-003', name: 'RML Blood Bank',          licNo: 'DL-BB-003', syncStatus: 'stale',   lastSync: '07 Sep 2026, 19:30', units: 56  },
  { id: 'rk-004', name: 'GTB Hospital Blood Bank', licNo: 'DL-BB-004', syncStatus: 'warning', lastSync: '08 Sep 2026, 03:15', units: 34  },
  { id: 'rk-005', name: 'Lok Nayak Hospital',      licNo: 'DL-BB-005', syncStatus: 'synced',  lastSync: '08 Sep 2026, 07:00', units: 78  },
]

export const MOCK_WHATSAPP_LOG = [
  { id: 'wa-001', direction: 'out', contact: '+91 98100 11234', message: "Good morning! Please share today's blood stock update for O+, O−, A+, B+. Reply with type:units (e.g., O+:12 O−:3 A+:8)", time: '08:00 AM', status: 'delivered', parsedData: null },
  { id: 'wa-002', direction: 'in',  contact: '+91 98100 11234', message: 'O+:14 O−:4 A+:9 B+:11 AB+:5 B−:2',                                                                                           time: '08:07 AM', status: 'parsed',    parsedData: { 'O+': 14, 'O−': 4, 'A+': 9, 'B+': 11, 'AB+': 5, 'B−': 2 } },
  { id: 'wa-003', direction: 'out', contact: '+91 91234 56789', message: "Good morning! Please share today's blood stock update...",                                                                    time: '08:00 AM', status: 'delivered', parsedData: null },
  { id: 'wa-004', direction: 'in',  contact: '+91 91234 56789', message: 'A+ 8 units, B- 0 units, O+ 20, O- 5',                                                                                        time: '08:12 AM', status: 'review',    parsedData: null },
  { id: 'wa-005', direction: 'out', contact: '+91 98765 00001', message: 'Evening update: Please share current stock.',                                                                                 time: '06:00 PM', status: 'delivered', parsedData: null },
  { id: 'wa-006', direction: 'in',  contact: '+91 98765 00001', message: 'Stock normal today',                                                                                                         time: '06:20 PM', status: 'review',    parsedData: null },
]

export const MOCK_BB_INCOMING = [
  { id: 'inc-001', bloodType: 'O−',  units: 2, urgency: 'critical', hospital: 'AIIMS Trauma Centre',  hospitalPhone: '+919025879003', ward: 'Emergency', requestedAt: '2026-09-08T06:14:00Z', fhirId: 'SR-2026-0914' },
  { id: 'inc-002', bloodType: 'B+',  units: 3, urgency: 'urgent',   hospital: 'Safdarjung Hospital',  hospitalPhone: '+918778571234', ward: 'ICU-2',     requestedAt: '2026-09-08T05:30:00Z', fhirId: 'SR-2026-0913' },
  { id: 'inc-003', bloodType: 'AB+', units: 2, urgency: 'urgent',   hospital: 'Max Hospital Saket',   hospitalPhone: '+919998887776', ward: 'ICU-1',     requestedAt: '2026-09-08T04:45:00Z', fhirId: 'SR-2026-0912' },
  { id: 'inc-004', bloodType: 'O+',  units: 4, urgency: 'critical', hospital: 'RML Hospital',         hospitalPhone: '+919876543210', ward: 'MICU',      requestedAt: '2026-09-08T06:50:00Z', fhirId: 'SR-2026-0915' },
]

export const MOCK_TICKER_ITEMS = [
  '🔴 CRITICAL · AIIMS New Delhi · O− · 2 units needed now',
  '🟡 URGENT · Apollo Hyderabad · B+ · 3 units needed',
  '⚪ STANDARD · Manipal Bengaluru · A+ · 1 unit needed',
  '✅ FULFILLED · Fortis Delhi · AB+ · 2 units dispatched',
  '🔴 CRITICAL · KGMU Lucknow · O− · 4 units needed now',
  '🟡 URGENT · PGIMER Chandigarh · A− · 2 units needed',
  '✅ FULFILLED · Kokilaben Mumbai · O+ · 3 units dispatched',
  '⚪ STANDARD · CMC Vellore · AB− · 1 unit needed',
]

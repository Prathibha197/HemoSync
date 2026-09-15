export const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']

export const BLOOD_COMPATIBILITY = {
  'O−':  { donatesTo: ['A+','A−','B+','B−','AB+','AB−','O+','O−'], receivesFrom: ['O−'] },
  'O+':  { donatesTo: ['A+','B+','AB+','O+'],                       receivesFrom: ['O+','O−'] },
  'A−':  { donatesTo: ['A+','A−','AB+','AB−'],                      receivesFrom: ['A−','O−'] },
  'A+':  { donatesTo: ['A+','AB+'],                                  receivesFrom: ['A+','A−','O+','O−'] },
  'B−':  { donatesTo: ['B+','B−','AB+','AB−'],                      receivesFrom: ['B−','O−'] },
  'B+':  { donatesTo: ['B+','AB+'],                                  receivesFrom: ['B+','B−','O+','O−'] },
  'AB−': { donatesTo: ['AB+','AB−'],                                 receivesFrom: ['A−','B−','O−','AB−'] },
  'AB+': { donatesTo: ['AB+'],                                       receivesFrom: ['A+','A−','B+','B−','AB+','AB−','O+','O−'] },
}

export const DONOR_COOLDOWN_DAYS = { male: 90, female: 120, other: 90 }

export const INDIAN_CITIES = [
  'New Delhi','Mumbai','Bengaluru','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad',
  'Jaipur','Lucknow','Kanpur','Nagpur','Visakhapatnam','Indore','Thane','Bhopal',
  'Patna','Vadodara','Ghaziabad','Ludhiana','Agra','Nashik','Faridabad','Meerut',
  'Rajkot','Varanasi','Srinagar','Aurangabad','Dhanbad','Amritsar','Navi Mumbai',
  'Allahabad','Ranchi','Howrah','Coimbatore','Jabalpur','Gwalior','Vijayawada',
  'Jodhpur','Madurai','Raipur','Kota','Chandigarh','Guwahati','Solapur',
]

export const SOCKET_EVENTS = {
  EMERGENCY_REQUEST: 'emergency:request',
  INVENTORY_UPDATE:  'inventory:update',
  DONOR_RESPONDED:   'donor:responded',
  REQUEST_FULFILLED: 'request:fulfilled',
  WHATSAPP_REPLY:    'whatsapp:replyParsed',
}

export const API_ROUTES = {
  LOGIN:              '/auth/login',
  LOGOUT:             '/auth/logout',
  REGISTER_DONOR:     '/auth/register/donor',
  REGISTER_HOSPITAL:  '/auth/register/hospital',
  REGISTER_BLOODBANK: '/auth/register/bloodbank',
  VERIFY_EMAIL:       '/auth/verify-email',
  SEND_OTP:           '/auth/send-otp',
  VERIFY_OTP:         '/auth/verify-otp',
  ME:                 '/auth/me',
  DONOR_PROFILE:      '/donor/profile',
  DONOR_ALERTS:       '/donor/alerts',
  DONOR_RESPOND:      (id) => `/donor/alerts/${id}/respond`,
  DONATION_HISTORY:   '/donor/history',
  NEARBY_BANKS:       '/donor/nearby-banks',
  HOSPITAL_REQUESTS:  '/hospital/requests',
  SUBMIT_REQUEST:     '/hospital/requests',
  NETWORK_INVENTORY:  '/hospital/inventory',
  FHIR_STATUS:        '/hospital/fhir/status',
  BB_INVENTORY:       '/bloodbank/inventory',
  BB_INCOMING:        '/bloodbank/requests/incoming',
  BB_FULFILL:         (id) => `/bloodbank/requests/${id}/fulfill`,
  BB_DECLINE:         (id) => `/bloodbank/requests/${id}/decline`,
  RAKTKOSHA_STATUS:   '/bloodbank/raktkosha/status',
  RAKTKOSHA_SYNC:     '/bloodbank/raktkosha/sync',
  WHATSAPP_LOG:       '/bloodbank/whatsapp/log',
  WHATSAPP_SEND:      '/bloodbank/whatsapp/send',
}

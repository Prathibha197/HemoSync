import api, { createBloodRequest } from './api'
import { API_ROUTES } from '@/lib/constants'
import { MOCK_HOSPITAL_REQUESTS, MOCK_NETWORK_INVENTORY, MOCK_FHIR_ENDPOINTS } from '@/lib/mockData'

const USE_MOCK = false;

export const getHospitalRequests = async () => USE_MOCK ? MOCK_HOSPITAL_REQUESTS : (await api.get(API_ROUTES.HOSPITAL_REQUESTS)).data
export const getNetworkInventory = async () => USE_MOCK ? MOCK_NETWORK_INVENTORY : (await api.get(API_ROUTES.NETWORK_INVENTORY)).data
export const getFHIRStatus       = async () => USE_MOCK ? MOCK_FHIR_ENDPOINTS    : (await api.get(API_ROUTES.FHIR_STATUS)).data

export const submitBloodRequest = async (payload) => {
  // Map frontend urgency to backend Enum
  const urgencyMap = {
    'critical': 'CRITICAL',
    'urgent': 'HIGH',
    'standard': 'MEDIUM'
  }
  
  // Call our new backend API endpoint
  try {
    const response = await createBloodRequest({
      bloodType: payload.bloodType,
      urgency: urgencyMap[payload.urgency] || 'LOW',
      patient: payload.patient,
      ward: payload.ward,
      units: payload.units,
      // Include dummy coordinates for location
      longitude: 77.209,
      latitude: 28.6139 
    });
    return response.bloodRequest;
  } catch (err) {
    if (USE_MOCK) return { id: `req-mock-${Date.now()}`, ...payload, status: 'Searching', postedAt: new Date().toISOString(), fhirId: `SR-${Date.now()}` }
    throw err;
  }
}

import api from './api'
import { API_ROUTES } from '@/lib/constants'
import { MOCK_DONOR_PROFILE, MOCK_DONOR_ALERTS, MOCK_DONATION_HISTORY, MOCK_NEARBY_BANKS } from '@/lib/mockData'

const USE_MOCK = false;

export const getDonorProfile   = async ()            => USE_MOCK ? MOCK_DONOR_PROFILE   : (await api.get(API_ROUTES.DONOR_PROFILE)).data
export const getDonorAlerts    = async ()            => USE_MOCK ? MOCK_DONOR_ALERTS    : (await api.get(API_ROUTES.DONOR_ALERTS)).data
export const getDonationHistory= async ()            => USE_MOCK ? MOCK_DONATION_HISTORY : (await api.get(API_ROUTES.DONATION_HISTORY)).data
export const getNearbyBanks    = async ()            => USE_MOCK ? MOCK_NEARBY_BANKS    : (await api.get(API_ROUTES.NEARBY_BANKS)).data
export const respondToAlert    = async (id, response) => {
  if (USE_MOCK) return { success: true, id, response }
  return (await api.post(API_ROUTES.DONOR_RESPOND(id), { response })).data
}

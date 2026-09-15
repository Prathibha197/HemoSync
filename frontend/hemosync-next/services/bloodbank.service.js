import api from './api'
import { API_ROUTES } from '@/lib/constants'
import { MOCK_BB_INVENTORY, MOCK_BB_INCOMING, MOCK_RAKTKOSHA_BANKS, MOCK_WHATSAPP_LOG } from '@/lib/mockData'

const USE_MOCK = false;

export const getBBInventory      = async () => USE_MOCK ? MOCK_BB_INVENTORY : (await api.get(API_ROUTES.BB_INVENTORY)).data
export const getIncomingRequests = async () => USE_MOCK ? MOCK_BB_INCOMING  : (await api.get(API_ROUTES.BB_INCOMING)).data
export const getWhatsAppLog      = async () => USE_MOCK ? MOCK_WHATSAPP_LOG : (await api.get(API_ROUTES.WHATSAPP_LOG)).data
export const getRaktKoshaStatus  = async () => USE_MOCK ? { banks: MOCK_RAKTKOSHA_BANKS, lastGlobalSync: '2026-09-08T07:00:00Z' } : (await api.get(API_ROUTES.RAKTKOSHA_STATUS)).data
export const fulfillRequest      = async (id) => USE_MOCK ? { success: true, id } : (await api.post(API_ROUTES.BB_FULFILL(id))).data
export const declineRequest      = async (id) => USE_MOCK ? { success: true, id } : (await api.post(API_ROUTES.BB_DECLINE(id))).data
export const syncRaktKosha       = async () => USE_MOCK ? { success: true, syncedAt: new Date().toISOString() } : (await api.post(API_ROUTES.RAKTKOSHA_SYNC)).data
export const sendWhatsAppPrompt  = async (p) => USE_MOCK ? { success: true, sent: new Date().toISOString() } : (await api.post(API_ROUTES.WHATSAPP_SEND, p)).data

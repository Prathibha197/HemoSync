import api from './api'
import { API_ROUTES } from '@/lib/constants'
import { setToken, setStoredRole } from '@/lib/utils'

export const login = async ({ email, password, role }) => {
  const { data } = await api.post(API_ROUTES.LOGIN, { email, password, role })
  setToken(data.token); setStoredRole(data.role ?? role)
  return data
}
export const logout = async () => { try { await api.post(API_ROUTES.LOGOUT) } catch {} }
export const registerDonor     = async (p) => (await api.post(API_ROUTES.REGISTER_DONOR,     p)).data
export const registerHospital  = async (p) => (await api.post(API_ROUTES.REGISTER_HOSPITAL,  p)).data
export const registerBloodBank = async (p) => (await api.post(API_ROUTES.REGISTER_BLOODBANK, p)).data
export const verifyEmail       = async (p) => {
  const { data } = await api.post(API_ROUTES.VERIFY_EMAIL, p)
  if (data.token) setToken(data.token)
  return data
}
export const sendMobileOtp  = async (mobile) => (await api.post(API_ROUTES.SEND_OTP,   { mobile })).data
export const verifyMobileOtp= async (mobile, otp) => (await api.post(API_ROUTES.VERIFY_OTP, { mobile, otp })).data
export const getMe          = async () => (await api.get(API_ROUTES.ME)).data

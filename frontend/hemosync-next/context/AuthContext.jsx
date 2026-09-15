'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getToken, setToken, clearToken, getStoredRole, setStoredRole, clearStoredRole } from '@/lib/utils'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [role,    setRole]    = useState(null)
  const [token,   setTok]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = getToken(), r = getStoredRole()
    if (t) { setTok(t); setRole(r) }
    setLoading(false)
  }, [])

  const authenticate = useCallback(({ token: t, user: u, role: r }) => {
    setToken(t); setStoredRole(r); setTok(t); setUser(u ?? null); setRole(r)
  }, [])

  const logout = useCallback(() => {
    clearToken(); clearStoredRole(); setTok(null); setUser(null); setRole(null)
    if (typeof window !== 'undefined') window.location.href = '/'
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, token, loading, isAuthenticated: !!token, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  token: string | null
  setToken: (t: string | null) => void
  isAuthenticated: boolean
  role: string | null
  userName: string | null
  userEmail: string | null
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
  role: null,
  userName: null,
  userEmail: null,
})

function decodePayload(token: string | null) {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}
function decodeRole(token: string | null): string | null {
  const p = decodePayload(token)
  return p?.role || null
}
function decodeUser(token: string | null) {
  const p = decodePayload(token)
  return { name: p?.name || p?.companyName || null, email: p?.email || null }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('token')
    if (!raw) {
      localStorage.clear()
      setTokenState(null)
      window.location.reload()
      return
    }
    try {
      const payload = decodePayload(raw)
      if (!payload) {
        localStorage.clear()
        setTokenState(null)
        window.location.reload()
        return
      }
      setTokenState(raw)
    } catch {
      localStorage.clear()
      setTokenState(null)
      window.location.reload()
    }
  }, [])

  const setToken = (t: string | null) => {
    if (t) {
      localStorage.setItem('token', t)
    } else {
      localStorage.removeItem('token')
    }
    setTokenState(t)
  }

  const role = decodeRole(token)
  const { name: userName, email: userEmail } = decodeUser(token) || { name: null, email: null }

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated: !!token, role, userName, userEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

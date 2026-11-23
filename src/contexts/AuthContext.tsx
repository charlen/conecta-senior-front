import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  token: string | null
  setToken: (t: string | null) => void
  isAuthenticated: boolean
  role: string | null
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
  role: null,
})

function decodeRole(token: string | null): string | null {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) setTokenState(t)
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

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated: !!token, role }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

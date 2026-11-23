import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  token: string | null
  setToken: (t: string | null) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
})

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

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

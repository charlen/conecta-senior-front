import { useEffect, useState } from 'react'

type AuthState = {
  token: string | null
  userId: string | null
  loading: boolean
}

const TOKEN_KEY = 'cs_token'
const USER_ID_KEY = 'cs_user_id'

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem(TOKEN_KEY),
    userId: localStorage.getItem(USER_ID_KEY),
    loading: true,
  })

  useEffect(() => {
    // Verifica se token ainda é válido ao recarregar
    const token = localStorage.getItem(TOKEN_KEY)
    const userId = localStorage.getItem(USER_ID_KEY)
    setState({ token, userId, loading: false })
  }, [])

  const setSession = (token: string, userId: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_ID_KEY, userId)
    setState({ token, userId, loading: false })
  }

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
    setState({ token: null, userId: null, loading: false })
  }

  const isAuthenticated = !!state.token

  return { ...state, setSession, clearSession, isAuthenticated }
}

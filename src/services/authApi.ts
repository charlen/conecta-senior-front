const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

export type RegisterInput = { email: string; password: string; role?: 'candidate' | 'company' }
export type LoginInput = { email: string; password: string }

export const authApi = {
  register: async (data: RegisterInput) => {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Erro ao registrar')
    }
    return res.json()
  },
  login: async (data: LoginInput) => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Erro ao entrar')
    }
    return res.json()
  },
  confirm: async (token: string) => {
    const res = await fetch(`${API_URL}/users/confirm?token=${encodeURIComponent(token)}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Token inválido')
    }
    return res.json()
  },
}

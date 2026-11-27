const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

export type RegisterInput = { email: string; password: string; role?: 'candidate' | 'company' }
export type LoginInput = { email: string; password: string }
export type MessageResponse = { message?: string }
export type TokenResponse = { token: string }

/**
 * Error from the auth endpoints. `code` keeps the raw backend error (e.g. "user not found")
 * so pages can branch on it; `message` is the friendly PT-BR text to show.
 */
export class AuthApiError extends Error {
  code?: string
  status: number
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

const friendly: Record<string, string> = {
  'user not found': 'Não encontramos uma conta com este e-mail. Confira se digitou certo.',
  'invalid code': 'Código incorreto. Confira os 6 números no e-mail ou peça um novo código.',
  'code expired': 'Este código venceu (ele vale 10 minutos). Peça um novo código.',
  'email already registered': 'Este e-mail já tem cadastro. Entre pela página "Entrar".',
}

async function post<T>(path: string, body: unknown, fallback: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new AuthApiError((err.error && friendly[err.error]) || fallback, res.status, err.error)
  }
  return res.json() as Promise<T>
}

export const authApi = {
  register: (data: RegisterInput) => post<MessageResponse>('/users/register', data, 'Não foi possível criar sua conta agora. Tente de novo em instantes.'),
  login: (data: LoginInput) => post<TokenResponse>('/users/login', data, 'Não foi possível entrar agora. Tente de novo em instantes.'),
  /** Sends a 6-digit code by e-mail (new pending accounts and passwordless login). */
  requestCode: (email: string) => post<MessageResponse>('/users/request-code', { email }, 'Não conseguimos enviar o código agora. Tente de novo em instantes.'),
  verifyCode: (email: string, code: string) => post<TokenResponse>('/users/verify-code', { email, code }, 'Não conseguimos conferir o código agora. Tente de novo em instantes.'),
  confirm: async (token: string) => {
    const res = await fetch(`${API_URL}/users/confirm?token=${encodeURIComponent(token)}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Token inválido')
    }
    return res.json()
  },
}

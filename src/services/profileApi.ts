import type { CandidateProfile, FieldError, ProfileResponse } from '../types/candidate'
import { emptyProfile } from '../types/candidate'

const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

export class FieldRequestError extends Error {
  field?: string
  constructor(message: string, field?: string) {
    super(message)
    this.field = field
  }
}

async function errorFrom(res: Response, fallback: string): Promise<FieldRequestError> {
  const body = (await res.json().catch(() => ({}))) as { error?: string; field?: string }
  return new FieldRequestError(body.error || fallback, body.field)
}

export class ProfileValidationError extends Error {
  fields: FieldError[]
  constructor(fields: FieldError[]) {
    super('Alguns campos precisam de atenção.')
    this.fields = fields
  }
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Sua sessão expirou. Entre novamente para continuar.')
  return { Authorization: `Bearer ${token}` }
}

function withDefaults(profile: Partial<CandidateProfile> | undefined): CandidateProfile {
  const base = emptyProfile()
  return {
    ...base,
    ...profile,
    experiences: profile?.experiences ?? [],
    education: profile?.education ?? [],
    skills: profile?.skills ?? [],
    preferences: { ...base.preferences, ...profile?.preferences, locations: profile?.preferences?.locations ?? [] }
  }
}

export const profileApi = {
  async getMine(): Promise<ProfileResponse> {
    const res = await fetch(`${API_URL}/profiles/me`, { headers: authHeaders() })
    if (!res.ok) throw new Error('Não conseguimos carregar seu perfil. Tente novamente em instantes.')
    const data = (await res.json()) as ProfileResponse
    return { ...data, profile: withDefaults(data.profile), missing: data.missing ?? [] }
  },

  async saveMine(profile: CandidateProfile): Promise<ProfileResponse> {
    const res = await fetch(`${API_URL}/profiles/me`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
    if (res.status === 422) {
      const body = (await res.json().catch(() => ({}))) as { fields?: FieldError[] }
      throw new ProfileValidationError(body.fields ?? [])
    }
    if (!res.ok) throw new Error('Não conseguimos salvar agora. Seus dados continuam na tela; tente novamente.')
    const data = (await res.json()) as ProfileResponse
    return { ...data, profile: withDefaults(data.profile) }
  },

  withDefaults,

  /**
   * Upload direto para o S3 privado: 1) a API gera a URL assinada de PUT,
   * 2) o navegador envia a foto, 3) a API confere e registra só a chave.
   */
  async uploadPhoto(photo: Blob): Promise<{ photo_url: string; photo_version: number }> {
    const presign = await fetch(`${API_URL}/profiles/me/photo/upload-url`, { method: 'POST', headers: authHeaders() })
    if (!presign.ok) throw await errorFrom(presign, 'Não conseguimos preparar o envio da foto. Tente novamente.')
    const { upload_url, key, content_type } = (await presign.json()) as { upload_url: string; key: string; content_type: string }

    const put = await fetch(upload_url, { method: 'PUT', headers: { 'Content-Type': content_type }, body: photo })
    if (!put.ok) throw new FieldRequestError('O envio da foto falhou. Verifique sua internet e tente novamente.')

    const confirm = await fetch(`${API_URL}/profiles/me/photo`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    })
    if (!confirm.ok) throw await errorFrom(confirm, 'Não conseguimos salvar a foto. Tente novamente.')
    return (await confirm.json()) as { photo_url: string; photo_version: number }
  },

  async deletePhoto(): Promise<void> {
    const res = await fetch(`${API_URL}/profiles/me/photo`, { method: 'DELETE', headers: authHeaders() })
    if (!res.ok) throw await errorFrom(res, 'Não conseguimos remover a foto. Tente novamente.')
  },

  /** Sends a 6-digit code to the account e-mail (reuses the passwordless login endpoint). */
  async requestCode(email: string): Promise<void> {
    const res = await fetch(`${API_URL}/users/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!res.ok) throw await errorFrom(res, 'Não conseguimos enviar o código. Tente novamente em instantes.')
  },

  async changePassword(input: { current_password?: string; code?: string; new_password: string }): Promise<void> {
    const res = await fetch(`${API_URL}/users/me/password`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    })
    if (!res.ok) throw await errorFrom(res, 'Não conseguimos trocar a senha. Tente novamente.')
  }
}

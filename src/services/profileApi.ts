import type { CandidateProfile, FieldError, ProfileResponse } from '../types/candidate'
import { emptyProfile } from '../types/candidate'

const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

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

  withDefaults
}

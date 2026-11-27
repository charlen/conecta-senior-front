import type { MatchMeResponse } from '../types/job'

const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Sua sessão expirou. Entre novamente para continuar.')
  return { Authorization: `Bearer ${token}` }
}

export class ApplyError extends Error {
  /** true when the profile must be completed before applying (HTTP 422) */
  incompleteProfile: boolean
  constructor(message: string, incompleteProfile = false) {
    super(message)
    this.incompleteProfile = incompleteProfile
  }
}

async function applyRequest(jobId: string, method: 'POST' | 'DELETE'): Promise<void> {
  const res = await fetch(`${API_URL}/jobs/${jobId}/apply`, { method, headers: authHeaders() })
  if (res.ok) return
  const body = (await res.json().catch(() => ({}))) as { error?: string }
  throw new ApplyError(
    body.error || (method === 'POST' ? 'Não conseguimos enviar sua candidatura. Tente novamente.' : 'Não conseguimos cancelar sua candidatura. Tente novamente.'),
    res.status === 422
  )
}

export const jobsApi = {
  /** Open jobs ranked by compatibility with the logged-in candidate profile. */
  async matchMine(): Promise<MatchMeResponse> {
    const res = await fetch(`${API_URL}/match/me`, { headers: authHeaders() })
    if (!res.ok) throw new Error('Não conseguimos carregar as vagas agora. Tente novamente em instantes.')
    const data = (await res.json()) as Partial<MatchMeResponse>
    return {
      matching_available: data.matching_available ?? false,
      jobs: (data.jobs ?? []).map(j => ({ ...j, applied: Boolean(j.applied) }))
    }
  },

  apply: (jobId: string) => applyRequest(jobId, 'POST'),
  withdraw: (jobId: string) => applyRequest(jobId, 'DELETE')
}

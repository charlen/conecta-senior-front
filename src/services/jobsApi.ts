import type { MatchMeResponse } from '../types/job'

const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Sua sessão expirou. Entre novamente para continuar.')
  return { Authorization: `Bearer ${token}` }
}

export const jobsApi = {
  /** Open jobs ranked by compatibility with the logged-in candidate profile. */
  async matchMine(): Promise<MatchMeResponse> {
    const res = await fetch(`${API_URL}/match/me`, { headers: authHeaders() })
    if (!res.ok) throw new Error('Não conseguimos carregar as vagas agora. Tente novamente em instantes.')
    const data = (await res.json()) as Partial<MatchMeResponse>
    return { matching_available: data.matching_available ?? false, jobs: data.jobs ?? [] }
  }
}

import type { JobCandidate, JobCandidatesResponse } from '../types/jobCandidates'

const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

export class CandidatesRequestError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  if (!token) throw new CandidatesRequestError('Sua sessão expirou. Entre novamente para continuar.', 401)
  return { Authorization: `Bearer ${token}` }
}

function messageFor(status: number): string {
  if (status === 401) return 'Sua sessão expirou. Entre novamente para continuar.'
  if (status === 403) return 'Só a empresa que publicou esta vaga pode ver os candidatos.'
  if (status === 404) return 'Não encontramos esta vaga. Ela pode ter sido removida.'
  return 'Não conseguimos carregar os candidatos agora. Tente novamente em instantes.'
}

function normalizeCandidate(c: Partial<JobCandidate>): JobCandidate {
  return {
    profile_id: c.profile_id ?? '',
    full_name: c.full_name ?? '',
    headline: c.headline ?? '',
    city: c.city ?? '',
    state: c.state ?? '',
    summary: c.summary ?? '',
    skills: c.skills ?? [],
    experiences: c.experiences ?? [],
    email: c.email ?? '',
    phone: c.phone ?? '',
    photo_url: c.photo_url ?? '',
    percent: c.percent ?? 0,
    score: c.score ?? 0,
    applied: Boolean(c.applied),
    applied_at: c.applied_at
  }
}

export const companyJobsApi = {
  /** Candidates of a job ordered by compatibility (only for the company that owns the job). */
  async listCandidates(jobId: string, opts: { minPercent?: number } = {}): Promise<JobCandidatesResponse> {
    const params = new URLSearchParams()
    if (opts.minPercent) params.set('min_percent', String(opts.minPercent))
    const qs = params.toString() ? `?${params}` : ''
    const res = await fetch(`${API_URL}/jobs/${encodeURIComponent(jobId)}/candidates${qs}`, { headers: authHeaders() })
    if (!res.ok) throw new CandidatesRequestError(messageFor(res.status), res.status)
    const data = (await res.json()) as Partial<JobCandidatesResponse>
    const candidates = (data.candidates ?? []).map(normalizeCandidate)
    return {
      job: { id: jobId, title: '', location: '', modality: '', status: '', ...data.job },
      vector_ready: data.vector_ready ?? true,
      total: data.total ?? candidates.length,
      applicants_total: data.applicants_total ?? candidates.filter(c => c.applied).length,
      candidates
    }
  }
}

import type { JobCandidate, JobCandidatesResponse } from '../types/jobCandidates'
import type { Company, CompanyInput, CompanyJob, FieldError, JobInput } from '../types/companyJob'

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

/** Error of the company/job endpoints, with the API error code and 422 field errors. */
export class CompanyApiError extends Error {
  status: number
  code: string
  fields: FieldError[]
  constructor(message: string, status: number, code = '', fields: FieldError[] = []) {
    super(message)
    this.status = status
    this.code = code
    this.fields = fields
  }
}

type ErrorBody = { error?: string; fields?: FieldError[] }

async function request<T>(path: string, init: RequestInit, fallback: string): Promise<T> {
  const headers: Record<string, string> = { ...authHeaders() }
  if (init.body) headers['Content-Type'] = 'application/json'
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers })
  } catch {
    throw new CompanyApiError('Sem conexão com o servidor. Verifique sua internet e tente novamente.', 0)
  }
  if (res.ok) return (await res.json()) as T
  const body = (await res.json().catch(() => ({}))) as ErrorBody
  const code = body.error ?? ''
  let message = fallback
  if (res.status === 401) message = 'Sua sessão expirou. Entre novamente para continuar.'
  else if (res.status === 403) message = 'Esta vaga pertence a outra empresa.'
  else if (res.status === 404 && path.startsWith('/jobs/')) message = 'Não encontramos esta vaga. Ela pode ter sido removida.'
  else if (res.status === 409 && code === 'company_required') message = 'Cadastre os dados da empresa antes de publicar vagas.'
  else if (res.status === 422) message = 'Alguns campos precisam de ajuste.'
  throw new CompanyApiError(message, res.status, code, body.fields ?? [])
}

function normalizeJob(j: Partial<CompanyJob>): CompanyJob {
  return {
    id: j.id ?? '',
    title: j.title ?? '',
    description: j.description ?? '',
    location: j.location ?? '',
    modality: j.modality ?? '',
    job_type: j.job_type ?? '',
    skills: j.skills ?? [],
    salary_min: j.salary_min ?? null,
    salary_max: j.salary_max ?? null,
    salary_negotiable: Boolean(j.salary_negotiable),
    status: j.status ?? 'open',
    created_at: j.created_at ?? '',
    updated_at: j.updated_at ?? '',
    applicants_count: j.applicants_count ?? 0,
    vector_ready: j.vector_ready ?? true
  }
}

export const companyJobsApi = {
  /** Company of the logged-in recruiter, or null when not registered yet (404). */
  async getCompany(): Promise<Company | null> {
    try {
      return await request<Company>('/companies/me', { method: 'GET' }, 'Não conseguimos carregar os dados da empresa.')
    } catch (err) {
      if (err instanceof CompanyApiError && err.status === 404) return null
      throw err
    }
  },

  /** Creates or updates the recruiter's company (422 carries `fields`). */
  saveCompany(input: CompanyInput): Promise<Company> {
    return request<Company>('/companies/me', { method: 'PUT', body: JSON.stringify(input) }, 'Não conseguimos salvar os dados da empresa. Tente novamente.')
  },

  /** Jobs of the recruiter's company, most recent first. */
  async listMyJobs(): Promise<CompanyJob[]> {
    const data = await request<{ jobs?: Partial<CompanyJob>[] }>('/companies/me/jobs', { method: 'GET' }, 'Não conseguimos carregar suas vagas agora.')
    return (data.jobs ?? []).map(normalizeJob)
  },

  async getJob(id: string): Promise<{ job: CompanyJob; owned: boolean }> {
    const data = await request<{ job?: Partial<CompanyJob>; owned?: boolean }>(
      `/jobs/${encodeURIComponent(id)}`,
      { method: 'GET' },
      'Não conseguimos carregar esta vaga.'
    )
    return { job: normalizeJob({ id, ...data.job }), owned: Boolean(data.owned) }
  },

  /** 409 `company_required` when the recruiter has no company yet. */
  createJob(input: JobInput): Promise<{ id: string }> {
    return request<{ id: string }>('/jobs', { method: 'POST', body: JSON.stringify(input) }, 'Não conseguimos publicar a vaga. Tente novamente.')
  },

  updateJob(id: string, input: JobInput): Promise<{ id: string }> {
    return request<{ id: string }>(
      `/jobs/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(input) },
      'Não conseguimos salvar a vaga. Tente novamente.'
    )
  },

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

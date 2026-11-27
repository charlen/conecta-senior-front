/** Company side of jobs: mirrors `/companies/me`, `/companies/me/jobs` and `/jobs` in the backend. */

export type JobModality = 'presencial' | 'remoto' | 'hibrido'
export type JobType = '' | 'clt' | 'pj' | 'temporario' | 'voluntario'
export type JobStatus = 'open' | 'freeze' | 'close'

/** `GET/PUT /companies/me` */
export type Company = {
  id: string
  company_name: string
  cnpj: string
  website: string
}

export type CompanyInput = Pick<Company, 'company_name' | 'cnpj' | 'website'>

/** Body of `POST /jobs` and `PUT /jobs/:id` */
export type JobInput = {
  title: string
  description: string
  location: string
  modality: JobModality | ''
  job_type: JobType
  skills: string[]
  salary_min: number | null
  salary_max: number | null
  salary_negotiable: boolean
  status: JobStatus
}

/** Item of `GET /companies/me/jobs` (also the `job` of `GET /jobs/:id`) */
export type CompanyJob = Omit<JobInput, 'modality' | 'job_type'> & {
  id: string
  /** Enum value; legacy rows may carry free text such as "Remoto" */
  modality: string
  job_type: string
  created_at: string
  updated_at: string
  applicants_count: number
  /** false while the job is still being embedded for compatibility */
  vector_ready: boolean
}

/** 422 payload item: `{"field","message"}` */
export type FieldError = { field: string; message: string }

/** Field keys of the job form (same names as the API body) */
export type JobField = keyof JobInput
export type CompanyField = keyof CompanyInput

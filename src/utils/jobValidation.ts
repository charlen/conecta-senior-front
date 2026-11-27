import type { CompanyField, CompanyInput, CompanyJob, FieldError, JobField, JobInput, JobStatus, JobType } from '../types/companyJob'
import { isJobStatus, toJobType, toModality } from './jobLabels'
import { formatBRLInput, parseBRL } from './money'

/** Limits shared with the backend contract */
export const JOB_LIMITS = {
  titleMin: 3,
  titleMax: 120,
  descriptionMin: 30,
  skillsMax: 20,
  skillMax: 40
} as const

/** Order used to focus the first invalid field */
export const JOB_FIELD_ORDER: JobField[] = [
  'title',
  'modality',
  'job_type',
  'location',
  'description',
  'skills',
  'salary_min',
  'salary_max',
  'salary_negotiable',
  'status'
]

/** Editable state of the job form (salaries as masked strings) */
export type JobFormValues = {
  title: string
  description: string
  location: string
  modality: string
  job_type: JobType
  skills: string[]
  salaryMin: string
  salaryMax: string
  salaryNegotiable: boolean
  status: JobStatus
}

export type JobErrors = Partial<Record<JobField, string>>
export type CompanyErrors = Partial<Record<CompanyField, string>>

export const EMPTY_JOB_FORM: JobFormValues = {
  title: '',
  description: '',
  location: '',
  modality: '',
  job_type: '',
  skills: [],
  salaryMin: '',
  salaryMax: '',
  salaryNegotiable: false,
  status: 'open'
}

/** API job → form state (tolerates legacy free-text modality/type). */
export function jobToForm(job: Partial<CompanyJob>): JobFormValues {
  return {
    title: job.title ?? '',
    description: job.description ?? '',
    location: job.location ?? '',
    modality: toModality(job.modality) ?? '',
    job_type: toJobType(job.job_type),
    skills: job.skills ?? [],
    salaryMin: formatBRLInput(job.salary_min),
    salaryMax: formatBRLInput(job.salary_max),
    salaryNegotiable: Boolean(job.salary_negotiable),
    status: job.status && isJobStatus(job.status) ? job.status : 'open'
  }
}

/** Form state → API body. "A combinar" clears both amounts. */
export function formToJobInput(v: JobFormValues): JobInput {
  return {
    title: v.title.trim(),
    description: v.description.trim(),
    location: v.location.trim(),
    modality: toModality(v.modality) ?? '',
    job_type: v.job_type,
    skills: v.skills,
    salary_min: v.salaryNegotiable ? null : parseBRL(v.salaryMin),
    salary_max: v.salaryNegotiable ? null : parseBRL(v.salaryMax),
    salary_negotiable: v.salaryNegotiable,
    status: v.status
  }
}

/** Client validation mirroring the backend rules. */
export function validateJob(v: JobFormValues): JobErrors {
  const errors: JobErrors = {}
  const title = v.title.trim()
  if (!title) errors.title = 'Informe o título da vaga.'
  else if (title.length < JOB_LIMITS.titleMin) errors.title = `O título precisa ter pelo menos ${JOB_LIMITS.titleMin} caracteres.`
  else if (title.length > JOB_LIMITS.titleMax) errors.title = `O título pode ter até ${JOB_LIMITS.titleMax} caracteres.`

  if (!toModality(v.modality)) errors.modality = 'Escolha a modalidade de trabalho.'

  const description = v.description.trim()
  if (description.length < JOB_LIMITS.descriptionMin) {
    const missing = JOB_LIMITS.descriptionMin - description.length
    errors.description = description
      ? `Descreva um pouco mais: faltam ${missing} caracteres (mínimo ${JOB_LIMITS.descriptionMin}).`
      : 'Descreva a vaga: atividades, requisitos e benefícios.'
  }

  if (v.skills.length > JOB_LIMITS.skillsMax) errors.skills = `Use no máximo ${JOB_LIMITS.skillsMax} habilidades.`
  else if (v.skills.some(s => s.length > JOB_LIMITS.skillMax)) errors.skills = `Cada habilidade pode ter até ${JOB_LIMITS.skillMax} caracteres.`

  if (!v.salaryNegotiable) {
    const min = parseBRL(v.salaryMin)
    const max = parseBRL(v.salaryMax)
    if (min != null && max != null && min > max) errors.salary_max = 'O máximo precisa ser maior ou igual ao mínimo.'
  }

  if (!isJobStatus(v.status)) errors.status = 'Escolha o status da vaga.'
  return errors
}

/**
 * Normalizes a skill typed by the user. Returns the cleaned value or an error message.
 * Duplicates (case/accent-insensitive) are rejected.
 */
export function checkSkill(raw: string, current: string[]): { value: string } | { error: string } {
  const value = raw.trim().replace(/\s+/g, ' ')
  if (!value) return { error: '' }
  if (value.length > JOB_LIMITS.skillMax) return { error: `Cada habilidade pode ter até ${JOB_LIMITS.skillMax} caracteres.` }
  if (current.length >= JOB_LIMITS.skillsMax) return { error: `Use no máximo ${JOB_LIMITS.skillsMax} habilidades.` }
  const key = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  if (current.some(s => key(s) === key(value))) return { error: `"${value}" já está na lista.` }
  return { value }
}

/** First field (in screen order) that has an error. */
export function firstErrorField<T extends string>(errors: Partial<Record<T, string>>, order: readonly T[]): T | null {
  return order.find(f => errors[f]) ?? null
}

/** Maps a 422 `fields` array onto known keys; unknown fields are ignored. */
export function serverFieldErrors<T extends string>(fields: FieldError[], known: readonly T[]): Partial<Record<T, string>> {
  const out: Partial<Record<T, string>> = {}
  for (const f of fields) {
    const key = f.field as T
    if (known.includes(key) && !out[key]) out[key] = f.message
  }
  return out
}

/** Only digits of a CNPJ */
export const cnpjDigits = (value: string) => value.replace(/\D/g, '').slice(0, 14)

/** 00.000.000/0000-00 as the user types */
export function maskCNPJ(value: string): string {
  const d = cnpjDigits(value)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export const COMPANY_FIELD_ORDER: CompanyField[] = ['company_name', 'cnpj', 'website']

export function validateCompany(v: CompanyInput): CompanyErrors {
  const errors: CompanyErrors = {}
  const name = v.company_name.trim()
  if (!name) errors.company_name = 'Informe o nome da empresa.'
  else if (name.length < 2) errors.company_name = 'O nome precisa ter pelo menos 2 caracteres.'
  const cnpj = cnpjDigits(v.cnpj)
  if (cnpj && cnpj.length !== 14) errors.cnpj = 'O CNPJ tem 14 números. Confira ou deixe em branco.'
  const site = v.website.trim()
  if (site && !/^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i.test(site)) errors.website = 'Informe um endereço como www.suaempresa.com.br'
  return errors
}

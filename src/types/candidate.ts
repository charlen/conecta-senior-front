// Canonical candidate profile, mirrors backend internal/domain/candidate.Profile

export type Modality = '' | 'presencial' | 'remoto' | 'hibrido'
export type JobType = '' | 'clt' | 'pj' | 'temporario' | 'voluntario'

export type CandidateExperience = {
  role: string
  company: string
  start: string
  end: string
  current: boolean
  description: string
}

export type CandidateEducation = {
  course: string
  institution: string
  end_year: string
}

export type CandidatePreferences = {
  modality: Modality
  job_type: JobType
  availability: string
  locations: string[]
}

export type CandidateProfile = {
  full_name: string
  phone: string
  city: string
  state: string
  headline: string
  experiences: CandidateExperience[]
  email: string
  birth_year?: number
  summary: string
  linkedin: string
  skills: string[]
  education: CandidateEducation[]
  preferences: CandidatePreferences
}

export type FieldError = {
  field: string
  message: string
}

export type ProfileResponse = {
  id: string
  user_id: string
  /** 0 when there is no photo; changes whenever the photo changes */
  photo_version: number
  complete: boolean
  missing: FieldError[]
  profile: CandidateProfile
}

export const emptyExperience = (): CandidateExperience => ({
  role: '', company: '', start: '', end: '', current: false, description: ''
})

export const emptyEducation = (): CandidateEducation => ({ course: '', institution: '', end_year: '' })

export const emptyProfile = (): CandidateProfile => ({
  full_name: '', phone: '', city: '', state: '', headline: '', experiences: [], email: '',
  summary: '', linkedin: '', skills: [], education: [],
  preferences: { modality: '', job_type: '', availability: '', locations: [] }
})

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const

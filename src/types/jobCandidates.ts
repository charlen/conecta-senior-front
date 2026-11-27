/** Mirrors GET /jobs/:id/candidates (company side). */
export type JobCandidateExperience = {
  role: string
  company: string
  start: string
  end: string
  current: boolean
  /** Pre-formatted by the API, e.g. "1990 – 2020" or "2015 – atual" */
  period: string
}

export type JobCandidate = {
  profile_id: string
  full_name: string
  headline: string
  city: string
  state: string
  summary: string
  skills: string[]
  experiences: JobCandidateExperience[]
  email: string
  phone: string
  /** Short-lived presigned URL (empty when there is no photo) */
  photo_url: string
  /** Compatibility 0–100 */
  percent: number
  score: number
}

export type JobCandidatesJob = {
  id: string
  title: string
  location: string
  modality: string
  status: string
}

export type JobCandidatesResponse = {
  job: JobCandidatesJob
  /** false while the job still has no embedding (no ranking possible yet) */
  vector_ready: boolean
  total: number
  candidates: JobCandidate[]
}

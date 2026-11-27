/** Job card returned by `GET /match/me` (mirrors handlers.MatchedJob in the backend). */
export type MatchedJob = {
  id: string
  title: string
  description: string
  /** Company name */
  company: string
  location: string
  modality: string
  salary_min: number | null
  salary_max: number | null
  status: string
  /** Compatibility 0–100; null when matching is unavailable or the job has no vector yet */
  percent: number | null
}

export type MatchMeResponse = {
  /** false when the candidate profile has no embedding yet (incomplete profile) */
  matching_available: boolean
  /** Open jobs, most compatible first when matching is available */
  jobs: MatchedJob[]
}

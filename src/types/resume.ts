export interface Experience {
  company: string;
  period?: string;
  role?: string;
  highlights?: string[];
}

export interface Education {
  institution: string;
  degree?: string;
  period?: string;
}

export interface ParsedResume {
  name: string;
  email?: string;
  linkedin?: string;
  location?: string;
  title?: string;
  summary?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
}

export interface ResumeAnalysis {
  profile_summary?: string;
  what_does?: string;
  core_competencies?: string[];
  key_strengths?: string[];
  highlights_for_recruiter?: string[];
  ideal_roles?: string[];
  value_proposition?: string;
  ego_boost?: string;
}

export interface ResumeResponse {
  id?: string;
  parsed: ParsedResume;
  resume: ResumeAnalysis;
  /** Canonical profile draft (see types/candidate.ts), merged with the saved profile */
  profile_draft?: import('./candidate').CandidateProfile;
}

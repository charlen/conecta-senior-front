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
  what_he_does?: string;
  core_competencies?: string[];
  key_strengths?: string[];
  highlights_for_recruiter?: string[];
  ideal_roles?: string[];
  value_proposition?: string;
  ego_boost?: string;
}

export interface ResumeResponse {
  parsed: ParsedResume;
  resume: ResumeAnalysis;
}

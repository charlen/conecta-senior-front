import type { CandidateProfile, FieldError } from '../types/candidate'

/** Client mirror of backend candidate.Missing(): required fields still empty. */
export function missingRequired(p: CandidateProfile): FieldError[] {
  const out: FieldError[] = []
  const add = (field: string, message: string) => out.push({ field, message })
  if (!p.full_name.trim()) add('full_name', 'Falta seu nome completo.')
  if (!p.phone.trim()) add('phone', 'Falta um telefone com DDD.')
  if (!p.city.trim()) add('city', 'Falta a cidade onde você mora.')
  if (!p.state.trim()) add('state', 'Falta o estado (UF).')
  if (!p.headline.trim()) add('headline', 'Falta sua área ou profissão.')
  if (p.experiences.length === 0) add('experiences', 'Falta pelo menos uma experiência de trabalho.')
  return out
}

export type SectionKey = 'personal' | 'profession' | 'experiences' | 'education' | 'skills' | 'preferences'

const fieldSection: Record<string, SectionKey> = {
  full_name: 'personal', phone: 'personal', city: 'personal', state: 'personal', birth_year: 'personal',
  headline: 'profession', summary: 'profession', linkedin: 'profession',
  experiences: 'experiences', 'preferences.modality': 'preferences', 'preferences.job_type': 'preferences'
}

export function sectionOf(field: string): SectionKey | undefined {
  if (field.startsWith('experiences.')) return 'experiences'
  return fieldSection[field]
}

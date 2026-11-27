import type { Perfil } from '../types/perfil'
import type { CandidateProfile, Modality } from '../types/candidate'
import { emptyProfile } from '../types/candidate'

function toModality(value?: string): Modality {
  const v = (value ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  if (v.includes('remot')) return 'remoto'
  if (v.includes('hibrid')) return 'hibrido'
  if (v.includes('presencial')) return 'presencial'
  return ''
}

/** Maps the manual wizard draft (localStorage) into the canonical profile. */
export function fromWizardDraft(perfil: Perfil): CandidateProfile {
  const base = emptyProfile()
  return {
    ...base,
    full_name: perfil.dadosBasicos.nomeCompleto ?? '',
    phone: perfil.dadosBasicos.telefone ?? '',
    city: perfil.dadosBasicos.cidade ?? '',
    state: (perfil.dadosBasicos.estado ?? '').toUpperCase(),
    birth_year: perfil.dadosBasicos.anoNascimento,
    headline: perfil.experiencias[0]?.cargo ?? '',
    summary: perfil.sobreMim ?? '',
    experiences: perfil.experiencias.map(e => ({
      role: e.cargo ?? '',
      company: e.empresa ?? '',
      start: e.inicio ?? '',
      end: e.fim ?? '',
      current: !e.fim,
      description: e.descricao ?? ''
    })),
    education: perfil.formacao.map(f => ({
      course: f.curso ?? '',
      institution: f.instituicao ?? '',
      end_year: f.anoConclusao ?? ''
    })),
    skills: perfil.habilidades ?? [],
    preferences: {
      ...base.preferences,
      modality: toModality(perfil.preferencias.modalidade),
      availability: perfil.preferencias.disponibilidade ?? '',
      locations: perfil.preferencias.localidade ? [perfil.preferencias.localidade] : []
    }
  }
}

/** True when the wizard draft has anything worth importing. */
export function wizardHasData(perfil: Perfil): boolean {
  return Boolean(
    perfil.dadosBasicos.nomeCompleto || perfil.dadosBasicos.telefone || perfil.experiencias.length
  )
}

/** localStorage key for the canonical draft returned by the PDF upload. */
export const PROFILE_DRAFT_KEY = 'cs_profile_draft'

/**
 * Client mirror of backend candidate.MergeDraft: what is already saved wins;
 * empty fields and empty lists are filled from the draft.
 */
export function mergeDraft(saved: CandidateProfile, draft: CandidateProfile): CandidateProfile {
  const pick = (a: string, b: string) => (a.trim() ? a : b)
  const skills = [...saved.skills]
  for (const s of draft.skills) if (!skills.some(x => x.toLowerCase() === s.toLowerCase())) skills.push(s)
  return {
    ...saved,
    full_name: pick(saved.full_name, draft.full_name),
    phone: pick(saved.phone, draft.phone),
    city: pick(saved.city, draft.city),
    state: pick(saved.state, draft.state),
    headline: pick(saved.headline, draft.headline),
    summary: pick(saved.summary, draft.summary),
    linkedin: pick(saved.linkedin, draft.linkedin),
    birth_year: saved.birth_year ?? draft.birth_year,
    experiences: saved.experiences.length ? saved.experiences : draft.experiences,
    education: saved.education.length ? saved.education : draft.education,
    skills,
    preferences: {
      ...saved.preferences,
      modality: saved.preferences.modality || draft.preferences.modality,
      availability: pick(saved.preferences.availability, draft.preferences.availability),
      locations: saved.preferences.locations.length ? saved.preferences.locations : draft.preferences.locations
    }
  }
}

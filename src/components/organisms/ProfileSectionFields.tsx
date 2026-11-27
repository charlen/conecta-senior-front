import { useState } from 'react'
import type { CandidateEducation, CandidateExperience, CandidateProfile, FieldError, JobType, Modality } from '../../types/candidate'
import { UFS } from '../../types/candidate'
import { ProfileField, inputClass } from '../molecules/ProfileField'
import { Button } from '../atoms/Button'
import { ConfirmModal } from '../molecules/ConfirmModal'
import { Dropdown } from '../molecules/Dropdown'

type SectionProps = {
  value: CandidateProfile
  onChange: (next: CandidateProfile) => void
  errors?: FieldError[]
}

const err = (errors: FieldError[] | undefined, field: string) => errors?.find(e => e.field === field)?.message

export function PersonalFields({ value, onChange, errors }: SectionProps) {
  const set = <K extends keyof CandidateProfile>(k: K, v: CandidateProfile[K]) => onChange({ ...value, [k]: v })
  return (
    <div className="space-y-6">
      <ProfileField id="full_name" label="Nome completo" required error={err(errors, 'full_name')}>
        {a => <input {...a} className={inputClass(err(errors, 'full_name'))} autoComplete="name" value={value.full_name} onChange={e => set('full_name', e.target.value)} />}
      </ProfileField>
      <ProfileField id="phone" label="Telefone com DDD" required hint="Exemplo: (11) 98765-4321" error={err(errors, 'phone')}>
        {a => <input {...a} type="tel" inputMode="tel" autoComplete="tel" className={inputClass(err(errors, 'phone'))} value={value.phone} onChange={e => set('phone', e.target.value)} />}
      </ProfileField>
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <ProfileField id="city" label="Cidade" required error={err(errors, 'city')}>
          {a => <input {...a} autoComplete="address-level2" className={inputClass(err(errors, 'city'))} value={value.city} onChange={e => set('city', e.target.value)} />}
        </ProfileField>
        <ProfileField id="state" label="Estado" required error={err(errors, 'state')}>
          {a => (
            <Dropdown {...a} placeholder="Escolha" value={value.state} onChange={v => set('state', v)}
              options={UFS.map(uf => ({ value: uf, label: uf }))} />
          )}
        </ProfileField>
      </div>
      <ProfileField id="birth_year" label="Ano de nascimento" error={err(errors, 'birth_year')}>
        {a => (
          <input {...a} type="number" inputMode="numeric" min={1920} max={2010} className={inputClass(err(errors, 'birth_year'))}
            value={value.birth_year ?? ''} onChange={e => set('birth_year', e.target.value ? Number(e.target.value) : undefined)} />
        )}
      </ProfileField>
    </div>
  )
}

export function ProfessionFields({ value, onChange, errors }: SectionProps) {
  const set = <K extends keyof CandidateProfile>(k: K, v: CandidateProfile[K]) => onChange({ ...value, [k]: v })
  return (
    <div className="space-y-6">
      <ProfileField id="headline" label="Área ou profissão" required hint='Em poucas palavras. Exemplo: "Contadora" ou "Professor de Matemática".' error={err(errors, 'headline')}>
        {a => <input {...a} className={inputClass(err(errors, 'headline'))} value={value.headline} onChange={e => set('headline', e.target.value)} />}
      </ProfileField>
      <ProfileField id="summary" label="Sobre você" hint="Conte sua trajetória do seu jeito. As empresas leem este texto.">
        {a => <textarea {...a} className={`${inputClass()} min-h-[180px]`} value={value.summary} onChange={e => set('summary', e.target.value)} />}
      </ProfileField>
      <ProfileField id="linkedin" label="LinkedIn">
        {a => <input {...a} type="url" inputMode="url" placeholder="https://linkedin.com/in/..." className={inputClass()} value={value.linkedin} onChange={e => set('linkedin', e.target.value)} />}
      </ProfileField>
    </div>
  )
}

type ItemProps<T> = { value: T; onChange: (next: T) => void; errors?: FieldError[]; index: number }

export function ExperienceFields({ value: exp, onChange, errors, index }: ItemProps<CandidateExperience>) {
  const set = (patch: Partial<CandidateExperience>) => onChange({ ...exp, ...patch })
  const roleError = err(errors, `experiences.${index}.role`)
  return (
    <div className="space-y-6">
      <ProfileField id="exp-role" label="Cargo ou função" required error={roleError}>
        {a => <input {...a} className={inputClass(roleError)} value={exp.role} onChange={e => set({ role: e.target.value })} />}
      </ProfileField>
      <ProfileField id="exp-company" label="Empresa ou lugar">
        {a => <input {...a} className={inputClass()} value={exp.company} onChange={e => set({ company: e.target.value })} />}
      </ProfileField>
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileField id="exp-start" label="Início" hint="Ano ou mês/ano">
          {a => <input {...a} className={inputClass()} placeholder="1998" value={exp.start} onChange={e => set({ start: e.target.value })} />}
        </ProfileField>
        {!exp.current && (
          <ProfileField id="exp-end" label="Fim" hint="Ano ou mês/ano">
            {a => <input {...a} className={inputClass()} placeholder="2015" value={exp.end} onChange={e => set({ end: e.target.value })} />}
          </ProfileField>
        )}
      </div>
      <label className="flex items-center gap-4 text-xl min-h-[48px] cursor-pointer">
        <input type="checkbox" className="h-7 w-7 accent-primary" checked={exp.current}
          onChange={e => set({ current: e.target.checked, end: e.target.checked ? '' : exp.end })} />
        Trabalho aqui atualmente
      </label>
      <ProfileField id="exp-desc" label="O que você fazia">
        {a => <textarea {...a} className={`${inputClass()} min-h-[160px]`} value={exp.description} onChange={e => set({ description: e.target.value })} />}
      </ProfileField>
    </div>
  )
}

export function EducationFields({ value: edu, onChange }: ItemProps<CandidateEducation>) {
  const set = (patch: Partial<CandidateEducation>) => onChange({ ...edu, ...patch })
  return (
    <div className="space-y-6">
      <ProfileField id="edu-course" label="Curso">
        {a => <input {...a} className={inputClass()} value={edu.course} onChange={e => set({ course: e.target.value })} />}
      </ProfileField>
      <ProfileField id="edu-inst" label="Escola ou instituição">
        {a => <input {...a} className={inputClass()} value={edu.institution} onChange={e => set({ institution: e.target.value })} />}
      </ProfileField>
      <ProfileField id="edu-year" label="Ano de conclusão">
        {a => <input {...a} inputMode="numeric" className={inputClass()} value={edu.end_year} onChange={e => set({ end_year: e.target.value })} />}
      </ProfileField>
    </div>
  )
}

export function SkillsFields({ value, onChange }: SectionProps) {
  const [newSkill, setNewSkill] = useState('')
  const [toRemove, setToRemove] = useState<string | null>(null)
  const add = () => {
    const s = newSkill.trim()
    if (s && !value.skills.some(x => x.toLowerCase() === s.toLowerCase())) onChange({ ...value, skills: [...value.skills, s] })
    setNewSkill('')
  }
  return (
    <div className="space-y-6">
      <p className="text-xl text-slate-700">Digite uma habilidade e toque em Adicionar. Para tirar, toque no × ao lado dela.</p>
      <ul className="flex flex-wrap gap-3" aria-label="Habilidades adicionadas">
        {value.skills.map(skill => (
          <li key={skill} className="flex items-center gap-2 rounded-full bg-slate-100 pl-5 pr-2 text-xl">
            {skill}
            <button type="button" aria-label={`Tirar ${skill}`} onClick={() => setToRemove(skill)}
              className="h-12 w-12 rounded-full text-2xl hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/30 cursor-pointer">
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3 md:flex-row">
        <label htmlFor="new-skill" className="sr-only">Nova habilidade</label>
        <input id="new-skill" className={inputClass()} placeholder="Ex.: Atendimento ao cliente" value={newSkill}
          onChange={e => setNewSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
        <Button type="button" variant="secondary" onClick={add}>Adicionar</Button>
      </div>
      <ConfirmModal
        open={toRemove !== null}
        tone="danger"
        title="Tirar esta habilidade?"
        message={`"${toRemove ?? ''}" sairá da lista.`}
        confirmLabel="Sim, tirar"
        cancelLabel="Não, manter"
        onConfirm={() => { onChange({ ...value, skills: value.skills.filter(s => s !== toRemove) }); setToRemove(null) }}
        onCancel={() => setToRemove(null)}
      />
    </div>
  )
}

export function PreferencesFields({ value, onChange, errors }: SectionProps) {
  const setPref = (patch: Partial<CandidateProfile['preferences']>) => onChange({ ...value, preferences: { ...value.preferences, ...patch } })
  return (
    <div className="space-y-6">
      <ProfileField id="modality" label="Modalidade" error={err(errors, 'preferences.modality')}>
        {a => (
          <Dropdown {...a} value={value.preferences.modality} onChange={v => setPref({ modality: v as Modality })}
            options={[
              { value: '', label: 'Tanto faz' },
              { value: 'presencial', label: 'Presencial', hint: 'Trabalhar no local da empresa' },
              { value: 'remoto', label: 'De casa (remoto)', hint: 'Trabalhar pelo computador, de casa' },
              { value: 'hibrido', label: 'Híbrido', hint: 'Alguns dias na empresa, outros em casa' }
            ]} />
        )}
      </ProfileField>
      <ProfileField id="job_type" label="Tipo de contratação" error={err(errors, 'preferences.job_type')}>
        {a => (
          <Dropdown {...a} value={value.preferences.job_type} onChange={v => setPref({ job_type: v as JobType })}
            options={[
              { value: '', label: 'Tanto faz' },
              { value: 'clt', label: 'Carteira assinada (CLT)' },
              { value: 'pj', label: 'Prestação de serviço (PJ)' },
              { value: 'temporario', label: 'Temporário' },
              { value: 'voluntario', label: 'Voluntário' }
            ]} />
        )}
      </ProfileField>
      <ProfileField id="availability" label="Disponibilidade" hint='Exemplo: "manhãs", "meio período", "fins de semana".'>
        {a => <input {...a} className={inputClass()} value={value.preferences.availability} onChange={e => setPref({ availability: e.target.value })} />}
      </ProfileField>
    </div>
  )
}

export const modalityLabel: Record<string, string> = { '': '', presencial: 'Presencial', remoto: 'De casa (remoto)', hibrido: 'Híbrido' }
export const jobTypeLabel: Record<string, string> = { '': '', clt: 'Carteira assinada (CLT)', pj: 'Prestação de serviço (PJ)', temporario: 'Temporário', voluntario: 'Voluntário' }

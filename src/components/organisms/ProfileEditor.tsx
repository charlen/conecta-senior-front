import { useState } from 'react'
import type { CandidateEducation, CandidateExperience, CandidateProfile, FieldError, JobType, Modality } from '../../types/candidate'
import { UFS, emptyEducation, emptyExperience } from '../../types/candidate'
import { ProfileField, inputClass } from '../molecules/ProfileField'
import { Button } from '../atoms/Button'

type ProfileEditorProps = {
  value: CandidateProfile
  onChange: (next: CandidateProfile) => void
  errors?: FieldError[]
}

const sectionClass = 'space-y-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8'
const sectionTitle = 'text-2xl md:text-3xl font-bold text-slate-900'

export function ProfileEditor({ value, onChange, errors = [] }: ProfileEditorProps) {
  const [newSkill, setNewSkill] = useState('')
  const errorFor = (field: string) => errors.find(e => e.field === field)?.message

  const set = <K extends keyof CandidateProfile>(key: K, v: CandidateProfile[K]) => onChange({ ...value, [key]: v })

  const setExperience = (i: number, patch: Partial<CandidateExperience>) =>
    set('experiences', value.experiences.map((e, idx) => (idx === i ? { ...e, ...patch } : e)))
  const setEducation = (i: number, patch: Partial<CandidateEducation>) =>
    set('education', value.education.map((e, idx) => (idx === i ? { ...e, ...patch } : e)))

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !value.skills.some(x => x.toLowerCase() === s.toLowerCase())) set('skills', [...value.skills, s])
    setNewSkill('')
  }

  return (
    <div className="space-y-8">
      {/* 1. Dados pessoais */}
      <section className={sectionClass} aria-labelledby="sec-pessoais">
        <h2 id="sec-pessoais" className={sectionTitle}>Seus dados</h2>

        <ProfileField id="full_name" label="Nome completo" required error={errorFor('full_name')}>
          {a => <input {...a} className={inputClass(errorFor('full_name'))} autoComplete="name" value={value.full_name} onChange={e => set('full_name', e.target.value)} />}
        </ProfileField>

        {value.email && (
          <ProfileField id="email" label="E-mail" hint="É o e-mail da sua conta. Para trocar, fale com o suporte.">
            {a => <input {...a} className={`${inputClass()} bg-slate-100 text-slate-600`} value={value.email} readOnly />}
          </ProfileField>
        )}

        <ProfileField id="phone" label="Telefone com DDD" required hint="Exemplo: (11) 98765-4321" error={errorFor('phone')}>
          {a => <input {...a} type="tel" inputMode="tel" autoComplete="tel" className={inputClass(errorFor('phone'))} value={value.phone} onChange={e => set('phone', e.target.value)} />}
        </ProfileField>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <ProfileField id="city" label="Cidade" required error={errorFor('city')}>
            {a => <input {...a} autoComplete="address-level2" className={inputClass(errorFor('city'))} value={value.city} onChange={e => set('city', e.target.value)} />}
          </ProfileField>
          <ProfileField id="state" label="Estado" required error={errorFor('state')}>
            {a => (
              <select {...a} className={inputClass(errorFor('state'))} value={value.state} onChange={e => set('state', e.target.value)}>
                <option value="">Escolha</option>
                {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            )}
          </ProfileField>
        </div>

        <ProfileField id="birth_year" label="Ano de nascimento" error={errorFor('birth_year')}>
          {a => (
            <input {...a} type="number" inputMode="numeric" min={1920} max={2010} className={inputClass(errorFor('birth_year'))}
              value={value.birth_year ?? ''} onChange={e => set('birth_year', e.target.value ? Number(e.target.value) : undefined)} />
          )}
        </ProfileField>
      </section>

      {/* 2. Profissão */}
      <section className={sectionClass} aria-labelledby="sec-profissao">
        <h2 id="sec-profissao" className={sectionTitle}>Sua profissão</h2>
        <ProfileField id="headline" label="Área ou profissão" required hint='Em poucas palavras. Exemplo: "Contadora" ou "Professor de Matemática".' error={errorFor('headline')}>
          {a => <input {...a} className={inputClass(errorFor('headline'))} value={value.headline} onChange={e => set('headline', e.target.value)} />}
        </ProfileField>
        <ProfileField id="summary" label="Sobre você" hint="Conte sua trajetória do seu jeito. As empresas leem este texto.">
          {a => <textarea {...a} className={`${inputClass()} min-h-[160px]`} value={value.summary} onChange={e => set('summary', e.target.value)} />}
        </ProfileField>
        <ProfileField id="linkedin" label="LinkedIn">
          {a => <input {...a} type="url" inputMode="url" placeholder="https://linkedin.com/in/..." className={inputClass()} value={value.linkedin} onChange={e => set('linkedin', e.target.value)} />}
        </ProfileField>
      </section>

      {/* 3. Experiências */}
      <section className={sectionClass} aria-labelledby="sec-exp">
        <h2 id="sec-exp" className={sectionTitle}>Experiências de trabalho</h2>
        {errorFor('experiences') && <p role="alert" className="text-lg font-semibold text-red-700">{errorFor('experiences')}</p>}
        {value.experiences.length === 0 && <p className="text-xl text-slate-600">Nenhuma experiência adicionada ainda.</p>}

        {value.experiences.map((exp, i) => (
          <fieldset key={i} className="space-y-5 rounded-2xl border-2 border-slate-200 p-5">
            <legend className="px-2 text-xl font-bold text-slate-800">Experiência {i + 1}</legend>
            <ProfileField id={`exp-${i}-role`} label="Cargo ou função" required error={errorFor(`experiences.${i}.role`)}>
              {a => <input {...a} className={inputClass(errorFor(`experiences.${i}.role`))} value={exp.role} onChange={e => setExperience(i, { role: e.target.value })} />}
            </ProfileField>
            <ProfileField id={`exp-${i}-company`} label="Empresa ou lugar">
              {a => <input {...a} className={inputClass()} value={exp.company} onChange={e => setExperience(i, { company: e.target.value })} />}
            </ProfileField>
            <div className="grid gap-5 md:grid-cols-2">
              <ProfileField id={`exp-${i}-start`} label="Início" hint="Ano ou mês/ano">
                {a => <input {...a} className={inputClass()} placeholder="1998" value={exp.start} onChange={e => setExperience(i, { start: e.target.value })} />}
              </ProfileField>
              {!exp.current && (
                <ProfileField id={`exp-${i}-end`} label="Fim" hint="Ano ou mês/ano">
                  {a => <input {...a} className={inputClass()} placeholder="2015" value={exp.end} onChange={e => setExperience(i, { end: e.target.value })} />}
                </ProfileField>
              )}
            </div>
            <label className="flex items-center gap-4 text-xl min-h-[48px] cursor-pointer">
              <input type="checkbox" className="h-7 w-7 accent-primary" checked={exp.current} onChange={e => setExperience(i, { current: e.target.checked, end: e.target.checked ? '' : exp.end })} />
              Trabalho aqui atualmente
            </label>
            <ProfileField id={`exp-${i}-desc`} label="O que você fazia">
              {a => <textarea {...a} className={`${inputClass()} min-h-[140px]`} value={exp.description} onChange={e => setExperience(i, { description: e.target.value })} />}
            </ProfileField>
            <Button type="button" variant="secondary" onClick={() => set('experiences', value.experiences.filter((_, idx) => idx !== i))}>
              Remover esta experiência
            </Button>
          </fieldset>
        ))}

        <Button type="button" variant="secondary" className="w-full" onClick={() => set('experiences', [...value.experiences, emptyExperience()])}>
          + Adicionar experiência
        </Button>
      </section>

      {/* 4. Formação */}
      <section className={sectionClass} aria-labelledby="sec-edu">
        <h2 id="sec-edu" className={sectionTitle}>Formação <span className="text-xl font-normal text-slate-500">(opcional)</span></h2>
        {value.education.map((edu, i) => (
          <fieldset key={i} className="space-y-5 rounded-2xl border-2 border-slate-200 p-5">
            <legend className="px-2 text-xl font-bold text-slate-800">Formação {i + 1}</legend>
            <ProfileField id={`edu-${i}-course`} label="Curso">
              {a => <input {...a} className={inputClass()} value={edu.course} onChange={e => setEducation(i, { course: e.target.value })} />}
            </ProfileField>
            <ProfileField id={`edu-${i}-inst`} label="Escola ou instituição">
              {a => <input {...a} className={inputClass()} value={edu.institution} onChange={e => setEducation(i, { institution: e.target.value })} />}
            </ProfileField>
            <ProfileField id={`edu-${i}-year`} label="Ano de conclusão">
              {a => <input {...a} inputMode="numeric" className={inputClass()} value={edu.end_year} onChange={e => setEducation(i, { end_year: e.target.value })} />}
            </ProfileField>
            <Button type="button" variant="secondary" onClick={() => set('education', value.education.filter((_, idx) => idx !== i))}>
              Remover esta formação
            </Button>
          </fieldset>
        ))}
        <Button type="button" variant="secondary" className="w-full" onClick={() => set('education', [...value.education, emptyEducation()])}>
          + Adicionar formação
        </Button>
      </section>

      {/* 5. Habilidades */}
      <section className={sectionClass} aria-labelledby="sec-skills">
        <h2 id="sec-skills" className={sectionTitle}>Habilidades <span className="text-xl font-normal text-slate-500">(opcional)</span></h2>
        <ul className="flex flex-wrap gap-3" aria-label="Habilidades adicionadas">
          {value.skills.map(skill => (
            <li key={skill} className="flex items-center gap-2 rounded-full bg-slate-100 pl-5 pr-2 text-xl">
              {skill}
              <button type="button" aria-label={`Remover ${skill}`} onClick={() => set('skills', value.skills.filter(s => s !== skill))}
                className="h-12 w-12 rounded-full text-2xl hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/30 cursor-pointer">
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 md:flex-row">
          <label htmlFor="new-skill" className="sr-only">Nova habilidade</label>
          <input id="new-skill" className={inputClass()} placeholder="Ex.: Atendimento ao cliente" value={newSkill}
            onChange={e => setNewSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }} />
          <Button type="button" variant="secondary" onClick={addSkill}>Adicionar</Button>
        </div>
      </section>

      {/* 6. Preferências */}
      <section className={sectionClass} aria-labelledby="sec-pref">
        <h2 id="sec-pref" className={sectionTitle}>Que tipo de vaga você procura? <span className="text-xl font-normal text-slate-500">(opcional)</span></h2>
        <ProfileField id="modality" label="Modalidade" error={errorFor('preferences.modality')}>
          {a => (
            <select {...a} className={inputClass()} value={value.preferences.modality}
              onChange={e => set('preferences', { ...value.preferences, modality: e.target.value as Modality })}>
              <option value="">Tanto faz</option>
              <option value="presencial">Presencial</option>
              <option value="remoto">De casa (remoto)</option>
              <option value="hibrido">Híbrido</option>
            </select>
          )}
        </ProfileField>
        <ProfileField id="job_type" label="Tipo de contratação" error={errorFor('preferences.job_type')}>
          {a => (
            <select {...a} className={inputClass()} value={value.preferences.job_type}
              onChange={e => set('preferences', { ...value.preferences, job_type: e.target.value as JobType })}>
              <option value="">Tanto faz</option>
              <option value="clt">Carteira assinada (CLT)</option>
              <option value="pj">Prestação de serviço (PJ)</option>
              <option value="temporario">Temporário</option>
              <option value="voluntario">Voluntário</option>
            </select>
          )}
        </ProfileField>
        <ProfileField id="availability" label="Disponibilidade" hint='Exemplo: "manhãs", "meio período", "fins de semana".'>
          {a => <input {...a} className={inputClass()} value={value.preferences.availability}
            onChange={e => set('preferences', { ...value.preferences, availability: e.target.value })} />}
        </ProfileField>
      </section>
    </div>
  )
}

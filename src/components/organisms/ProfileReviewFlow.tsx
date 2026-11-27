import { useEffect, useRef, useState } from 'react'
import type { CandidateEducation, CandidateExperience, CandidateProfile } from '../../types/candidate'
import { emptyEducation, emptyExperience } from '../../types/candidate'
import { useCandidateProfile } from '../../hooks/useCandidateProfile'
import { missingRequired, sectionOf, type SectionKey } from '../../utils/profileValidation'
import { SummaryCard, SummaryRow } from '../molecules/SummaryCard'
import { ConfirmModal } from '../molecules/ConfirmModal'
import { Alerta } from '../molecules/Alerta'
import { Button } from '../atoms/Button'
import { Spinner } from '../atoms/Spinner'
import {
  EducationFields, ExperienceFields, PersonalFields, PreferencesFields, ProfessionFields, SkillsFields,
  jobTypeLabel, modalityLabel
} from './ProfileSectionFields'

type View =
  | { type: 'summary' }
  | { type: 'section'; key: 'personal' | 'profession' | 'skills' | 'preferences' }
  | { type: 'experience'; index: number | null }
  | { type: 'education'; index: number | null }

type Removal = { kind: 'experience' | 'education'; index: number; label: string }

type ProfileReviewFlowProps = {
  mode: 'onboarding' | 'profile'
  seed?: (saved: CandidateProfile) => CandidateProfile
  onFinish?: () => void
}

const sectionTitles = {
  personal: 'Seus dados',
  profession: 'Sua profissão',
  skills: 'Habilidades',
  preferences: 'Que tipo de vaga você procura?'
} as const

const period = (e: CandidateExperience) => {
  const end = e.current ? 'até hoje' : e.end
  return [e.start, end].filter(Boolean).join(' – ')
}
const join = (...parts: string[]) => parts.map(p => p.trim()).filter(Boolean).join(' · ')

export function ProfileReviewFlow({ mode, seed, onFinish }: ProfileReviewFlowProps) {
  const { profile, errors, status, message, save, clearFeedback } = useCandidateProfile(seed)
  const [view, setView] = useState<View>({ type: 'summary' })
  const [working, setWorking] = useState<CandidateProfile | null>(null)
  const [item, setItem] = useState<CandidateExperience | CandidateEducation | null>(null)
  const [removal, setRemoval] = useState<Removal | null>(null)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    headingRef.current?.focus()
  }, [view])

  if (status === 'loading' || !profile) {
    return (
      <div className="flex items-center gap-4 text-xl" role="status">
        {status === 'error' ? <Alerta tipo="erro">{message}</Alerta> : <><Spinner /> Carregando seu perfil...</>}
      </div>
    )
  }

  const missing = missingRequired(profile)
  const missingIn = (key: SectionKey) => missing.some(m => sectionOf(m.field) === key)

  const open = (next: View) => {
    clearFeedback()
    setWorking(profile)
    if (next.type === 'experience') setItem(next.index === null ? emptyExperience() : profile.experiences[next.index])
    if (next.type === 'education') setItem(next.index === null ? emptyEducation() : profile.education[next.index])
    setView(next)
  }

  const isDirty = () => {
    if (view.type === 'section') return JSON.stringify(working) !== JSON.stringify(profile)
    if (view.type === 'experience') return JSON.stringify(item) !== JSON.stringify(view.index === null ? emptyExperience() : profile.experiences[view.index])
    if (view.type === 'education') return JSON.stringify(item) !== JSON.stringify(view.index === null ? emptyEducation() : profile.education[view.index])
    return false
  }

  const backToSummary = () => {
    setConfirmDiscard(false)
    setView({ type: 'summary' })
  }

  const cancel = () => (isDirty() ? setConfirmDiscard(true) : backToSummary())

  const saveCurrent = async () => {
    let next: CandidateProfile = profile
    if (view.type === 'section' && working) next = working
    if (view.type === 'experience' && item) {
      const exp = item as CandidateExperience
      next = { ...profile, experiences: view.index === null ? [...profile.experiences, exp] : profile.experiences.map((e, i) => (i === view.index ? exp : e)) }
    }
    if (view.type === 'education' && item) {
      const edu = item as CandidateEducation
      next = { ...profile, education: view.index === null ? [...profile.education, edu] : profile.education.map((e, i) => (i === view.index ? edu : e)) }
    }
    if (await save(next)) setView({ type: 'summary' })
  }

  const confirmRemoval = async () => {
    if (!removal) return
    const next =
      removal.kind === 'experience'
        ? { ...profile, experiences: profile.experiences.filter((_, i) => i !== removal.index) }
        : { ...profile, education: profile.education.filter((_, i) => i !== removal.index) }
    setRemoval(null)
    await save(next)
  }

  const finish = async () => {
    if (await save(profile)) onFinish?.()
  }

  // ---------- Focused editor (one thing per page) ----------
  if (view.type !== 'summary') {
    const title =
      view.type === 'section' ? sectionTitles[view.key]
      : view.type === 'experience' ? (view.index === null ? 'Nova experiência' : 'Alterar experiência')
      : view.index === null ? 'Nova formação' : 'Alterar formação'
    const expIndex = view.type === 'experience' ? view.index ?? profile.experiences.length : 0

    return (
      <div className="space-y-8">
        <h1 ref={headingRef} tabIndex={-1} className="text-4xl md:text-5xl font-extrabold text-slate-900 focus:outline-none">{title}</h1>
        <p className="text-xl text-slate-600">Nada muda no seu perfil até você tocar em <strong>Salvar</strong>.</p>
        {message && <Alerta tipo="erro">{message}</Alerta>}

        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8">
          {view.type === 'section' && working && view.key === 'personal' && <PersonalFields value={working} onChange={setWorking} errors={errors} />}
          {view.type === 'section' && working && view.key === 'profession' && <ProfessionFields value={working} onChange={setWorking} errors={errors} />}
          {view.type === 'section' && working && view.key === 'skills' && <SkillsFields value={working} onChange={setWorking} errors={errors} />}
          {view.type === 'section' && working && view.key === 'preferences' && <PreferencesFields value={working} onChange={setWorking} errors={errors} />}
          {view.type === 'experience' && item && <ExperienceFields index={expIndex} value={item as CandidateExperience} onChange={setItem} errors={errors} />}
          {view.type === 'education' && item && <EducationFields index={0} value={item as CandidateEducation} onChange={setItem} />}
        </div>

        <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
          <Button type="button" variant="secondary" onClick={cancel}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={saveCurrent} disabled={status === 'saving'}>
            {status === 'saving' ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        <ConfirmModal
          open={confirmDiscard}
          tone="danger"
          title="Sair sem salvar?"
          message="O que você mudou nesta tela será perdido."
          confirmLabel="Sim, sair sem salvar"
          cancelLabel="Continuar editando"
          onConfirm={backToSummary}
          onCancel={() => setConfirmDiscard(false)}
        />
      </div>
    )
  }

  // ---------- Summary ("confira seu perfil") ----------
  return (
    <div className="space-y-8">
      <h2 ref={headingRef} tabIndex={-1} className="sr-only">Resumo do perfil</h2>

      {status === 'saved' && <Alerta tipo="sucesso">Pronto, alterações salvas.</Alerta>}
      {message && <Alerta tipo="erro">{message}</Alerta>}

      {missing.length === 0 ? (
        <Alerta tipo="sucesso" titulo="Seu perfil está completo">As empresas já podem encontrar você.</Alerta>
      ) : (
        <div className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 md:p-8 space-y-4" role="status">
          <p className="text-2xl font-bold text-slate-900">
            {missing.length === 1 ? 'Falta só 1 informação' : `Faltam ${missing.length} informações`} para seu perfil ficar completo
          </p>
          <ul className="space-y-2">
            {missing.map(m => (
              <li key={m.field} className="text-xl text-slate-800">• {m.message}</li>
            ))}
          </ul>
        </div>
      )}

      <SummaryCard id="card-personal" title="Seus dados" missing={missingIn('personal')} onEdit={() => open({ type: 'section', key: 'personal' })}>
        <dl>
          <SummaryRow label="Nome" value={profile.full_name} />
          <SummaryRow label="E-mail" value={profile.email} />
          <SummaryRow label="Telefone" value={profile.phone} />
          <SummaryRow label="Cidade" value={join(profile.city, profile.state)} />
          <SummaryRow label="Ano de nascimento" value={profile.birth_year ? String(profile.birth_year) : ''} />
        </dl>
      </SummaryCard>

      <SummaryCard id="card-profession" title="Sua profissão" missing={missingIn('profession')} onEdit={() => open({ type: 'section', key: 'profession' })}>
        <dl>
          <SummaryRow label="Área ou profissão" value={profile.headline} />
          <SummaryRow label="Sobre você" value={profile.summary.length > 220 ? `${profile.summary.slice(0, 220)}…` : profile.summary} />
          <SummaryRow label="LinkedIn" value={profile.linkedin} />
        </dl>
      </SummaryCard>

      <SummaryCard id="card-exp" title="Experiências de trabalho" missing={missingIn('experiences')}>
        {profile.experiences.length === 0 && <p className="text-slate-600">Nenhuma experiência ainda.</p>}
        <ul className="space-y-4">
          {profile.experiences.map((e, i) => (
            <li key={i} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-slate-900">{e.role || 'Sem cargo informado'}</p>
                <p className="text-slate-700">{join(e.company, period(e))}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="secondary" aria-label={`Alterar ${e.role}`} onClick={() => open({ type: 'experience', index: i })}>Alterar</Button>
                <Button type="button" variant="secondary" aria-label={`Remover ${e.role}`}
                  onClick={() => setRemoval({ kind: 'experience', index: i, label: join(e.role, e.company) || `Experiência ${i + 1}` })}>
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button type="button" variant="secondary" className="mt-5 w-full" onClick={() => open({ type: 'experience', index: null })}>
          + Adicionar experiência
        </Button>
      </SummaryCard>

      <div className="space-y-3 pt-4">
        <h2 className="text-3xl font-bold text-slate-900">Quer completar mais?</h2>
        <p className="text-xl text-slate-700">Estas informações são opcionais, mas ajudam as empresas a conhecer você melhor.</p>
      </div>

      <SummaryCard id="card-edu" title="Formação" optional>
        {profile.education.length === 0 && <p className="text-slate-600">Nenhuma formação ainda.</p>}
        <ul className="space-y-4">
          {profile.education.map((e, i) => (
            <li key={i} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-slate-900">{e.course || 'Curso não informado'}</p>
                <p className="text-slate-700">{join(e.institution, e.end_year)}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="secondary" aria-label={`Alterar ${e.course}`} onClick={() => open({ type: 'education', index: i })}>Alterar</Button>
                <Button type="button" variant="secondary" aria-label={`Remover ${e.course}`}
                  onClick={() => setRemoval({ kind: 'education', index: i, label: join(e.course, e.institution) || `Formação ${i + 1}` })}>
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button type="button" variant="secondary" className="mt-5 w-full" onClick={() => open({ type: 'education', index: null })}>
          + Adicionar formação
        </Button>
      </SummaryCard>

      <SummaryCard id="card-skills" title="Habilidades" optional onEdit={() => open({ type: 'section', key: 'skills' })}>
        {profile.skills.length === 0 ? (
          <p className="text-slate-600">Nenhuma habilidade ainda.</p>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {profile.skills.map(s => <li key={s} className="rounded-full bg-slate-100 px-5 py-2">{s}</li>)}
          </ul>
        )}
      </SummaryCard>

      <SummaryCard id="card-pref" title="Que tipo de vaga você procura?" optional onEdit={() => open({ type: 'section', key: 'preferences' })}>
        <dl>
          <SummaryRow label="Modalidade" value={modalityLabel[profile.preferences.modality] || 'Tanto faz'} />
          <SummaryRow label="Contratação" value={jobTypeLabel[profile.preferences.job_type] || 'Tanto faz'} />
          <SummaryRow label="Disponibilidade" value={profile.preferences.availability} />
        </dl>
      </SummaryCard>

      {mode === 'onboarding' && (
        <div className="flex flex-col-reverse gap-4 pt-4 md:flex-row md:justify-between">
          <Button type="button" variant="secondary" onClick={() => window.history.back()}>Voltar</Button>
          <Button type="button" variant="primary" onClick={finish} disabled={status === 'saving'}>
            {status === 'saving' ? 'Salvando...' : 'Concluir'}
          </Button>
        </div>
      )}

      <ConfirmModal
        open={removal !== null}
        tone="danger"
        title={removal?.kind === 'education' ? 'Remover esta formação?' : 'Remover esta experiência?'}
        message={removal ? `"${removal.label}" será removida do seu perfil.` : ''}
        confirmLabel="Sim, remover"
        cancelLabel="Não, manter"
        onConfirm={confirmRemoval}
        onCancel={() => setRemoval(null)}
      />
    </div>
  )
}

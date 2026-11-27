import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '../atoms/Button'
import { Dropdown } from '../molecules/Dropdown'
import { JobCard } from '../molecules/JobCard'
import { ProfileField, inputClass } from '../molecules/ProfileField'
import { SkillsInput } from '../molecules/SkillsInput'
import { CompanyApiError } from '../../services/companyJobsApi'
import type { JobField, JobInput, JobStatus, JobType } from '../../types/companyJob'
import type { MatchedJob } from '../../types/job'
import { JOB_TYPE_OPTIONS, MODALITY_OPTIONS, STATUS_OPTIONS } from '../../utils/jobLabels'
import {
  firstErrorField,
  formToJobInput,
  JOB_FIELD_ORDER,
  JOB_LIMITS,
  serverFieldErrors,
  validateJob,
  type JobErrors,
  type JobFormValues
} from '../../utils/jobValidation'
import { maskBRL } from '../../utils/money'

/** DOM id of each field, used for labels and to focus the first error */
export const jobFieldId = (f: JobField) => `job-${f.replace(/_/g, '-')}`

type JobFormProps = {
  initial: JobFormValues
  /** Company name shown in the preview */
  companyName?: string
  submitLabel: string
  /** Persists the job; throw CompanyApiError to show server errors */
  onSubmit: (input: JobInput) => Promise<void>
  onCancel: () => void
  onDirtyChange?: (dirty: boolean) => void
  /** Called on 409 `company_required` (show the company block) */
  onCompanyRequired?: () => void
}

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      <h2 id={id} className="text-lg font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

function MoneyInput({ value, onChange, disabled, error, ...aria }: {
  id: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  error?: string
  'aria-invalid': boolean
  'aria-describedby'?: string
}) {
  return (
    <div className="relative">
      <span aria-hidden="true" className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base font-semibold ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>
        R$
      </span>
      <input
        {...aria}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0,00"
        value={value}
        disabled={disabled}
        onChange={e => onChange(maskBRL(e.target.value))}
        className={`${inputClass(error, 'md')} pl-10 tabular-nums`}
      />
    </div>
  )
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** Create/edit job form with a live preview of the candidate card. */
export function JobForm({ initial, companyName, submitLabel, onSubmit, onCancel, onDirtyChange, onCompanyRequired }: JobFormProps) {
  const [values, setValues] = useState<JobFormValues>(initial)
  const [errors, setErrors] = useState<JobErrors>({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const initialJson = useRef(JSON.stringify(initial))
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const dirty = JSON.stringify(values) !== initialJson.current

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  const set = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => {
    setValues(v => ({ ...v, [key]: value }))
    setFormError('')
    const apiKey: Partial<Record<keyof JobFormValues, JobField>> = { salaryMin: 'salary_min', salaryMax: 'salary_max', salaryNegotiable: 'salary_negotiable' }
    const field = apiKey[key] ?? (key as JobField)
    setErrors(e => {
      const next = { ...e, [field]: undefined }
      // min/max are validated together
      if (field === 'salary_min' || field === 'salary_negotiable') next.salary_max = undefined
      return next
    })
  }

  const focusField = (f: JobField) => {
    const el = document.getElementById(jobFieldId(f))
    el?.scrollIntoView({ block: 'center' })
    el?.focus({ preventScroll: true })
  }

  const showErrors = (errs: JobErrors) => {
    setErrors(errs)
    const first = firstErrorField(errs, JOB_FIELD_ORDER)
    if (first) focusField(first)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (saving) return
    setFormError('')
    const errs = validateJob(values)
    if (Object.keys(errs).length) {
      setFormError('Revise os campos destacados antes de salvar.')
      return showErrors(errs)
    }
    setSaving(true)
    try {
      await onSubmit(formToJobInput(values))
      initialJson.current = JSON.stringify(values)
      onDirtyChange?.(false)
    } catch (err) {
      if (err instanceof CompanyApiError) {
        if (err.status === 422 && err.fields.length) showErrors(serverFieldErrors(err.fields, JOB_FIELD_ORDER))
        if (err.code === 'company_required') onCompanyRequired?.()
      }
      setFormError(err instanceof Error ? err.message : 'Não conseguimos salvar a vaga. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const preview: MatchedJob = useMemo(() => {
    const input = formToJobInput(values)
    return {
      id: 'preview',
      title: input.title,
      description: input.description,
      company: companyName ?? '',
      location: input.location,
      modality: input.modality,
      job_type: input.job_type,
      skills: input.skills,
      salary_min: input.salary_min,
      salary_max: input.salary_max,
      salary_negotiable: input.salary_negotiable,
      status: input.status,
      percent: null,
      applied: false
    }
  }, [values, companyName])

  const descLength = values.description.trim().length
  const descOk = descLength >= JOB_LIMITS.descriptionMin
  const statusHint = STATUS_OPTIONS.find(o => o.value === values.status)?.hint

  const previewPanel = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900">Prévia para o candidato</h2>
        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-700">Ao vivo</span>
      </div>
      <div data-testid="job-preview">
        <JobCard job={preview} preview />
      </div>
      {values.status !== 'open' && (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          Com o status “{STATUS_OPTIONS.find(o => o.value === values.status)?.label}”, a vaga não aparece para os candidatos.
        </p>
      )}
    </div>
  )

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start">
      <div className="space-y-5 min-w-0">
        <Section id="sec-info" title="Informações da vaga">
          <ProfileField id={jobFieldId('title')} label="Título" required size="md" error={errors.title}
            hint="Seja específico: “Recepcionista de clínica” é melhor que “Recepcionista”.">
            {a => (
              <input {...a} type="text" maxLength={JOB_LIMITS.titleMax} value={values.title}
                onChange={e => set('title', e.target.value)} className={inputClass(errors.title, 'md')} />
            )}
          </ProfileField>
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField id={jobFieldId('modality')} label="Modalidade" required size="md" error={errors.modality}>
              {a => (
                <Dropdown {...a} size="md" value={values.modality} options={MODALITY_OPTIONS} placeholder="Selecione"
                  onChange={v => set('modality', v)} />
              )}
            </ProfileField>
            <ProfileField id={jobFieldId('job_type')} label="Tipo de contratação" size="md" error={errors.job_type}>
              {a => (
                <Dropdown {...a} size="md" value={values.job_type} options={JOB_TYPE_OPTIONS}
                  onChange={v => set('job_type', v as JobType)} />
              )}
            </ProfileField>
          </div>
          <ProfileField id={jobFieldId('location')} label="Local" size="md" error={errors.location}
            hint={values.modality === 'remoto' ? 'Opcional para vagas remotas. Ex.: “Todo o Brasil”.' : 'Cidade e estado. Ex.: Campinas, SP'}>
            {a => (
              <input {...a} type="text" maxLength={120} autoComplete="address-level2" value={values.location}
                onChange={e => set('location', e.target.value)} className={inputClass(errors.location, 'md')} />
            )}
          </ProfileField>
        </Section>

        <Section id="sec-desc" title="Descrição"
          description="A descrição alimenta a compatibilidade: é comparada com o perfil de cada candidato para sugerir as pessoas certas.">
          <ProfileField id={jobFieldId('description')} label="Descrição da vaga" required size="md" error={errors.description}
            hint="Inclua principais atividades, requisitos (experiência, formação), benefícios e horário.">
            {a => (
              <div>
                <textarea {...a} rows={8} value={values.description}
                  aria-describedby={[a['aria-describedby'], `${jobFieldId('description')}-count`].filter(Boolean).join(' ')}
                  placeholder={'Atividades: atender clientes por telefone e e-mail...\nRequisitos: experiência com atendimento...\nBenefícios: vale-refeição, plano de saúde...'}
                  onChange={e => set('description', e.target.value)}
                  className={`${inputClass(errors.description, 'md')} resize-y leading-relaxed`} />
                <p id={`${jobFieldId('description')}-count`} className={`mt-1 text-sm ${descOk ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {descLength} caracteres{descOk ? ' ✓' : ` · mínimo ${JOB_LIMITS.descriptionMin}`}
                </p>
              </div>
            )}
          </ProfileField>
        </Section>

        <Section id="sec-skills" title="Habilidades desejadas"
          description="Ajudam o candidato a se reconhecer na vaga e reforçam a compatibilidade.">
          <ProfileField id={jobFieldId('skills')} label="Habilidades" size="md" error={errors.skills}>
            {a => <SkillsInput id={a.id} aria-describedby={a['aria-describedby']} value={values.skills} error={errors.skills}
              onChange={s => set('skills', s)} />}
          </ProfileField>
        </Section>

        <Section id="sec-salary" title="Remuneração" description="Vagas com faixa salarial recebem candidaturas mais alinhadas.">
          <label htmlFor={jobFieldId('salary_negotiable')} className="flex min-h-[44px] w-fit items-center gap-3 cursor-pointer">
            <input id={jobFieldId('salary_negotiable')} type="checkbox" checked={values.salaryNegotiable}
              onChange={e => set('salaryNegotiable', e.target.checked)}
              className="h-5 w-5 rounded border-slate-400 accent-primary focus:outline-none focus:ring-4 focus:ring-primary/30" />
            <span className="text-base font-semibold text-slate-800">A combinar</span>
            <span className="text-sm text-slate-600">(não exibir valores)</span>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField id={jobFieldId('salary_min')} label="Mínimo" size="md" error={errors.salary_min}>
              {a => <MoneyInput {...a} value={values.salaryNegotiable ? '' : values.salaryMin} disabled={values.salaryNegotiable}
                error={errors.salary_min} onChange={v => set('salaryMin', v)} />}
            </ProfileField>
            <ProfileField id={jobFieldId('salary_max')} label="Máximo" size="md" error={errors.salary_max}>
              {a => <MoneyInput {...a} value={values.salaryNegotiable ? '' : values.salaryMax} disabled={values.salaryNegotiable}
                error={errors.salary_max} onChange={v => set('salaryMax', v)} />}
            </ProfileField>
          </div>
        </Section>

        <Section id="sec-status" title="Status">
          <ProfileField id={jobFieldId('status')} label="Situação da vaga" required hideRequirement size="md" error={errors.status} hint={statusHint}>
            {a => (
              <Dropdown {...a} size="md" value={values.status} options={STATUS_OPTIONS}
                onChange={v => set('status', v as JobStatus)} />
            )}
          </ProfileField>
        </Section>

        {!isDesktop && previewPanel}

        <div className="sticky bottom-0 z-20 -mx-4 md:mx-0 border-t md:border border-slate-200 bg-white/95 backdrop-blur px-4 py-3 md:rounded-2xl md:shadow-sm">
          {formError && (
            <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
              {formError}
            </p>
          )}
          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-sm text-slate-600 mr-auto" aria-live="polite">
              {dirty ? 'Alterações não salvas' : 'Nenhuma alteração pendente'}
            </p>
            <Button type="button" size="md" variant="secondary" onClick={onCancel} className="flex-1 sm:flex-none">
              Cancelar
            </Button>
            <Button type="submit" size="md" variant="primary" disabled={saving} aria-busy={saving} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2">
              {saving && <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              {saving ? 'Salvando…' : submitLabel}
            </Button>
          </div>
        </div>
      </div>

      {isDesktop && (
        <aside className="sticky top-24 min-w-0" aria-label="Prévia da vaga">
          {previewPanel}
        </aside>
      )}
    </form>
  )
}

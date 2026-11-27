import { Button } from '../atoms/Button'
import type { MatchedJob } from '../../types/job'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

function formatSalary(min: number | null, max: number | null): string | null {
  if (min != null && max != null) return `${currency.format(min)} a ${currency.format(max)}`
  if (min != null) return `A partir de ${currency.format(min)}`
  if (max != null) return `Até ${currency.format(max)}`
  return null
}

function badgeTone(percent: number): string {
  if (percent >= 70) return 'bg-emerald-100 text-emerald-900 border-emerald-700'
  if (percent >= 40) return 'bg-blue-50 text-blue-900 border-blue-700'
  return 'bg-slate-100 text-slate-900 border-slate-600'
}

type JobCardProps = {
  job: MatchedJob
  onApply?: (job: MatchedJob) => void
  onWithdraw?: (job: MatchedJob) => void
  busy?: boolean
}

export function JobCard({ job, onApply, onWithdraw, busy }: JobCardProps) {
  const salary = formatSalary(job.salary_min, job.salary_max)
  return (
    <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm" aria-labelledby={`job-${job.id}`}>
      {job.percent != null && (
        <p
          className={`w-fit flex flex-wrap items-baseline gap-x-2 gap-y-1 px-4 md:px-5 py-2 mb-4 rounded-2xl border-2 text-xl font-bold ${badgeTone(job.percent)}`}
        >
          <span className="text-3xl leading-none">{job.percent}%</span>
          <span className="whitespace-nowrap">compatível com você</span>
        </p>
      )}
      <h3 id={`job-${job.id}`} className="text-2xl font-bold text-slate-900">
        {job.title}
      </h3>
      {job.company && <p className="text-xl text-slate-700 mt-1">{job.company}</p>}
      {job.description && <p className="text-xl text-slate-700 mt-3 leading-relaxed">{job.description}</p>}
      <div className="mt-4 flex flex-wrap gap-2 text-lg text-slate-800">
        {job.location && <span className="px-4 py-1 bg-slate-100 rounded-full">{job.location}</span>}
        {job.modality && <span className="px-4 py-1 bg-slate-100 rounded-full">{job.modality}</span>}
        {salary && <span className="px-4 py-1 bg-slate-100 rounded-full">{salary}</span>}
      </div>
      {job.applied ? (
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3 text-xl font-semibold text-emerald-800" role="status">
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</span>
            Você se candidatou a esta vaga
          </p>
          {onWithdraw && (
            <Button variant="secondary" className="w-full md:w-auto" onClick={() => onWithdraw(job)} disabled={busy}>
              Desistir da candidatura
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 flex md:justify-end">
          <Button variant="primary" className="w-full md:w-auto" onClick={() => onApply?.(job)} disabled={busy || !onApply}>
            {busy ? 'Enviando...' : 'Candidatar-me'}
          </Button>
        </div>
      )}
    </article>
  )
}

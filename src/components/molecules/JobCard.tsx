import { Button } from '../atoms/Button'
import type { MatchedJob } from '../../types/job'
import { jobTypeLabel, modalityLabel } from '../../utils/jobLabels'
import { formatSalaryRange } from '../../utils/money'

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
  /**
   * Recruiter preview: shows the card as candidates see it, with an inert
   * "Candidatar-me" (not focusable) and placeholders for empty fields.
   */
  preview?: boolean
}

export function JobCard({ job, onApply, onWithdraw, busy, preview }: JobCardProps) {
  const salary = formatSalaryRange(job.salary_min, job.salary_max, job.salary_negotiable)
  const tags = [job.location, modalityLabel(job.modality), jobTypeLabel(job.job_type), salary].filter(Boolean) as string[]
  const skills = job.skills ?? []
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
      <h3 id={`job-${job.id}`} className={`text-2xl font-bold break-words ${job.title ? 'text-slate-900' : 'text-slate-400'}`}>
        {job.title || (preview ? 'Título da vaga' : '')}
      </h3>
      {job.company && <p className="text-xl text-slate-700 mt-1">{job.company}</p>}
      {job.description ? (
        <p className="text-xl text-slate-700 mt-3 leading-relaxed whitespace-pre-line break-words">{job.description}</p>
      ) : (
        preview && <p className="text-xl text-slate-400 mt-3 leading-relaxed">A descrição da vaga aparece aqui.</p>
      )}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 text-lg text-slate-800">
          {tags.map(t => (
            <span key={t} className="px-4 py-1 bg-slate-100 rounded-full">{t}</span>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-slate-800">Habilidades desejadas</p>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Habilidades desejadas">
            {skills.map(s => (
              <li key={s} className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-base text-blue-900 break-all">{s}</li>
            ))}
          </ul>
        </div>
      )}
      {preview ? (
        <div className="mt-6 flex md:justify-end" aria-hidden="true">
          <span className="w-full md:w-auto px-8 py-4 text-xl font-semibold rounded-2xl min-h-[56px] bg-[#2563eb] text-white text-center select-none">
            Candidatar-me
          </span>
        </div>
      ) : job.applied ? (
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

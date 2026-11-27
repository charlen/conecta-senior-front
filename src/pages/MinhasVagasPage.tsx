import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { JobStatusBadge } from '../components/molecules/JobStatusBadge'
import { RecruiterPageTemplate } from '../components/templates/RecruiterPageTemplate'
import { companyJobsApi } from '../services/companyJobsApi'
import type { Company, CompanyJob, JobStatus } from '../types/companyJob'
import { formatJobDate, jobTypeLabel, modalityLabel } from '../utils/jobLabels'

type Filter = 'all' | JobStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'open', label: 'Abertas' },
  { value: 'freeze', label: 'Congeladas' },
  { value: 'close', label: 'Fechadas' }
]

const go = (href: string) => (window.location.href = href)
const candidatesHref = (id: string) => `/vagas/${encodeURIComponent(id)}/candidatos`
const editHref = (id: string) => `/vagas/editar/${encodeURIComponent(id)}`

/** Success message after creating/saving a job (?criada=id / ?salva=id). */
function flashFromQuery(): string {
  const q = new URLSearchParams(window.location.search)
  if (q.has('criada')) return 'Vaga publicada. Em instantes ela será analisada para indicar candidatos compatíveis.'
  if (q.has('salva')) return 'Alterações salvas.'
  if (q.has('empresa')) return 'Dados da empresa atualizados.'
  return ''
}

function Analyzing() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600" title="A vaga está sendo processada para calcular a compatibilidade com candidatos">
      <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-primary animate-spin" />
      Analisando para compatibilidade
    </span>
  )
}

function ApplicantsCount({ n }: { n: number }) {
  return (
    <span className={`tabular-nums ${n > 0 ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
      {n}
      <span className="sr-only">{n === 1 ? ' candidatura' : ' candidaturas'}</span>
    </span>
  )
}

export default function MinhasVagasPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [jobs, setJobs] = useState<CompanyJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [flash, setFlash] = useState(flashFromQuery)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [c, j] = await Promise.all([companyJobsApi.getCompany(), companyJobsApi.listMyJobs()])
      setCompany(c)
      setJobs(j)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não conseguimos carregar suas vagas agora.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    // Drop ?criada=… from the URL so a reload doesn't repeat the message
    if (window.location.search) window.history.replaceState(null, '', window.location.pathname)
  }, [load])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: jobs.length, open: 0, freeze: 0, close: 0 }
    for (const j of jobs) if (j.status in c) c[j.status as JobStatus]++
    return c
  }, [jobs])
  const totalApplicants = useMemo(() => jobs.reduce((sum, j) => sum + (j.applicants_count || 0), 0), [jobs])
  const visible = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  return (
    <RecruiterPageTemplate current="/minhas-vagas">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-600">Painel da empresa</p>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 break-words" data-testid="company-title">
            {loading ? 'Minhas vagas' : company?.company_name || 'Minhas vagas'}
          </h1>
          {!loading && (
            <a href="/minha-empresa" className="mt-1 inline-block text-sm font-semibold text-primary hover:underline focus:outline-none focus:ring-4 focus:ring-primary/30 rounded">
              {company ? 'Editar dados da empresa' : 'Cadastrar dados da empresa'}
            </a>
          )}
        </div>
        <Button size="md" variant="primary" onClick={() => go('/vagas/nova')} className="w-full md:w-auto">
          + Nova vaga
        </Button>
      </div>

      {flash && (
        <div role="status" className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          <span>{flash}</span>
          <button type="button" onClick={() => setFlash('')} aria-label="Fechar aviso"
            className="-my-1 h-8 w-8 shrink-0 rounded-lg text-lg leading-none hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer">×</button>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <dl className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Vagas', value: jobs.length },
            { label: 'Abertas', value: counts.open },
            { label: 'Candidaturas', value: totalApplicants }
          ].map(s => (
            <div key={s.label} className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-3">
              <dt className="text-xs font-semibold text-slate-600 sm:uppercase sm:tracking-wide">{s.label}</dt>
              <dd className="mt-0.5 text-2xl font-bold tabular-nums text-slate-900">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section aria-labelledby="jobs-title" className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
          <h2 id="jobs-title" className="text-base font-bold text-slate-900">Vagas publicadas</h2>
          {jobs.length > 0 && (
            <div role="group" aria-label="Filtrar por status" className="grid grid-cols-2 sm:flex gap-1 rounded-xl bg-slate-100 p-1">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={`min-h-[36px] whitespace-nowrap rounded-lg px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${
                    filter === f.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label} <span className="tabular-nums text-slate-500">{counts[f.value]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 py-16 text-base text-slate-700"><Spinner /> Carregando vagas…</div>
        )}

        {!loading && error && (
          <div role="alert" className="p-6 text-center space-y-3">
            <p className="text-base font-semibold text-red-800">{error}</p>
            <Button size="md" variant="secondary" onClick={() => void load()}>Tentar novamente</Button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="px-6 py-14 text-center" data-testid="jobs-empty">
            <p className="text-lg font-bold text-slate-900">Nenhuma vaga publicada ainda</p>
            <p className="mx-auto mt-1 max-w-md text-base text-slate-600">
              Publique a primeira vaga e mostraremos os candidatos mais compatíveis com ela.
            </p>
            <Button size="md" variant="primary" className="mt-5" onClick={() => go('/vagas/nova')}>Publicar primeira vaga</Button>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && visible.length === 0 && (
          <p className="px-6 py-10 text-center text-base text-slate-600">Nenhuma vaga com este status.</p>
        )}

        {!loading && !error && visible.length > 0 && (
          <>
            {/* Desktop: table */}
            <table className="hidden md:table w-full text-left text-sm" data-testid="jobs-table">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-2.5">Vaga</th>
                  <th scope="col" className="px-3 py-2.5">Status</th>
                  <th scope="col" className="px-3 py-2.5">Modalidade</th>
                  <th scope="col" className="px-3 py-2.5">Publicada</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Candidaturas</th>
                  <th scope="col" className="px-5 py-2.5 text-right"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3 align-top">
                      <a href={editHref(j.id)} className="text-base font-semibold text-slate-900 hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded break-words">
                        {j.title}
                      </a>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-600">
                        {[j.location, jobTypeLabel(j.job_type)].filter(Boolean).join(' · ')}
                        {!j.vector_ready && <Analyzing />}
                      </div>
                    </td>
                    <td className="px-3 py-3 align-top"><JobStatusBadge status={j.status} /></td>
                    <td className="px-3 py-3 align-top text-slate-700">{modalityLabel(j.modality) || '—'}</td>
                    <td className="px-3 py-3 align-top whitespace-nowrap text-slate-700">{formatJobDate(j.created_at) || '—'}</td>
                    <td className="px-3 py-3 align-top text-right text-base"><ApplicantsCount n={j.applicants_count} /></td>
                    <td className="px-5 py-3 align-top">
                      <div className="flex justify-end gap-2">
                        <a href={candidatesHref(j.id)} aria-label={`Ver candidatos de ${j.title}`}
                          className="inline-flex min-h-[36px] items-center whitespace-nowrap rounded-lg bg-primary px-3 text-sm font-semibold text-white hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/30">
                          Ver candidatos
                        </a>
                        <a href={editHref(j.id)} aria-label={`Editar ${j.title}`}
                          className="inline-flex min-h-[36px] items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/30">
                          Editar
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile: list */}
            <ul className="md:hidden divide-y divide-slate-100" data-testid="jobs-list">
              {visible.map(j => (
                <li key={j.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900 break-words min-w-0">{j.title}</h3>
                    <JobStatusBadge status={j.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {[modalityLabel(j.modality), j.location, formatJobDate(j.created_at)].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-700">
                    <span><ApplicantsCount n={j.applicants_count} /> <span aria-hidden="true">{j.applicants_count === 1 ? 'candidatura' : 'candidaturas'}</span></span>
                    {!j.vector_ready && <Analyzing />}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a href={candidatesHref(j.id)} aria-label={`Ver candidatos de ${j.title}`}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-3 text-sm font-semibold text-white focus:outline-none focus:ring-4 focus:ring-primary/30">
                      Ver candidatos
                    </a>
                    <a href={editHref(j.id)} aria-label={`Editar ${j.title}`}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/30">
                      Editar
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </RecruiterPageTemplate>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { ConfirmModal } from '../components/molecules/ConfirmModal'
import { JobStatusBadge } from '../components/molecules/JobStatusBadge'
import { JobForm } from '../components/organisms/JobForm'
import { RecruiterPageTemplate } from '../components/templates/RecruiterPageTemplate'
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard'
import { companyJobsApi, CompanyApiError } from '../services/companyJobsApi'
import type { CompanyJob, JobInput } from '../types/companyJob'
import { applicantsLabel, formatJobDate } from '../utils/jobLabels'
import { jobToForm } from '../utils/jobValidation'

/** Reads the job id from /vagas/editar/:id. */
function jobIdFromPath(path: string): string {
  return decodeURIComponent(path.split('/vagas/editar/')[1]?.split('/')[0] ?? '')
}

export default function EditarVagaPage() {
  const jobId = jobIdFromPath(window.location.pathname)
  const [job, setJob] = useState<CompanyJob | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; status: number } | null>(null)
  const [dirty, setDirty] = useState(false)
  const guard = useUnsavedChangesGuard(dirty)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [{ job, owned }, company] = await Promise.all([
        companyJobsApi.getJob(jobId),
        companyJobsApi.getCompany().catch(() => null)
      ])
      if (!owned) {
        setError({ message: 'Esta vaga pertence a outra empresa. Só quem publicou pode editá-la.', status: 403 })
        return
      }
      setJob(job)
      setCompanyName(company?.company_name ?? '')
    } catch (err) {
      const status = err instanceof CompanyApiError ? err.status : 0
      setError({ message: err instanceof Error ? err.message : 'Não conseguimos carregar esta vaga.', status })
    } finally {
      setLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    void load()
  }, [load])

  const initial = useMemo(() => (job ? jobToForm(job) : null), [job])

  const submit = async (input: JobInput) => {
    await companyJobsApi.updateJob(jobId, input)
    guard.leave(`/minhas-vagas?salva=${encodeURIComponent(jobId)}`)
  }

  const candidatesHref = `/vagas/${encodeURIComponent(jobId)}/candidatos`

  return (
    <RecruiterPageTemplate current="" onNavigate={guard.navigate} width="wide">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <a href="/minhas-vagas" onClick={e => { e.preventDefault(); guard.navigate('/minhas-vagas') }}
            className="text-sm font-semibold text-primary hover:underline focus:outline-none focus:ring-4 focus:ring-primary/30 rounded">
            ← Minhas vagas
          </a>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 break-words">
            {job ? `Editar: ${job.title}` : 'Editar vaga'}
          </h1>
          {job && (
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
              <JobStatusBadge status={job.status} />
              {job.created_at && <span>Publicada em {formatJobDate(job.created_at)}</span>}
              <span>{applicantsLabel(job.applicants_count)}</span>
            </p>
          )}
        </div>
        {job && (
          <Button size="md" variant="secondary" onClick={() => guard.navigate(candidatesHref)} className="w-full md:w-auto">
            Ver candidatos
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-16 justify-center text-base text-slate-700"><Spinner /> Carregando vaga…</div>
      )}

      {!loading && error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 space-y-3">
          <p className="text-base font-semibold text-red-800">{error.message}</p>
          <div className="flex flex-wrap gap-3">
            {error.status !== 403 && error.status !== 404 && (
              <Button size="md" variant="primary" onClick={() => void load()}>Tentar novamente</Button>
            )}
            <Button size="md" variant="secondary" onClick={() => (window.location.href = '/minhas-vagas')}>Ver minhas vagas</Button>
          </div>
        </div>
      )}

      {!loading && !error && initial && (
        <JobForm
          initial={initial}
          companyName={companyName}
          submitLabel="Salvar alterações"
          onSubmit={submit}
          onCancel={() => guard.navigate('/minhas-vagas')}
          onDirtyChange={setDirty}
        />
      )}
      <ConfirmModal {...guard.modal} />
    </RecruiterPageTemplate>
  )
}

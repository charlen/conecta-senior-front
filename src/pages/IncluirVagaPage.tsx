import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { ConfirmModal } from '../components/molecules/ConfirmModal'
import { CompanyForm } from '../components/organisms/CompanyForm'
import { JobForm } from '../components/organisms/JobForm'
import { RecruiterPageTemplate } from '../components/templates/RecruiterPageTemplate'
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard'
import { companyJobsApi, CompanyApiError } from '../services/companyJobsApi'
import type { Company, JobInput } from '../types/companyJob'
import { EMPTY_JOB_FORM } from '../utils/jobValidation'

export default function IncluirVagaPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [companyRequired, setCompanyRequired] = useState(false)
  const [dirty, setDirty] = useState(false)
  const companyRef = useRef<HTMLElement>(null)
  const guard = useUnsavedChangesGuard(dirty)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      setCompany(await companyJobsApi.getCompany())
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Não conseguimos carregar os dados da empresa.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const revealCompany = () => {
    setCompany(null)
    setCompanyRequired(true)
    companyRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    setTimeout(() => document.getElementById('company-company_name')?.focus({ preventScroll: true }), 50)
  }

  const submit = async (input: JobInput) => {
    if (!company) {
      throw new CompanyApiError('Salve os dados da empresa antes de publicar a vaga.', 409, 'company_required')
    }
    const { id } = await companyJobsApi.createJob(input)
    guard.leave(`/minhas-vagas?criada=${encodeURIComponent(id)}`)
  }

  return (
    <RecruiterPageTemplate current="/vagas/nova" onNavigate={guard.navigate} width="wide">
      <div className="mb-6">
        <a href="/minhas-vagas" onClick={e => { e.preventDefault(); guard.navigate('/minhas-vagas') }}
          className="text-sm font-semibold text-primary hover:underline focus:outline-none focus:ring-4 focus:ring-primary/30 rounded">
          ← Minhas vagas
        </a>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Nova vaga</h1>
        <p className="mt-1 text-base text-slate-600">Preencha os dados e confira à direita como os candidatos verão a vaga.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-16 justify-center text-base text-slate-700"><Spinner /> Carregando…</div>
      )}

      {!loading && loadError && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 space-y-3">
          <p className="text-base font-semibold text-red-800">{loadError}</p>
          <Button size="md" variant="secondary" onClick={() => void load()}>Tentar novamente</Button>
        </div>
      )}

      {!loading && !loadError && (
        <div className="space-y-6">
          {!company && (
            <section ref={companyRef} aria-labelledby="company-block-title" data-testid="company-block"
              className={`scroll-mt-24 rounded-2xl border-2 bg-white p-5 md:p-6 shadow-sm ${companyRequired ? 'border-amber-500' : 'border-primary/40'}`}>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Passo 1 de 2</p>
              <h2 id="company-block-title" className="mt-1 text-lg font-bold text-slate-900">Dados da empresa</h2>
              <p className="mt-1 mb-5 text-sm text-slate-600">
                {companyRequired
                  ? 'Para publicar a vaga, salve primeiro os dados da sua empresa. O que você preencheu na vaga continua aqui.'
                  : 'Antes da primeira vaga, conte qual é a sua empresa. Você só precisa fazer isso uma vez.'}
              </p>
              <CompanyForm onSaved={c => { setCompany(c); setCompanyRequired(false) }} />
            </section>
          )}
          {company && (
            <p className="text-sm text-slate-600" data-testid="company-name">
              Publicando como <strong className="text-slate-900">{company.company_name}</strong>
            </p>
          )}
          <JobForm
            initial={EMPTY_JOB_FORM}
            companyName={company?.company_name}
            submitLabel="Publicar vaga"
            onSubmit={submit}
            onCancel={() => guard.navigate('/minhas-vagas')}
            onDirtyChange={setDirty}
            onCompanyRequired={revealCompany}
          />
        </div>
      )}
      <ConfirmModal {...guard.modal} />
    </RecruiterPageTemplate>
  )
}

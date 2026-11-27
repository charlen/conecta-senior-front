import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { Alerta } from '../components/molecules/Alerta'
import { CandidateMatchCard } from '../components/organisms/CandidateMatchCard'
import { companyJobsApi, CandidatesRequestError } from '../services/companyJobsApi'
import type { JobCandidatesResponse } from '../types/jobCandidates'

const FILTERS = [
  { value: 0, label: 'Todos' },
  { value: 60, label: '60% ou mais' },
  { value: 80, label: '80% ou mais' }
]

/** Reads the job id from /vagas/:id/candidatos. */
function jobIdFromPath(path: string): string {
  return decodeURIComponent(path.split('/')[2] ?? '')
}

function countLabel(n: number): string {
  if (n === 0) return 'Nenhum candidato encontrado'
  return n === 1 ? '1 candidato, do mais compatível para o menos' : `${n} candidatos, do mais compatível para o menos`
}

export default function CandidatosVagaPage() {
  const jobId = jobIdFromPath(window.location.pathname)
  const [data, setData] = useState<JobCandidatesResponse | null>(null)
  const [error, setError] = useState<{ message: string; status: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [minPercent, setMinPercent] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await companyJobsApi.listCandidates(jobId))
    } catch (err) {
      const status = err instanceof CandidatesRequestError ? err.status : 0
      const message = err instanceof Error ? err.message : 'Não conseguimos carregar os candidatos agora.'
      setError({ message, status })
    } finally {
      setLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    void load()
  }, [load])

  const visible = useMemo(
    () => (data?.candidates ?? []).filter(c => c.percent >= minPercent),
    [data, minPercent]
  )
  const jobTitle = data?.job.title || 'Vaga'
  const jobMeta = [data?.job.location, data?.job.modality].filter(Boolean).join(' · ')

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto py-10 px-4 md:px-10 space-y-8">
        <Button variant="secondary" onClick={() => (window.location.href = '/minhas-vagas')}>
          ← Voltar para minhas vagas
        </Button>

        <header className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.08)] p-8 md:p-10 space-y-3">
          <p className="text-xl font-semibold text-primary">Candidatos por compatibilidade</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 break-words">
            {data ? jobTitle : loading ? 'Carregando vaga…' : 'Candidatos da vaga'}
          </h1>
          {jobMeta && <p className="text-xl text-slate-600">{jobMeta}</p>}
          {data && data.vector_ready && (
            <p className="text-2xl text-slate-700" data-testid="candidates-count">{countLabel(data.total)}</p>
          )}
          {data && data.total > 0 && (
            <p className="text-lg text-slate-500">
              A compatibilidade compara o texto da vaga com o perfil de cada pessoa. Use como ponto de partida para a conversa.
            </p>
          )}
        </header>

        {loading && (
          <div className="flex items-center justify-center gap-4 py-16 text-xl text-slate-700">
            <Spinner /> Buscando os candidatos mais compatíveis…
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 space-y-6">
            <Alerta tipo="erro" titulo={error.status === 403 ? 'Acesso não permitido' : 'Algo deu errado'}>
              {error.message}
            </Alerta>
            <div className="flex flex-col gap-3 md:flex-row">
              {error.status !== 403 && error.status !== 404 && error.status !== 401 && (
                <Button variant="primary" onClick={() => void load()}>Tentar novamente</Button>
              )}
              {error.status === 401 ? (
                <Button variant="primary" onClick={() => (window.location.href = '/entrar')}>Entrar novamente</Button>
              ) : (
                <Button variant="secondary" onClick={() => (window.location.href = '/minhas-vagas')}>Ver minhas vagas</Button>
              )}
            </div>
          </div>
        )}

        {!loading && data && !data.vector_ready && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 md:p-10 text-center space-y-4">
            <p className="text-3xl font-bold text-slate-900">Estamos analisando esta vaga</p>
            <p className="text-xl text-slate-700">
              Assim que a análise terminar, mostraremos aqui as pessoas mais compatíveis. Volte em alguns minutos.
            </p>
            <Button variant="secondary" onClick={() => void load()}>Atualizar</Button>
          </div>
        )}

        {!loading && data && data.vector_ready && data.total === 0 && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 md:p-10 text-center space-y-4" data-testid="candidates-empty">
            <p className="text-3xl font-bold text-slate-900">Ainda não há candidatos para esta vaga</p>
            <p className="text-xl text-slate-700">
              Quando pessoas com perfil compatível se cadastrarem, elas aparecerão aqui, das mais compatíveis para as menos.
            </p>
            <Button variant="secondary" onClick={() => (window.location.href = `/vagas/editar/${jobId}`)}>
              Revisar a descrição da vaga
            </Button>
          </div>
        )}

        {!loading && data && data.total > 0 && (
          <section className="space-y-6" aria-label="Lista de candidatos">
            <div role="group" aria-label="Filtrar por compatibilidade" className="flex flex-wrap items-center gap-3">
              <span className="text-xl font-semibold text-slate-700">Mostrar:</span>
              {FILTERS.map(f => (
                <Button key={f.value} aria-pressed={minPercent === f.value} variant={minPercent === f.value ? 'primary' : 'secondary'}
                  className="!px-6" onClick={() => setMinPercent(f.value)}>
                  {f.label}
                </Button>
              ))}
            </div>
            {visible.map((c, i) => (
              <CandidateMatchCard key={c.profile_id} candidate={c} jobTitle={jobTitle} position={i + 1} />
            ))}
            {visible.length === 0 && (
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 text-center space-y-4">
                <p className="text-2xl font-bold text-slate-900">Nenhum candidato com {minPercent}% ou mais</p>
                <Button variant="secondary" onClick={() => setMinPercent(0)}>Mostrar todos</Button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

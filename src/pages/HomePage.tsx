import { useState, useEffect } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Heading } from '../components/atoms/Heading'
import { ConfirmModal } from '../components/molecules/ConfirmModal'
import { JobCard } from '../components/molecules/JobCard'
import { Avatar } from '../components/atoms/Avatar'
import { useAuth } from '../contexts/AuthContext'
import { jobsApi } from '../services/jobsApi'
import type { Profile } from '../types/profile'
import type { MatchedJob } from '../types/job'

export function HomePage() {
  const [query, setQuery] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<MatchedJob[]>([])
  const [matchingAvailable, setMatchingAvailable] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState<string | null>(null)
  const { setToken, token, role } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleLogout = () => {
    setToken(null)
    window.location.href = '/'
  }

  const openConfirm = () => setConfirmOpen(true)
  const closeConfirm = () => setConfirmOpen(false)

  useEffect(() => {
    if (!token) return
    fetch(`${import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'}/profiles/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        if (!data || !data.name) {
          const alreadyRedirected = sessionStorage.getItem('profile_redirected')
          if (!alreadyRedirected && window.location.pathname !== '/comecar/metodo') {
            sessionStorage.setItem('profile_redirected', '1')
            window.location.href = '/comecar/metodo'
          }
        } else {
          sessionStorage.removeItem('profile_redirected')
        }
      })
      .catch(() => {})
    let active = true
    setJobsLoading(true)
    setJobsError(null)
    jobsApi
      .matchMine()
      .then(data => {
        if (!active) return
        setJobs(data.jobs)
        setMatchingAvailable(data.matching_available)
      })
      .catch((err: Error) => {
        if (active) setJobsError(err.message)
      })
      .finally(() => {
        if (active) setJobsLoading(false)
      })
    return () => {
      active = false
    }
  }, [token])

  const normalizedQuery = query.trim().toLowerCase()
  const visibleJobs = jobs.filter(
    j =>
      !normalizedQuery ||
      j.title?.toLowerCase().includes(normalizedQuery) ||
      j.company?.toLowerCase().includes(normalizedQuery)
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Heading className="text-2xl">Conecta Sênior</Heading>
          <div className="flex gap-3">
            {role === 'company' && <Button variant="secondary" onClick={() => window.location.href = '/minhas-vagas'}>Minhas vagas</Button>}
            <Button variant="primary" onClick={openConfirm}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <aside id="perfil" className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col items-center gap-4">
              <Avatar src={profile?.photo_url || null} name={profile?.name || ''} size="lg" />
            </div>
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-500 uppercase tracking-wide">Olá</p>
                <h2 className="text-2xl font-bold mt-1">{profile?.name || 'Usuário'}</h2>
                <p className="text-slate-600 mt-1">{profile?.email || ''}</p>
                {profile?.bio && (
                  <p className="text-slate-700 mt-3 text-sm leading-relaxed">{profile.bio}</p>
                )}
              </div>
              <Button variant="primary" className="w-full" onClick={() => window.location.href = '/meu-perfil'}>Atualizar perfil profissional</Button>
            </div>
          </div>
        </aside>

        <section className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <Heading className="text-2xl mb-4">Buscar vagas</Heading>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Cargo, empresa ou palavra-chave" value={query} onChange={e => setQuery(e.target.value)} className="flex-1" />
              <Button variant="primary">Buscar</Button>
            </div>
          </div>

          {!jobsLoading && !jobsError && !matchingAvailable && (
            <div role="status" className="bg-amber-50 border-2 border-amber-600 rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-amber-950">Quer saber quais vagas combinam com você?</h2>
              <p className="text-xl text-amber-950 mt-2 leading-relaxed">
                Complete seu perfil profissional e mostraremos o quanto cada vaga é compatível com a sua experiência.
              </p>
              <Button variant="primary" className="mt-5 w-full md:w-auto" onClick={() => (window.location.href = '/meu-perfil')}>
                Completar meu perfil
              </Button>
            </div>
          )}

          {matchingAvailable && jobs.length > 0 && (
            <p className="text-xl text-slate-700">Vagas ordenadas da mais compatível para a menos compatível com o seu perfil.</p>
          )}

          <div className="space-y-4" aria-busy={jobsLoading}>
            {jobsLoading && <p className="text-xl text-slate-700">Carregando vagas…</p>}
            {jobsError && (
              <p role="alert" className="text-xl text-red-800 bg-red-50 border-2 border-red-700 rounded-2xl p-5">
                {jobsError}
              </p>
            )}
            {!jobsLoading && !jobsError && visibleJobs.length === 0 && (
              <p className="text-xl text-slate-700">
                {jobs.length === 0 ? 'Nenhuma vaga aberta no momento. Volte em breve!' : 'Nenhuma vaga encontrada para essa busca.'}
              </p>
            )}
            {visibleJobs.map(j => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </section>
      </main>
      <ConfirmModal
        open={confirmOpen}
        title="Sair"
        message="Tem certeza que deseja sair?"
        onConfirm={handleLogout}
        onCancel={closeConfirm}
      />
    </div>
  )
}

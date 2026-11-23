import { useState, useEffect } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Heading } from '../components/atoms/Heading'
import { ConfirmModal } from '../components/molecules/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import type { Profile } from '../types/profile'

type Job = {
  id: string
  title?: string
  description?: string
  company?: string
  location?: string
  modality?: string
  salary_min?: number
  salary_max?: number
  status?: string
  score?: number
}

export function HomePage() {
  const [query, setQuery] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
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
    fetch(`${import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'}/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const all = (data.jobs || []).map((j: Record<string, unknown>) => ({
          id: (j.id as string) ?? (j.ID as string),
          title: (j.title as string) ?? (j.Title as string),
          description: (j.description as string) ?? (j.Description as string),
          company: (j.company as string) ?? (j.Company?.CompanyName as string) ?? '',
          location: (j.location as string) ?? (j.Location as string),
          modality: (j.modality as string) ?? (j.Modality as string),
          salary_min: (j.salary_min as number) ?? (j.SalaryMin as number),
          salary_max: (j.salary_max as number) ?? (j.SalaryMax as number),
          status: (j.status as string) ?? (j.Status as string),
          score: (j.score as number) ?? 0,
        }))
        setJobs(all)
      })
      .catch(() => {})
  }, [token])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
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
              <img src="https://i.pravatar.cc/150?img=12" alt="Foto" className="w-28 h-28 rounded-full object-cover border-4 border-[#2563eb]/20" />
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
            <div className="flex gap-3">
              <Input placeholder="Cargo, empresa ou palavra-chave" value={query} onChange={e => setQuery(e.target.value)} className="flex-1" />
              <Button variant="primary">Buscar</Button>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.filter(j => !query || (j.title?.toLowerCase().includes(query.toLowerCase()) || j.company?.toLowerCase().includes(query.toLowerCase()))).map(j => (
              <div key={j.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold">{j.title} {j.company ? `— ${j.company}` : ''}</h3>
                <p className="text-slate-600 mt-2">{j.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
                  {j.location && <span className="px-3 py-1 bg-slate-100 rounded-full">{j.location}</span>}
                  {j.modality && <span className="px-3 py-1 bg-slate-100 rounded-full">{j.modality}</span>}
                </div>
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-semibold self-start">{j.score ?? 0}% compatível</span>
                  <Button variant="primary" className="w-full md:w-auto">Candidatar-me</Button>
                </div>
              </div>
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

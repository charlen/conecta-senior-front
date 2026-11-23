import { useEffect, useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Heading } from '../components/atoms/Heading'
import { useAuth } from '../contexts/AuthContext'

export default function MinhasVagasPage() {
  const { token, userName, userEmail } = useAuth()
  const [jobs, setJobs] = useState<unknown[]>([])
  const [company, setCompany] = useState<{name?: string; email?: string}>({})
  const [profile, setProfile] = useState<{name?: string; email?: string}>({})
  const API = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

  useEffect(() => {
    if (!token) return
    fetch(`${API}/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const all = data.jobs || []
        // filtra vagas da empresa logada se backend não filtrar
        setJobs(all)
      })
      .catch(() => {})
    fetch(`${API}/profiles/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setCompany({ name: data.companyName || data.name || userName, email: data.email || userEmail }))
      .catch(() => {})
    fetch(`${API}/profiles/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setProfile({ name: data.name, email: data.email }))
      .catch(() => {})
  }, [token, userName, userEmail])

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Heading className="text-2xl">Conecta Sênior</Heading>
          <Button variant="primary" onClick={() => window.location.href = '/vagas/nova'}>Incluir vaga</Button>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <img src="https://i.pravatar.cc/80?img=12" alt="Empresa" className="w-16 h-16 rounded-full object-cover border-4 border-[#2563eb]/20" />
          <div>
            <Heading className="text-3xl">{profile.name || company.name || userName || (userEmail ? userEmail.split('@')[0] : 'Empresa')}</Heading>
            <p className="text-slate-600">{profile.email || company.email || userEmail || ''}</p>
          </div>
        </div>
        <div className="space-y-4">
          {jobs.map(j => (
            <div key={j.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold">{j.title}</h3>
              <p className="text-slate-600 mt-2">{j.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
                {j.location && <span className="px-3 py-1 bg-slate-100 rounded-full">{j.location}</span>}
                {j.modality && <span className="px-3 py-1 bg-slate-100 rounded-full">{j.modality}</span>}
                {j.status && <span className={`px-3 py-1 rounded-full ${j.status === 'open' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{j.status}</span>}
                {(j.salary_min || j.salary_max) && <span className="px-3 py-1 bg-slate-100 rounded-full">R$ {j.salary_min ?? ''} - {j.salary_max ?? ''}</span>}
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="secondary" onClick={() => window.location.href = `/vagas/editar/${j.id}`}>Editar</Button>
                <Button variant="secondary" onClick={() => window.location.href = `/vagas/${j.id}/candidatos`}>Candidatos</Button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-slate-600 text-center py-12">Nenhuma vaga cadastrada.</p>}
        </div>
      </div>
    </div>
  )
}
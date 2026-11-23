import { useEffect, useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Heading } from '../components/atoms/Heading'
import { useAuth } from '../contexts/AuthContext'

export default function MinhasVagasPage() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState<unknown[]>([])
  const [company, setCompany] = useState<{name?: string; email?: string}>({})
  const API = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

  useEffect(() => {
    if (!token) return
    fetch(`${API}/jobs/company`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setJobs(data.jobs || []))
      .catch(() => {})
    fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setCompany({ name: data.companyName || data.name, email: data.email }))
      .catch(() => {})
  }, [token])

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
            <Heading className="text-3xl">{company.name || 'Empresa'}</Heading>
            <p className="text-slate-600">{company.email || ''}</p>
          </div>
        </div>
        <div className="space-y-4">
          {jobs.map(j => (
            <div key={j.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold">{j.title}</h3>
              <p className="text-slate-600 mt-2">{j.description}</p>
              <div className="mt-4 flex gap-3">
                <Button variant="secondary" onClick={() => window.location.href = `/vagas/editar/${j.id}`}>Editar</Button>
                <Button variant="secondary" onClick={() => window.location.href = `/vagas/${j.id}/candidatos`}>Candidatos</Button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-slate-600">Nenhuma vaga cadastrada.</p>}
        </div>
      </div>
    </div>
  )
}
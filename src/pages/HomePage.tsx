import { useState, useEffect } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { mockJobs } from '../mocks/data'
import { useAuth } from '../contexts/AuthContext'

export function HomePage() {
  const [query, setQuery] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const { setToken, token } = useAuth()
  const jobs = mockJobs.filter(j => !query || j.cargo.toLowerCase().includes(query.toLowerCase()) || j.empresa.toLowerCase().includes(query.toLowerCase()))

  const handleLogout = () => {
    setToken(null)
    window.location.href = '/'
  }

  useEffect(() => {
    if (!token) return
    fetch(`${import.meta.env.VITE_API_URL || ''}/profiles/me`, {
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
  }, [token])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Heading className="text-2xl">Conecta Sênior</Heading>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleLogout}>Sair</Button>
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
            {jobs.map(j => (
              <div key={j.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold">{j.cargo} — {j.empresa}</h3>
                <p className="text-slate-600 mt-2">{j.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-semibold">{j.score}% compatível</span>
                  <Button variant="primary">Candidatar-me</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

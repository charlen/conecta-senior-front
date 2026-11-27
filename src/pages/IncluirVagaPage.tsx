import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { useAuth } from '../contexts/AuthContext'
import { Dropdown } from '../components/molecules/Dropdown'

export default function IncluirVagaPage() {
  const { token } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [modality, setModality] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [status, setStatus] = useState('open')
  const [loading, setLoading] = useState(false)
  const API = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // tenta obter company_id do usuário
      let companyId = undefined
      try {
        const meRes = await fetch(`${API}/profiles/me`, { headers: { Authorization: `Bearer ${token}` } })
        const me = await meRes.json()
        companyId = me.company_id || me.companyId
      } catch {
        // ignore
      }
      if (!companyId) {
        // fallback: cria empresa com nome do usuário
        const createRes = await fetch(`${API}/companies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: 'Empresa' })
        })
        const created = await createRes.json()
        companyId = created.id
      }
      const res = await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, company_id: companyId, location, modality, salary_min: salaryMin ? Number(salaryMin) : null, salary_max: salaryMax ? Number(salaryMax) : null, status })
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Falha ao criar vaga')
      }
      window.location.href = '/minhas-vagas'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <Heading className="text-3xl mb-6">Incluir vaga</Heading>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-xl p-3" rows={6} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Localização</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="modality">Modalidade</Label>
              <Input id="modality" value={modality} onChange={e => setModality(e.target.value)} placeholder="Presencial/Remoto/Híbrido" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salaryMin">Salário mínimo</Label>
              <Input id="salaryMin" type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="salaryMax">Salário máximo</Label>
              <Input id="salaryMax" type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Dropdown id="status" value={status} onChange={setStatus}
              options={[
                { value: 'open', label: 'Aberta', hint: 'Recebe candidaturas' },
                { value: 'freeze', label: 'Congelada', hint: 'Pausada, sem novas candidaturas' },
                { value: 'close', label: 'Fechada', hint: 'Encerrada' }
              ]} />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => window.location.href = '/minhas-vagas'}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar vaga'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
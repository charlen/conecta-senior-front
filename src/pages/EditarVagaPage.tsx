import { useEffect, useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { useAuth } from '../contexts/AuthContext'

export default function EditarVagaPage() {
  const { token } = useAuth()
  const API = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'
  const id = window.location.pathname.split('/vagas/editar/')[1]
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [modality, setModality] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [status, setStatus] = useState('open')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token || !id) return
    fetch(`${API}/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const j = data.job || data
        setTitle(j.title ?? j.Title ?? '')
        setDescription(j.description ?? j.Description ?? '')
        setLocation(j.location ?? j.Location ?? '')
        setModality(j.modality ?? j.Modality ?? '')
        setSalaryMin(j.salary_min ?? j.SalaryMin ?? '')
        setSalaryMax(j.salary_max ?? j.SalaryMax ?? '')
        setStatus(j.status ?? j.Status ?? 'open')
      })
      .catch(() => {})
  }, [token, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API}/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          description,
          location,
          modality,
          salary_min: salaryMin ? Number(salaryMin) : null,
          salary_max: salaryMax ? Number(salaryMax) : null,
          status
        })
      })
      if (!res.ok) throw new Error('Falha ao atualizar')
      window.location.href = '/minhas-vagas'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <Heading className="text-3xl mb-6">Editar vaga</Heading>
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
            <select id="status" value={status} onChange={e => setStatus(e.target.value)} className="w-full border rounded-xl p-3">
              <option value="open">Aberta</option>
              <option value="freeze">Congelada</option>
              <option value="close">Fechada</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => window.location.href = '/minhas-vagas'}>Voltar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

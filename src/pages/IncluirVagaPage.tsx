import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { useAuth } from '../contexts/AuthContext'

export default function IncluirVagaPage() {
  const { token } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const API = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description })
      })
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
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => window.location.href = '/minhas-vagas'}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar vaga'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
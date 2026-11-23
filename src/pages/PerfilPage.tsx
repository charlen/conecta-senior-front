import { useEffect, useState } from 'react'
import { Heading } from '../components/atoms/Heading'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Button } from '../components/atoms/Button'

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/'
      return
    }
    fetch(`${import.meta.env.VITE_API_URL || ''}/profiles/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Heading className="text-3xl mb-6">Meu Perfil</Heading>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div>
            <Label>Nome</Label>
            <Input value={profile?.name || ''} placeholder="Seu nome completo" />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input value={profile?.email || ''} readOnly />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input placeholder="(11) 99999-9999" />
          </div>
          <div>
            <Label>Experiência profissional</Label>
            <Input placeholder="Ex: 30 anos em..." />
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => window.location.href = '/vagas'}>Salvar e voltar</Button>
            <Button variant="secondary" onClick={() => window.location.href = '/comecar/metodo'}>Continuar preenchimento</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

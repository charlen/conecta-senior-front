import { useEffect, useState } from 'react'
import { Heading } from '../components/atoms/Heading'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Button } from '../components/atoms/Button'

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)

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
        setName(data.name || '')
        setPhone(data.phone || '')
        setBio(data.bio || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setSaving(true)
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/profiles/me`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, phone, bio })
      })
      window.location.href = '/vagas'
    } catch {}
    setSaving(false)
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Heading className="text-3xl mb-6">Meu Perfil</Heading>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <img src="https://i.pravatar.cc/150?img=12" alt="Foto" className="w-28 h-28 rounded-full object-cover border-4 border-[#2563eb]/20" />
            <Button variant="secondary" className="w-full">Atualizar foto</Button>
          </div>
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo" />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input value={profile?.email || ''} readOnly />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
          </div>
          <div>
            <Label>Experiência profissional</Label>
            <Input value={bio} onChange={e => setBio(e.target.value)} placeholder="Ex: 30 anos em..." />
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="primary" className="w-full" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar e voltar'}</Button>
            <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/comecar/metodo'}>Continuar preenchimento</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { Alerta } from '../components/molecules/Alerta'
import { authApi } from '../services/authApi'

export default function EntrarPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Para simplificar, usamos login com senha. Em produção seria envio de link.
      // Aqui mantemos fluxo de login existente do backend.
      await authApi.login({ email, password: '' })
      // Backend exige senha, então este fluxo é placeholder.
      // Em implementação real, enviar e-mail para novo link.
      setError('Envie seu e-mail para receber link de acesso')
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow">
        <Heading>Entrar</Heading>
        <p className="text-lg text-text-secondary mt-2">Informe seu e-mail para receber link de acesso</p>
        {error && <Alerta tipo="erro" className="mt-4">{error}</Alerta>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link'}
          </Button>
        </form>
      </div>
    </div>
  )
}

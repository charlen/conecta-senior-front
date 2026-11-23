import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { Alerta } from '../components/molecules/Alerta'
import { authApi } from '../services/authApi'

export default function EntrarPage() {
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/users/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erro ao solicitar código')
      }
      setSuccess('Código enviado para seu e-mail!')
      setStep('code')
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/users/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Código inválido')
      }
      const data = await res.json()
      localStorage.setItem('token', data.token)
      window.location.href = '/vagas'
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
        {step === 'email' ? (
          <>
            <p className="text-lg text-text-secondary mt-2">Informe seu e-mail para receber código de acesso</p>
            {error && <Alerta tipo="erro" className="mt-4">{error}</Alerta>}
            {success && <Alerta tipo="sucesso" className="mt-4">{success}</Alerta>}
            <form onSubmit={handleRequestCode} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar código'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-lg text-text-secondary mt-2">Digite o código de 6 dígitos enviado para {email}</p>
            {error && <Alerta tipo="erro" className="mt-4">{error}</Alerta>}
            <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="code">Código</Label>
                <Input id="code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value)} required />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar código'}
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setStep('email')}>
                Alterar e-mail
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

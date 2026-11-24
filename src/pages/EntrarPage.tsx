import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { Alerta } from '../components/molecules/Alerta'
import { useAuth } from '../contexts/AuthContext'

export default function EntrarPage() {
  const [mode, setMode] = useState<'code' | 'password'>('code')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const API = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'
  const { setToken } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      if (mode === 'password') {
        const res = await fetch(`${API}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        if (!res.ok) {
          throw new Error('Usuário e/ou senha inválidos')
        }
        const data = await res.json()
        setToken(data.token)
        window.location.href = '/vagas'
      } else {
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
      }
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
      setToken(data.token)
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
        <Heading className="text-3xl">{mode === 'code' ? 'Entrar com código único' : 'Entrar com usuário e senha'}</Heading>
        {step === 'email' ? (
          <>
            <p className="text-lg text-text-secondary mt-2">{mode === 'code' ? 'Informe seu e-mail para receber código de acesso' : 'Informe seu e-mail e senha para entrar'}</p>
            {error && <Alerta tipo="erro" className="mt-4">{error}</Alerta>}
            {success && <Alerta tipo="sucesso" className="mt-4">{success}</Alerta>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {mode === 'password' && (
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              )}
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? (mode === 'code' ? 'Enviando...' : 'Entrando...') : (mode === 'code' ? 'Enviar código' : 'Entrar')}
              </Button>
            </form>
            <button type="button" onClick={() => setMode(mode === 'code' ? 'password' : 'code')} className="w-full pt-4 text-blue-600 text-lg cursor-pointer hover:text-blue-800 hover:no-underline">
              {mode === 'code' ? 'Entrar com Usuário e Senha' : 'Entrar com código único'}
            </button>
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
      <button onClick={() => window.location.href = '/'} className="mt-4 text-slate-600 hover:text-slate-900 cursor-pointer">← Voltar para início</button>
    </div>
  )
}

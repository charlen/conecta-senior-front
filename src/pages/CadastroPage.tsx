import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { Alerta } from '../components/molecules/Alerta'
import { authApi } from '../services/authApi'
import { useAuth } from '../contexts/AuthContext'

export default function CadastroPage() {
  const [step, setStep] = useState<'tipo' | 'email' | 'form' | 'code'>('tipo')
  const [tipo, setTipo] = useState<'candidato' | 'empresa' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const API = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'
  const { setToken } = useAuth()

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/users/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (err.error === 'user not found') {
          setStep('form')
        } else {
          throw new Error(err.error || 'Erro ao verificar e-mail')
        }
      } else {
        setStep('code')
      }
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    setLoading(true)
    try {
      await authApi.register({ email, password, role: tipo === 'empresa' ? 'company' : 'candidate' })
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow">
        <button onClick={() => window.location.href = '/'} className="mb-4 text-slate-600 hover:text-slate-900 cursor-pointer">← Voltar para início</button>
        {step === 'tipo' ? (
          <>
            <Heading className="text-3xl">Cadastro</Heading>
            <p className="text-lg text-text-secondary mt-2">Como você quer se cadastrar?</p>
            <div className="mt-6 space-y-4">
              <Button variant="primary" className="w-full text-xl py-5" onClick={() => { setTipo('candidato'); setStep('email') }}>
                Sou candidato
              </Button>
              <Button variant="secondary" className="w-full text-xl py-5" onClick={() => { setTipo('empresa'); setStep('email') }}>
                Sou empresa
              </Button>
            </div>
          </>
        ) : step === 'email' ? (
          <>
            <Heading className="text-3xl">Cadastro {tipo === 'empresa' ? 'Empresa' : 'Candidato'}</Heading>
            <p className="text-lg text-text-secondary mt-2">Informe seu e-mail para continuar</p>
            {error && <Alerta tipo="erro" className="mt-4">{error}</Alerta>}
            <form onSubmit={handleEmailCheck} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setStep('tipo')}>
                Voltar
              </Button>
            </form>
          </>
        ) : step === 'code' ? (
          <>
            <Heading className="text-3xl">E-mail já cadastrado</Heading>
            <p className="text-lg text-text-secondary mt-2">Enviamos um código para {email}</p>
            {error && <Alerta tipo="erro" className="mt-4">{error}</Alerta>}
            <form onSubmit={async e => {
              e.preventDefault()
              setLoading(true)
              try {
                const res = await fetch(`${API}/users/verify-code`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, code })
                })
                if (!res.ok) throw new Error('Código inválido')
                const data = await res.json()
                setToken(data.token)
                window.location.href = '/vagas'
              } catch (err: unknown) {
                setError((err as Error).message)
              } finally {
                setLoading(false)
              }
            }} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="code">Código de 6 dígitos</Label>
                <Input id="code" value={code} onChange={e => setCode(e.target.value)} required />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Entrar'}
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/'}>
                Ir para login
              </Button>
            </form>
          </>
        ) : (
          <>
            <Heading className="text-3xl">Cadastro {tipo === 'empresa' ? 'Empresa' : 'Candidato'}</Heading>
            <p className="text-lg text-text-secondary mt-2">Crie sua conta para começar</p>
            {success && <Alerta tipo="sucesso" className="mt-4">Cadastro realizado! Confira seu e-mail para confirmar.</Alerta>}
            {error && <Alerta tipo="erro" className="mt-4">{error}</Alerta>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Cadastrar'}
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setStep('email')}>
                Voltar
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

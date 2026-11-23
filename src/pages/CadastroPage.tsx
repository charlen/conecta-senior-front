import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Heading } from '../components/atoms/Heading'
import { Alerta } from '../components/molecules/Alerta'
import { authApi } from '../services/authApi'

export default function CadastroPage() {
  const [step, setStep] = useState<'tipo' | 'form'>('tipo')
  const [tipo, setTipo] = useState<'candidato' | 'empresa' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.register({ email, password })
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
        {step === 'tipo' ? (
          <>
            <Heading>Cadastro</Heading>
            <p className="text-lg text-text-secondary mt-2">Como você quer se cadastrar?</p>
            <div className="mt-6 space-y-4">
              <Button variant="primary" className="w-full text-xl py-5" onClick={() => { setTipo('candidato'); setStep('form') }}>
                Sou candidato
              </Button>
              <Button variant="secondary" className="w-full text-xl py-5" onClick={() => { setTipo('empresa'); setStep('form') }}>
                Sou empresa
              </Button>
            </div>
          </>
        ) : (
          <>
            <Heading>Cadastro {tipo === 'empresa' ? 'Empresa' : 'Candidato'}</Heading>
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
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Cadastrar'}
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setStep('tipo')}>
                Voltar
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

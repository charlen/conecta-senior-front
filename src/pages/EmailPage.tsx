import { HeroPageTemplate } from '../components/templates/HeroPageTemplate'
import { useFlow } from '../hooks/useFlow'
import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

export function EmailPage() {
  const { state, updateEmail, nextStep } = useFlow()
  const email = state.email || ''
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = async () => {
    if (!isValid) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Temp@1234' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao registrar')
      // Registro feito, avança para coleta de dados
      nextStep()
    } catch (e: unknown) {
      setError((e as Error).message || 'Erro ao registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <HeroPageTemplate
      step={1}
      total={8}
      title="Seja bem vindo"
      subtitle="Informe seu melhor e-mail para continuarmos. Futuramente você poderá fazer login com senha."
    >
      <div className="space-y-8">
        <div className="max-w-xl">
          <label className="block text-lg font-semibold text-slate-900 mb-3">Informe o seu melhor email, ele é muito importante para receber alertas de vagas</label>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            className="text-xl"
          />
          <p className="text-slate-600 mt-3 text-lg">
            Mock: neste momento aceitamos qualquer e-mail. Em breve verificaremos cadastro e pediremos senha.
          </p>
          {error && <p className="text-red-600 mt-3 text-lg">{error}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" onClick={handleContinue} className="w-full sm:flex-1 text-xl py-5" disabled={!isValid || loading}>
            {loading ? 'Enviando...' : 'Continuar'}
          </Button>
        </div>
      </div>
    </HeroPageTemplate>
  )
}

import { HeroPageTemplate } from '../components/templates/HeroPageTemplate'
import { useEffect, useState } from 'react'
import { useFlow } from '../hooks/useFlow'

const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

export function ConfirmPage() {
  const { nextStep } = useFlow()
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMsg('Token não encontrado')
      return
    }
    fetch(`${API_URL}/users/confirm?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (!data.token) throw new Error(data.error || 'Falha na confirmação')
        localStorage.setItem('token', data.token)
        localStorage.setItem('user_id', data.user_id)
        setStatus('success')
        setMsg('Conta confirmada! Bem-vindo(a).')
        setTimeout(() => nextStep(), 1200)
      })
      .catch(e => {
        setStatus('error')
        setMsg(e.message || 'Erro ao confirmar')
      })
  }, [nextStep])

  return (
    <HeroPageTemplate step={1} total={8} title="Confirmando sua conta" subtitle="Aguarde um instante">
      <div className="max-w-xl text-center space-y-6">
        {status === 'loading' && <p className="text-xl">Confirmando seu e-mail...</p>}
        {status === 'success' && <p className="text-xl text-green-600">{msg}</p>}
        {status === 'error' && <p className="text-xl text-red-600">{msg}</p>}
      </div>
    </HeroPageTemplate>
  )
}

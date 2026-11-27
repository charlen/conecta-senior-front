import { HeroPageTemplate } from '../components/templates/HeroPageTemplate'
import { homePathFor, roleFromToken } from '../utils/roles'
import { useEffect, useState } from 'react'
import { useFlow } from '../hooks/useFlow'
import { Button } from '../components/atoms/Button'

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
    // Se já temos JWT salvo, evita re-chamada que retornaria invalid token
    const existingToken = localStorage.getItem('token')
    if (existingToken) {
      setStatus('success')
      setMsg('Conta já confirmada. Bem-vindo(a).')
      window.location.href = homePathFor(roleFromToken(localStorage.getItem('token')))
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
        window.location.href = homePathFor(roleFromToken(localStorage.getItem('token')))
      })
      .catch(e => {
        // Se token já foi consumido, mas temos JWT salvo, trata como sucesso
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
          setStatus('success')
          setMsg('Conta já confirmada. Bem-vindo(a).')
          window.location.href = homePathFor(roleFromToken(localStorage.getItem('token')))
          return
        }
        setStatus('error')
        setMsg(e.message || 'Erro ao confirmar')
      })
  }, [])

  return (
    <HeroPageTemplate step={1} total={8} title="Confirmando sua conta" subtitle="Aguarde um instante">
      <div className="max-w-xl text-center space-y-6">
        {status === 'loading' && <p className="text-xl">Confirmando seu e-mail...</p>}
        {status === 'success' && (<><p className="text-xl text-green-600">{msg}</p><Button variant="primary" onClick={nextStep} className="w-full text-xl py-5">Continuar cadastro</Button></>)}
        {status === 'error' && <p className="text-xl text-red-600">{msg}</p>}
      </div>
    </HeroPageTemplate>
  )
}

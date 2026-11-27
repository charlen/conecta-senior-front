import { useEffect, useState } from 'react'
import { Heading } from '../components/atoms/Heading'
import { Spinner } from '../components/atoms/Spinner'
import { Alerta } from '../components/molecules/Alerta'
import { authApi } from '../services/authApi'
import { useAuth } from '../hooks/useAuth'

export default function VerificarPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const { setSession } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Token não encontrado')
      return
    }
    authApi.confirm(token)
      .then(res => {
        setSession(res.token, res.user_id)
        setStatus('success')
        setMessage('Conta confirmada! Redirecionando...')
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.message || 'Token inválido ou expirado')
      })
  }, [setSession])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow text-center">
        <Heading>Verificando</Heading>
        {status === 'loading' && <Spinner className="mx-auto mt-6" />}
        {status === 'error' && <Alerta tipo="erro" className="mt-6">{message}</Alerta>}
        {status === 'success' && <Alerta tipo="sucesso" className="mt-6">{message}</Alerta>}
      </div>
    </div>
  )
}

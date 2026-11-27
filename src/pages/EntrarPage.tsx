import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Alerta } from '../components/molecules/Alerta'
import { CodeField } from '../components/molecules/CodeField'
import { EmailField } from '../components/molecules/EmailField'
import { ProfileField, inputClass } from '../components/molecules/ProfileField'
import { ResendCode } from '../components/molecules/ResendCode'
import { ShowPasswordToggle } from '../components/molecules/ShowPasswordToggle'
import { AuthStepTemplate } from '../components/templates/AuthStepTemplate'
import { useAuth } from '../contexts/AuthContext'
import { isValidEmail, useFieldError } from '../hooks/useFieldError'
import { AuthApiError, authApi } from '../services/authApi'

type Field = 'email' | 'password' | 'code'

const linkClass = 'font-semibold text-primary underline underline-offset-4 hover:text-primary-dark'

export default function EntrarPage() {
  const [mode, setMode] = useState<'code' | 'password'>('code')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { errorFor, fail, clear, refFor } = useFieldError<Field>()
  const { setToken } = useAuth()

  const switchMode = (next: 'code' | 'password') => {
    clear()
    setStep('email')
    setMode(next)
  }

  /** Validates the e-mail field; returns the trimmed value or null (and focuses the field). */
  const checkEmail = () => {
    const value = email.trim()
    setEmail(value)
    if (!value) {
      fail('email', 'Digite seu e-mail para continuar.')
      return null
    }
    if (!isValidEmail(value)) {
      fail('email', 'Confira o e-mail: ele precisa ter @ e um ponto, como maria.silva@gmail.com.')
      return null
    }
    return value
  }

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    clear()
    const value = checkEmail()
    if (!value) return
    setLoading(true)
    try {
      await authApi.requestCode(value)
      setCode('')
      setStep('code')
    } catch (err) {
      const notFound = err instanceof AuthApiError && err.code === 'user not found'
      fail(notFound ? 'email' : 'general', notFound ? 'Não encontramos uma conta com este e-mail. Confira se digitou certo ou crie uma conta.' : (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clear()
    const value = checkEmail()
    if (!value) return
    if (!password) return fail('password', 'Digite sua senha.')
    setLoading(true)
    try {
      const data = await authApi.login({ email: value, password })
      setToken(data.token)
      window.location.href = '/vagas'
    } catch {
      fail('password', 'E-mail ou senha incorretos. Confira e tente de novo, ou entre com um código por e-mail.')
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    clear()
    if (code.length !== 6) return fail('code', 'Digite os 6 números do código que chegou no seu e-mail.')
    setLoading(true)
    try {
      const data = await authApi.verifyCode(email, code)
      setToken(data.token)
      window.location.href = '/vagas'
    } catch (err) {
      const apiCode = err instanceof AuthApiError ? err.code : undefined
      fail(apiCode === 'invalid code' || apiCode === 'code expired' ? 'code' : 'general', (err as Error).message)
      setLoading(false)
    }
  }

  const resend = async () => {
    await authApi.requestCode(email)
    clear()
  }

  const general = errorFor('general') && <Alerta tipo="erro" className="mb-6">{errorFor('general')}</Alerta>
  const footer = (
    <p>
      Ainda não tem conta? <a href="/cadastro" className={linkClass}>Criar conta</a>
    </p>
  )
  const toHome = () => (window.location.href = '/')

  if (mode === 'password') {
    const type = showPassword ? 'text' : 'password'
    return (
      <AuthStepTemplate title="Entrar com senha" description="Digite seu e-mail e a senha que você criou." onBack={() => switchMode('code')} footer={footer}>
        {general}
        <form onSubmit={handlePasswordLogin} noValidate className="space-y-6">
          <EmailField value={email} onChange={setEmail} error={errorFor('email')} inputRef={refFor('email')} hint="O mesmo e-mail do cadastro." />
          <ProfileField id="password" label="Senha" error={errorFor('password')} required hideRequirement>
            {a => <input {...a} ref={refFor('password')} type={type} autoComplete="current-password" className={inputClass(errorFor('password'))} value={password} onChange={e => setPassword(e.target.value)} />}
          </ProfileField>
          <ShowPasswordToggle checked={showPassword} onChange={setShowPassword} />
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-8 rounded-3xl border-2 border-slate-200 bg-slate-50 p-6">
          <p className="text-xl font-bold text-slate-900">Esqueceu a senha?</p>
          <p className="mt-2 text-lg text-slate-700">Sem problema: você pode entrar com um código enviado para o seu e-mail.</p>
          <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => switchMode('code')}>
            Receber código por e-mail
          </Button>
        </div>
      </AuthStepTemplate>
    )
  }

  if (step === 'email') {
    return (
      <AuthStepTemplate
        title="Qual é o seu e-mail?"
        description="Vamos enviar um código de acesso para ele. Você não precisa lembrar de senha."
        step={{ current: 1, total: 2 }}
        onBack={toHome}
        backLabel="Voltar para o início"
        footer={footer}
      >
        {general}
        <form onSubmit={handleRequestCode} noValidate className="space-y-8">
          <EmailField value={email} onChange={setEmail} error={errorFor('email')} inputRef={refFor('email')} hint="O mesmo e-mail do cadastro." />
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Receber código por e-mail'}
          </Button>
        </form>
        <div className="my-8 flex items-center gap-4 text-lg text-slate-600" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-300" />
          ou
          <span className="h-px flex-1 bg-slate-300" />
        </div>
        <Button type="button" variant="secondary" className="w-full" onClick={() => switchMode('password')}>
          Prefiro entrar com minha senha
        </Button>
      </AuthStepTemplate>
    )
  }

  return (
    <AuthStepTemplate
      title="Digite o código que enviamos"
      description={<>Enviamos um código de 6 números para <strong className="[overflow-wrap:anywhere]">{email}</strong>.</>}
      step={{ current: 2, total: 2 }}
      onBack={() => { clear(); setStep('email') }}
      footer={footer}
    >
      {general}
      <form onSubmit={handleVerifyCode} noValidate className="space-y-8">
        <CodeField value={code} onChange={setCode} error={errorFor('code')} inputRef={refFor('code')} />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Verificando...' : 'Entrar'}
        </Button>
      </form>
      <div className="mt-8 space-y-4">
        <ResendCode onResend={resend} />
        <button type="button" onClick={() => { clear(); setStep('email') }} className={`min-h-[48px] cursor-pointer text-xl ${linkClass}`}>
          Usar outro e-mail
        </button>
      </div>
    </AuthStepTemplate>
  )
}

import { useState } from 'react'
import { homePathFor, roleFromToken } from '../utils/roles'
import { Button } from '../components/atoms/Button'
import { Alerta } from '../components/molecules/Alerta'
import { CartaoOpcao } from '../components/molecules/CartaoOpcao'
import { CodeField } from '../components/molecules/CodeField'
import { EmailField } from '../components/molecules/EmailField'
import { ProfileField, inputClass } from '../components/molecules/ProfileField'
import { ResendCode } from '../components/molecules/ResendCode'
import { ShowPasswordToggle } from '../components/molecules/ShowPasswordToggle'
import { AuthStepTemplate } from '../components/templates/AuthStepTemplate'
import { useAuth } from '../contexts/AuthContext'
import { isValidEmail, useFieldError } from '../hooks/useFieldError'
import { AuthApiError, authApi } from '../services/authApi'

type Step = 'tipo' | 'email' | 'senha' | 'codigo'
type Field = 'email' | 'password' | 'confirm' | 'code'

const MIN_PASSWORD = 8 // mesma regra do backend (cadastro e troca de senha)
const linkClass = 'font-semibold text-primary underline underline-offset-4 hover:text-primary-dark'

export default function CadastroPage() {
  const [step, setStep] = useState<Step>('tipo')
  const [tipo, setTipo] = useState<'candidato' | 'empresa' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState('')
  const [needsPassword, setNeedsPassword] = useState<boolean | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { errorFor, fail, clear, refFor } = useFieldError<Field>()
  const { setToken } = useAuth()

  const go = (next: Step) => {
    clear()
    setInfo(null)
    setStep(next)
  }

  const codeSent = () => {
    localStorage.setItem(`cadastro_${email}`, 'sent')
    setCode('')
    clear()
    setStep('codigo')
  }

  const chooseTipo = (t: 'candidato' | 'empresa') => {
    setTipo(t)
    go('email')
  }

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    clear()
    setInfo(null)
    const value = email.trim()
    setEmail(value)
    if (!value) return fail('email', 'Digite seu e-mail para continuar.')
    if (!isValidEmail(value)) return fail('email', 'Confira o e-mail: ele precisa ter @ e um ponto, como maria.silva@gmail.com.')
    setLoading(true)
    try {
      const data = await authApi.requestCode(value)
      setNeedsPassword(false)
      if (data.message === 'code resent') {
        setInfo('Você já tinha começado o cadastro com este e-mail. Enviamos um novo código para terminar.')
      } else if (data.message === 'code sent') {
        setInfo('Este e-mail já tem cadastro. Enviamos um código para você entrar.')
      }
      localStorage.setItem(`cadastro_${value}`, 'sent')
      setCode('')
      setStep('codigo')
    } catch (err) {
      if (err instanceof AuthApiError && err.code === 'user not found') {
        setNeedsPassword(true)
        go('senha')
      } else {
        fail('general', (err as Error).message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    clear()
    if (password.length < MIN_PASSWORD) return fail('password', `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`)
    if (password !== confirmPassword) return fail('confirm', 'As duas senhas não estão iguais. Digite a mesma senha de novo.')
    setLoading(true)
    try {
      const data = await authApi.register({ email, password, role: tipo === 'empresa' ? 'company' : 'candidate' })
      setInfo(data.message === 'code resent for pending account' ? 'Você já tinha começado o cadastro. Enviamos um novo código para terminar.' : null)
      codeSent()
    } catch (err) {
      fail('general', (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    clear()
    if (code.length !== 6) return fail('code', 'Digite os 6 números do código que chegou no seu e-mail.')
    setLoading(true)
    try {
      const data = await authApi.verifyCode(email, code)
      setToken(data.token)
      window.location.href = homePathFor(roleFromToken(data.token))
    } catch (err) {
      const apiCode = err instanceof AuthApiError ? err.code : undefined
      fail(apiCode === 'invalid code' || apiCode === 'code expired' ? 'code' : 'general', (err as Error).message)
      setLoading(false)
    }
  }

  const resend = async () => {
    await authApi.requestCode(email)
    clear()
    setInfo(null)
  }

  const general = errorFor('general') && <Alerta tipo="erro" className="mb-6">{errorFor('general')}</Alerta>
  const footer = (
    <p>
      Já tem conta? <a href="/entrar" className={linkClass}>Entrar</a>
    </p>
  )
  const total = needsPassword === false ? 3 : 4

  if (step === 'tipo') {
    return (
      <AuthStepTemplate
        title="Como você quer usar o Conecta Sênior?"
        description="Escolha uma opção. Você poderá voltar e trocar."
        step={{ current: 1, total }}
        onBack={() => (window.location.href = '/')}
        backLabel="Voltar para o início"
        footer={footer}
      >
        <div className="space-y-4">
          <CartaoOpcao
            titulo="Quero encontrar um trabalho"
            descricao="Para pessoas com 60 anos ou mais que buscam vagas."
            selecionado={tipo === 'candidato'}
            aria-pressed={tipo === 'candidato'}
            onClick={() => chooseTipo('candidato')}
          />
          <CartaoOpcao
            titulo="Quero contratar"
            descricao="Para empresas que querem divulgar vagas."
            selecionado={tipo === 'empresa'}
            aria-pressed={tipo === 'empresa'}
            onClick={() => chooseTipo('empresa')}
          />
        </div>
      </AuthStepTemplate>
    )
  }

  if (step === 'email') {
    return (
      <AuthStepTemplate
        title={tipo === 'empresa' ? 'Qual é o e-mail da empresa?' : 'Qual é o seu e-mail?'}
        description="Vamos enviar um código para ele. Use um e-mail que você consegue abrir agora."
        step={{ current: 2, total }}
        onBack={() => go('tipo')}
        footer={footer}
      >
        {general}
        <form onSubmit={handleEmailCheck} noValidate className="space-y-8">
          <EmailField value={email} onChange={setEmail} error={errorFor('email')} inputRef={refFor('email')} />
          <p className="text-lg leading-relaxed text-slate-700">
            Ao continuar, você concorda com os{' '}
            <a href="/termos" target="_blank" rel="noopener" className="underline underline-offset-4 text-primary">Termos de Uso</a>{' '}
            e com a{' '}
            <a href="/privacidade" target="_blank" rel="noopener" className="underline underline-offset-4 text-primary">Política de Privacidade</a>.
          </p>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Verificando...' : 'Continuar'}
          </Button>
        </form>
      </AuthStepTemplate>
    )
  }

  if (step === 'senha') {
    const type = showPassword ? 'text' : 'password'
    return (
      <AuthStepTemplate
        title="Crie uma senha"
        description={<>Ela será usada para entrar na conta <strong className="[overflow-wrap:anywhere]">{email}</strong>. Se esquecer, dá para entrar com um código por e-mail.</>}
        step={{ current: 3, total }}
        onBack={() => go('email')}
        footer={footer}
      >
        {general}
        <form onSubmit={handleRegister} noValidate className="space-y-6">
          <ProfileField id="password" label="Senha" hint={`Pelo menos ${MIN_PASSWORD} caracteres.`} error={errorFor('password')} required hideRequirement>
            {a => <input {...a} ref={refFor('password')} type={type} autoComplete="new-password" className={inputClass(errorFor('password'))} value={password} onChange={e => setPassword(e.target.value)} />}
          </ProfileField>
          <ProfileField id="confirmPassword" label="Digite a senha de novo" error={errorFor('confirm')} required hideRequirement>
            {a => <input {...a} ref={refFor('confirm')} type={type} autoComplete="new-password" className={inputClass(errorFor('confirm'))} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />}
          </ProfileField>
          <ShowPasswordToggle checked={showPassword} onChange={setShowPassword} label="Mostrar as senhas" />
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Criar conta'}
          </Button>
        </form>
      </AuthStepTemplate>
    )
  }

  return (
    <AuthStepTemplate
      title="Digite o código que enviamos"
      description={<>Enviamos um código de 6 números para <strong className="[overflow-wrap:anywhere]">{email}</strong>.</>}
      step={{ current: total, total }}
      onBack={() => go(needsPassword ? 'senha' : 'email')}
      footer={footer}
    >
      {info && <Alerta tipo="info" className="mb-6">{info}</Alerta>}
      {general}
      <form onSubmit={handleVerify} noValidate className="space-y-8">
        <CodeField value={code} onChange={setCode} error={errorFor('code')} inputRef={refFor('code')} />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Verificando...' : 'Confirmar e entrar'}
        </Button>
      </form>
      <div className="mt-8 space-y-4">
        <ResendCode onResend={resend} />
        <button type="button" onClick={() => go('email')} className={`min-h-[48px] cursor-pointer text-xl ${linkClass}`}>
          Usar outro e-mail
        </button>
      </div>
    </AuthStepTemplate>
  )
}

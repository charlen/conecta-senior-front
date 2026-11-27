import { useState } from 'react'
import { Button } from '../atoms/Button'
import { Alerta } from '../molecules/Alerta'
import { ProfileField, inputClass } from '../molecules/ProfileField'
import { FieldRequestError, profileApi } from '../../services/profileApi'

type PasswordChangeFormProps = {
  email: string
  onDone: () => void
  onCancel: () => void
}

export function PasswordChangeForm({ email, onDone, onCancel }: PasswordChangeFormProps) {
  const [mode, setMode] = useState<'current' | 'code'>('current')
  const [current, setCurrent] = useState('')
  const [code, setCode] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [show, setShow] = useState(false)
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const errorFor = (f: string) => (fieldError?.field === f ? fieldError.message : undefined)

  const sendCode = async () => {
    setBusy(true)
    setFieldError(null)
    try {
      await profileApi.requestCode(email)
      setMode('code')
      setInfo(`Enviamos um código de 6 números para ${email}. Ele vale por 10 minutos.`)
    } catch (e) {
      setFieldError({ field: 'general', message: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const submit = async () => {
    setFieldError(null)
    if (mode === 'current' && !current) return setFieldError({ field: 'current_password', message: 'Digite sua senha atual.' })
    if (mode === 'code' && !/^\d{6}$/.test(code)) return setFieldError({ field: 'code', message: 'Digite os 6 números do código.' })
    if (next.length < 8) return setFieldError({ field: 'new_password', message: 'A nova senha precisa ter pelo menos 8 caracteres.' })
    if (next !== repeat) return setFieldError({ field: 'repeat', message: 'As duas senhas não estão iguais. Digite de novo.' })
    setBusy(true)
    try {
      await profileApi.changePassword(mode === 'current' ? { current_password: current, new_password: next } : { code, new_password: next })
      onDone()
    } catch (e) {
      const err = e as FieldRequestError
      setFieldError({ field: err.field ?? 'general', message: err.message })
    } finally {
      setBusy(false)
    }
  }

  const type = show ? 'text' : 'password'

  return (
    <div className="space-y-8">
      {info && <Alerta tipo="info">{info}</Alerta>}
      {errorFor('general') && <Alerta tipo="erro">{errorFor('general')}</Alerta>}
      <div className="space-y-6 rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8">
        {mode === 'current' ? (
          <>
            <ProfileField id="current_password" label="Senha atual" required error={errorFor('current_password')}>
              {a => <input {...a} type={type} autoComplete="current-password" className={inputClass(errorFor('current_password'))} value={current} onChange={e => setCurrent(e.target.value)} />}
            </ProfileField>
            <button type="button" onClick={sendCode} disabled={busy}
              className="text-xl text-primary underline underline-offset-4 min-h-[48px] cursor-pointer">
              Não lembro minha senha atual
            </button>
          </>
        ) : (
          <ProfileField id="code" label="Código enviado por e-mail" required hint="São 6 números." error={errorFor('code')}>
            {a => <input {...a} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className={`${inputClass(errorFor('code'))} tracking-[0.4em]`} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} />}
          </ProfileField>
        )}
        <ProfileField id="new_password" label="Nova senha" required hint="Pelo menos 8 caracteres." error={errorFor('new_password')}>
          {a => <input {...a} type={type} autoComplete="new-password" className={inputClass(errorFor('new_password'))} value={next} onChange={e => setNext(e.target.value)} />}
        </ProfileField>
        <ProfileField id="repeat" label="Digite a nova senha de novo" required error={errorFor('repeat')}>
          {a => <input {...a} type={type} autoComplete="new-password" className={inputClass(errorFor('repeat'))} value={repeat} onChange={e => setRepeat(e.target.value)} />}
        </ProfileField>
        <label className="flex items-center gap-4 text-xl min-h-[48px] cursor-pointer">
          <input type="checkbox" className="h-7 w-7 accent-primary" checked={show} onChange={e => setShow(e.target.checked)} />
          Mostrar as senhas
        </label>
      </div>
      <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>Cancelar</Button>
        <Button type="button" variant="primary" onClick={submit} disabled={busy}>{busy ? 'Salvando...' : 'Trocar senha'}</Button>
      </div>
    </div>
  )
}

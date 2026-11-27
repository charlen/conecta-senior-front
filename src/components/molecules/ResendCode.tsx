import { useEffect, useState } from 'react'
import { Button } from '../atoms/Button'
import { formatClock, useCountdown } from '../../hooks/useCountdown'

type ResendCodeProps = {
  /** Resolves when a new code was sent; rejects with an Error whose message is shown. */
  onResend: () => Promise<void>
  /** Seconds to wait before the first/next resend. */
  wait?: number
}

/** "Didn't get it?" help + resend button with a visible countdown. */
export function ResendCode({ onResend, wait = 60 }: ResendCodeProps) {
  const { seconds, start } = useCountdown()
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => start(wait), [start, wait])

  const resend = async () => {
    setBusy(true)
    setFeedback(null)
    try {
      await onResend()
      setFeedback({ ok: true, text: 'Pronto! Enviamos um novo código. Use sempre o mais recente.' })
      start(wait)
    } catch (e) {
      setFeedback({ ok: false, text: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const waiting = seconds > 0
  return (
    <section aria-labelledby="resend-title" className="rounded-3xl bg-slate-50 border-2 border-slate-200 p-6 space-y-4">
      <h2 id="resend-title" className="text-xl font-bold text-slate-900">Não recebeu o código?</h2>
      <ul className="list-disc pl-6 space-y-2 text-lg text-slate-700 leading-relaxed">
        <li>O e-mail pode levar alguns minutos para chegar.</li>
        <li>Procure na <strong>caixa de entrada</strong> e também nas pastas <strong>Spam</strong> ou <strong>Lixo eletrônico</strong>.</li>
        <li>O remetente é <strong>Conecta Senior</strong>. O código vale por 10 minutos.</li>
      </ul>
      <Button type="button" variant="secondary" className="w-full px-4! sm:w-auto sm:px-8! tabular-nums disabled:opacity-100! disabled:bg-slate-100 disabled:text-slate-700" onClick={resend} disabled={busy || waiting}>
        {busy ? 'Enviando...' : waiting ? `Reenviar código em ${formatClock(seconds)}` : 'Reenviar código'}
      </Button>
      <p role="status" className={`text-lg font-semibold ${feedback ? (feedback.ok ? 'text-green-800' : 'text-red-700') : 'sr-only'}`}>
        {feedback?.text ?? (waiting ? '' : 'Você já pode pedir um novo código.')}
      </p>
    </section>
  )
}
